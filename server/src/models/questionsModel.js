// server/models/questionsModel.js
import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    program: { type: String, required: true },
    semester: { type: String, required: true },
    subject: { type: String, required: true },
    moduleNumber: { type: [String], required: true }, // <--- CORRECTED: Changed to array of strings
    moduleName: { type: String, required: true },
    questionText: { type: String, required: true },
    weightage: { type: Number, required: true, min: 1 },
    bloomsLevel: {
        type: String,
        enum: ['U', 'A', 'R', 'An', 'E', 'C'], // Ensure these match your academicData and DB values
        required: true
    },
    type: {
        type: String,
        enum: ['Multiple Choice', 'Short Answer', 'Long Answer'], // Ensure these match your academicData and DB values
        required: true,
        default: 'Short Answer'
    },
    answer: { type: String },
    cos: {
        type: [String], // Already an array of strings, which is good
        required: true
    },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Question", questionSchema);