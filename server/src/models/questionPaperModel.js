// server/models/questionPaperModel.js

import mongoose from "mongoose";

// Schema for a reference to a question within a part of the question paper
const QuestionReferenceSchema = new mongoose.Schema({
    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question', // References your separate Question model
        required: true
    },
    marksAllocated: { // Marks specifically for this question in THIS paper
        type: Number,
        required: true,
        min: 0
    },
    // Adding fields from the Question model for easier access/display without full population
    // These should ideally mirror what's in the actual Question model at the time of paper creation
    questionText: { type: String, required: true }, // Add questionText
    questionType: { // Add questionType
        type: String,
        enum: ['MCQ', 'Short Answer', 'Long Answer'],
        required: true,
    },
    bloomsLevel: { 
        type: String,
        enum: ['U', 'A', 'R', 'An', 'E', 'C'], // Assuming these are your valid levels
        required: true,
    },
    co: {
    type: [String], // <-- Change to array of strings
    required: true,
},
    // Optional: if you want to store module info here for quick reference
    // moduleNumber: { type: String },
    // moduleName: { type: String },
}, { _id: false });


// Schema for each part/module of the question paper (e.g., Part A, Part B)
const PartSchema = new mongoose.Schema({
    partName: { // e.g., "Part A", "Part B"
        type: String,
        required: true,
    },
    moduleName: { // e.g., "Module 1", "Module 2"
        type: String,
        required: false,
    },
    partCO: { // Course Outcome related to this part, e.g., "CO 1"
        type: String,
        required: true,
    },
    maxWeightPart: { // Maximum weightage for this specific part (e.g., 7)
        type: Number,
        required: true,
        min: 0
    },
    instructions: { // e.g., "Answer all Questions", "Answer any 3 questions"
        type: String,
        default: "Answer all Questions",
    },
    questions: { // Array of references to Question documents for this part
        type: [QuestionReferenceSchema],
        default: [],
    }
}, { _id: false });


// Main Question Paper Schema
const questionPaperSchema = new mongoose.Schema({
    // --- Core Paper Details (from your sample header image) ---
    collegeName: {
        type: String,
        required: true,
        default: "BHARATA MATA COLLEGE AUTONOMOUS"
    },
    examTitle: { // Full title like "FIRST INTERNAL EXAMINATION"
        type: String,
        required: true
    },
    examMonthYear: { // e.g., "AUGUST 2024"
        type: String,
        required: true
    },
    courseDetails: { // e.g., "INTEGRATED M.Sc.CS Internal Examination, Semester I"
        type: String,
        required: true
    },
    paperCode: { // e.g., "241ICSCR02"
        type: String,
        required: true
    },
    paperName: { // e.g., "INTRODUCTION TO COMPUTER"
        type: String,
        required: true
    },
    time: { // e.g., "1.5 Hours"
        type: String,
        required: true
    },
    maxWeight: { // e.g., 14 (total weight for the paper)
        type: Number,
        required: true,
        min: 0
    },

    // --- Admin/Tracking Info ---
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['Draft', 'Approved', 'Finalized'],
        default: 'Draft',
    },

    // Structure of the paper with parts/modules
    parts: {
        type: [PartSchema],
        default: [],
    }
});

const QuestionPaper = mongoose.model('QuestionPaper', questionPaperSchema);

export default QuestionPaper;