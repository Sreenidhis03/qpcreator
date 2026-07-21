// server/controllers/questionPaperController.js
import Question from '../models/questionsModel.js'; // Adjust path as per your project structure
import QuestionPaper from '../models/questionPaperModel.js'; // Adjust path as per your project structure
import User from '../models/userModel.js'; // Assuming you have a User model for createdBy reference

// Helper function to shuffle an array (Fisher-Yates)
const shuffleArray = array => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// Main controller function to generate the question paper
export const generateQuestionPaper = async (req, res) => {
  try {
    const {
      collegeName,
      examTitle,
      examMonthYear,
      courseDetails,
      paperCode,
      paperName,
      // This comes from selectedSubject on frontend now
      time,
      maxWeight,
      program,
      semester,
      subject,
      parts,
      // Array of part configurations from frontend
      createdBy // HOD's user ID
    } = req.body;

    // Basic validation (more robust validation can be added with express-validator)
    if (!collegeName || !examTitle || !examMonthYear || !courseDetails || !paperCode || !paperName || !time || !maxWeight || !program || !semester || !subject || !parts || parts.length === 0 || !createdBy) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields for question paper generation."
      });
    }

    // Verify if the createdBy user exists and is an HOD (optional, but good for security)
    const hod = await User.findById(createdBy);
    if (!hod || hod.role.toLowerCase() !== 'hod') {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: Only HODs can create question papers."
      });
    }
    const generatedParts = [];
    let totalGeneratedWeightage = 0;
    for (const partConfig of parts) {
      const {
        partName,
        moduleNumber,
        instructions,
        partCO,
        expectedPartWeightage
      } = partConfig;

      // Ensure modules and COs are arrays
      if (!Array.isArray(moduleNumber) || moduleNumber.length === 0) {
        return res.status(400).json({
          success: false,
          message: `Part "${partName}" must specify at least one module.`
        });
      }
      if (!Array.isArray(partCO) || partCO.length === 0) {
        return res.status(400).json({
          success: false,
          message: `Part "${partName}" must specify at least one CO.`
        });
      }

      // Query questions based on criteria for this part
      // We use $in for moduleNumber and cos to match any of the selected options
      // This query now works correctly with moduleNumber as an array in the schema
      let availableQuestions = await Question.find({
        program: program,
        semester: semester,
        subject: subject,
        moduleNumber: {
          $in: moduleNumber
        },
        // This is correct for querying an array field with an array
        cos: {
          $in: partCO
        }
      });

      // --- DEBUGGING HELP: Add these console.logs temporarily ---
      console.log(`--- Part: ${partName} ---`);
      console.log("Querying with:", {
        program,
        semester,
        subject,
        moduleNumber,
        partCO
      });
      console.log("Found available questions:", availableQuestions.length);
      // --- END DEBUGGING HELP ---

      // Shuffle available questions to introduce some randomness
      availableQuestions = shuffleArray(availableQuestions);
      let currentPartWeightage = 0;
      const selectedQuestionsForPart = [];
      const selectedQuestionIds = new Set(); // To prevent adding the exact same question twice in a part

      // Greedy approach to select questions to meet the expected weightage
      // Prioritize higher weightage questions to meet the target faster
      availableQuestions.sort((a, b) => b.weightage - a.weightage); // Sort by weightage descending

      for (const question of availableQuestions) {
        // If adding this question doesn't exceed the expected weightage for this part
        // AND this question hasn't already been selected for this part
        if (currentPartWeightage + question.weightage <= expectedPartWeightage && !selectedQuestionIds.has(question._id.toString())) {
          selectedQuestionsForPart.push({
            question: question._id,
            marksAllocated: question.weightage,
            questionText: question.questionText,
            questionType: question.type,
            // Assuming 'type' field in Question model is questionType
            bloomsLevel: question.bloomsLevel,
            co: question.cos // Assuming 'cos' field in Question model is co
            // If you need moduleNumber here for display, add it from question.moduleNumber
          });
          currentPartWeightage += question.weightage;
          selectedQuestionIds.add(question._id.toString());
        }
        // If we've met or exceeded the target, stop adding questions for this part
        if (currentPartWeightage >= expectedPartWeightage) {
          break;
        }
      }

      // If, after the greedy selection, the weightage is not met,
      // try to add smaller questions to get closer without exceeding too much.
      // This is a simple refinement. More complex algorithms exist (e.g., subset sum).
      if (currentPartWeightage < expectedPartWeightage) {
        // Sort by weightage ascending for smaller questions
        availableQuestions.sort((a, b) => a.weightage - b.weightage);
        for (const question of availableQuestions) {
          if (currentPartWeightage + question.weightage <= expectedPartWeightage && !selectedQuestionIds.has(question._id.toString())) {
            selectedQuestionsForPart.push({
              question: question._id,
              marksAllocated: question.weightage,
              questionText: question.questionText,
              questionType: question.type,
              bloomsLevel: question.bloomsLevel,
              co: question.cos
            });
            currentPartWeightage += question.weightage;
            selectedQuestionIds.add(question._id.toString());
          }
          if (currentPartWeightage >= expectedPartWeightage) {
            break;
          }
        }
      }

      // Handle scenario if not enough questions were found to meet the criteria
      if (selectedQuestionsForPart.length === 0) {
        console.warn(`No questions selected for Part "${partName}" with criteria: Modules ${moduleNumber}, COs ${partCO}`);
      } else if (currentPartWeightage < expectedPartWeightage) {
        console.warn(`Could not reach exact expected weightage for Part "${partName}". Expected: ${expectedPartWeightage}, Generated: ${currentPartWeightage}`);
      }
      generatedParts.push({
        partName,
        moduleName: moduleNumber.join(', '),
        // Join selected modules for moduleName field
        partCO: partCO.join(', '),
        // Join selected COs for partCO field
        maxWeightPart: currentPartWeightage,
        // Use actual generated weightage
        instructions,
        questions: selectedQuestionsForPart
      });
      totalGeneratedWeightage += currentPartWeightage;
    }

    // Create the new QuestionPaper document
    const newQuestionPaper = new QuestionPaper({
      collegeName,
      examTitle,
      examMonthYear,
      courseDetails,
      paperCode,
      paperName,
      time,
      maxWeight: totalGeneratedWeightage,
      // Total max weight is sum of generated parts
      program,
      // Added to store these top-level criteria on the QP
      semester,
      // Added
      subject,
      // Added
      parts: generatedParts,
      createdBy,
      status: 'Draft' // Initial status
    });
    await newQuestionPaper.save();
    res.status(201).json({
      success: true,
      message: "Question paper generated successfully",
      questionPaperId: newQuestionPaper._id
    });
  } catch (error) {
    console.error("Error generating question paper:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during question paper generation."
    });
  }
};
export const getAllQuestionPapers = async (req, res) => {
  try {
    const papers = await QuestionPaper.find();
    res.status(200).json({
      success: true,
      data: papers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch question paper.",
      error: error.message
    });
  }
};
export const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find().populate("teacherId", "name email role");
    res.status(200).json({
      success: true,
      count: questions.length,
      questions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch questions",
      error: error.message
    });
  }
};