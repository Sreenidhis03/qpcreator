// server/routes/questionPaperRoutes.js
import express from 'express';
import QuestionPaper from '../models/questionPaperModel.js';
import userAuth from "../middleware/userAuth.js";
import { generateQuestionPaper, getAllQuestionPapers } from '../controllers/questionPaperController.js';
import React from 'react';
import { renderToStream } from '@react-pdf/renderer';
import QuestionPaperPDF from '../pdfTemplates/QuestionPaperPDF.js'; // Ensure correct path
const router = express.Router();
router.post('/generate-question-paper', userAuth, generateQuestionPaper);
router.get('/get-all-QuestinPapers', getAllQuestionPapers);
router.post('/create', userAuth, async (req, res) => {
  try {
    const {
      collegeName,
      examTitle,
      examMonthYear,
      courseDetails,
      paperCode,
      paperName,
      time,
      maxWeight,
      subject,
      program,
      semester,
      parts
    } = req.body;
    if (!parts || !Array.isArray(parts) || parts.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No parts/sections provided for the question paper.'
      });
    }
    const processedParts = [];
    let calculatedTotalPaperWeight = 0;
    for (const part of parts) {
      if (!part.questions || !Array.isArray(part.questions)) {
        return res.status(400).json({
          success: false,
          message: `Part "${part.partName}" must contain a 'questions' array.`
        });
      }
      const questionsInPart = [];
      let calculatedPartWeight = 0;
      for (const qData of part.questions) {
        if (qData.question && typeof qData.marksAllocated === 'number' && qData.questionText && qData.questionType && qData.bloomsLevel && qData.co) {
          questionsInPart.push({
            question: qData.question,
            marksAllocated: qData.marksAllocated,
            questionText: qData.questionText,
            questionType: qData.questionType,
            bloomsLevel: qData.bloomsLevel,
            co: qData.co
          });
          calculatedPartWeight += qData.marksAllocated;
        } else {
          console.warn(`Incomplete question data for part ${part.partName}. Skipping question.`, qData);
        }
      }
      processedParts.push({
        partName: part.partName,
        moduleName: part.moduleName,
        partCO: part.partCO,
        maxWeightPart: calculatedPartWeight,
        instructions: part.instructions,
        questions: questionsInPart
      });
      calculatedTotalPaperWeight += calculatedPartWeight;
    }
    const newQuestionPaper = new QuestionPaper({
      collegeName,
      examTitle,
      examMonthYear,
      courseDetails,
      paperCode,
      paperName,
      time,
      maxWeight: calculatedTotalPaperWeight,
      program,
      semester,
      subject,
      parts: processedParts,
      createdBy: req.user.id,
      status: 'Draft'
    });
    await newQuestionPaper.save();
    res.status(201).json({
      success: true,
      message: 'Question Paper created successfully!',
      qpId: newQuestionPaper._id
    });
  } catch (error) {
    console.error('Error creating question paper:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create question paper.',
      error: error.message
    });
  }
});
router.get('/:id', userAuth, async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const questionPaper = await QuestionPaper.findById(id).populate({
      path: 'parts.questions.question',
      model: 'Question'
    });
    if (!questionPaper) {
      return res.status(404).json({
        success: false,
        message: 'Question Paper not found.'
      });
    }
    res.status(200).json(questionPaper);
  } catch (error) {
    console.error('Error fetching question paper:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch question paper.',
      error: error.message
    });
  }
});
router.get('/:id/pdf', userAuth, async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const questionPaper = await QuestionPaper.findById(id).populate({
      path: 'parts.questions.question',
      model: 'Question'
    });
    if (!questionPaper) {
      return res.status(404).json({
        success: false,
        message: 'Question Paper not found for PDF generation.'
      });
    }
    const pdfStream = await renderToStream(/*#__PURE__*/React.createElement(QuestionPaperPDF, {
      data: questionPaper
    }));
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${questionPaper.paperCode || 'question_paper'}.pdf"`);
    pdfStream.pipe(res);
    pdfStream.on('end', () => console.log('PDF stream ended.'));
    pdfStream.on('error', err => {
      console.error('Error in PDF stream:', err);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: 'Failed to generate PDF stream.'
        });
      }
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: 'Failed to generate PDF.',
        error: error.message
      });
    }
  }
});
export default router;