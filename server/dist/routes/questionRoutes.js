// routes/questionRoutes.js (UPDATED)
import express from "express";
import Question from "../models/questionsModel.js"; // Import your Question model
import userAuth from "../middleware/userAuth.js"; // Your existing middleware
import { getAllQuestions } from "../controllers/questionPaperController.js";
const questionRouter = express.Router();

// Add a single question
questionRouter.post("/", userAuth, async (req, res) => {
  try {
    // req.body now contains a single question object
    const {
      teacherId,
      program,
      semester,
      subject,
      moduleNumber,
      // Changed from 'module' to 'moduleNumber' to match frontend
      moduleName,
      questionText,
      // Changed from 'text' to 'questionText' to match frontend
      weightage,
      bloomsLevel,
      type,
      answer,
      // If you plan to save answers
      cos
    } = req.body;

    // Basic validation for required fields
    if (!teacherId || !program || !semester || !subject || !moduleNumber || !questionText || !weightage || !bloomsLevel || !type || !cos) {
      return res.status(400).json({
        message: "Missing required question fields."
      });
    }
    const newQuestion = new Question({
      teacherId,
      program,
      semester,
      subject,
      moduleNumber,
      moduleName,
      questionText,
      // Use questionText
      weightage,
      bloomsLevel,
      type,
      answer,
      // Include answer if your schema has it
      cos
    });
    await newQuestion.save(); // Save the single question
    res.status(201).json({
      message: "Question saved successfully!",
      question: newQuestion
    });
  } catch (err) {
    console.error("Error saving single question:", err);
    // Check for validation errors from Mongoose
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        error: err.message,
        details: err.errors
      });
    }
    res.status(500).json({
      error: err.message
    });
  }
});

// Get all questions by teacher (your existing logic - should work fine with `teacherId` from query)
questionRouter.get("/", userAuth, async (req, res) => {
  try {
    const {
      teacherId,
      program,
      semester,
      subject,
      moduleNumber,
      bloomsLevel,
      type,
      cos
    } = req.query; // Added all possible filters
    const filter = {};

    // Important: Ensure the teacherId from the query matches the authenticated user's ID
    // This prevents one teacher from fetching another's questions.
    if (req.user && req.user._id) {
      // req.user is set by userAuth middleware
      if (teacherId && req.user._id.toString() !== teacherId) {
        return res.status(403).json({
          message: "Forbidden: You can only view your own questions."
        });
      }
      filter.teacherId = req.user._id; // Use the authenticated user's ID
    } else {
      return res.status(401).json({
        message: "Authentication required to fetch questions."
      });
    }

    // Add other filters if present in query
    if (program) filter.program = program;
    if (semester) filter.semester = semester;
    if (subject) filter.subject = subject;
    if (moduleNumber) filter.moduleNumber = moduleNumber;
    if (bloomsLevel) filter.bloomsLevel = bloomsLevel;
    if (type) filter.type = type;
    if (cos) filter.cos = cos;
    const questions = await Question.find(filter).sort({
      createdAt: -1
    });
    res.json(questions);
  } catch (err) {
    console.error("Error fetching questions:", err);
    res.status(500).json({
      error: err.message
    });
  }
});

// Delete question by ID
questionRouter.delete('/:id', userAuth, async (req, res) => {
  try {
    const {
      id
    } = req.params;
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        message: "Authentication required to delete questions."
      });
    }

    // Find the question and ensure it belongs to the authenticated teacher
    const question = await Question.findOne({
      _id: id,
      teacherId: req.user._id
    });
    if (!question) {
      return res.status(404).json({
        message: 'Question not found or you do not have permission to delete it.'
      });
    }
    await Question.deleteOne({
      _id: id
    }); // Use deleteOne or findByIdAndDelete
    res.status(200).json({
      message: 'Question deleted successfully!'
    });
  } catch (err) {
    console.error("Error deleting question:", err);
    res.status(500).json({
      error: err.message
    });
  }
});
questionRouter.get("/all", getAllQuestions);
export default questionRouter;