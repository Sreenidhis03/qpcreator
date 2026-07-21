import express from "express"; // Keep all your imports as they were
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./config/mongodb.js";
import userRouter from "./routes/userRoutes.js";
import authRouter from "./routes/authroutes.js";
import questionRouter from "./routes/questionRoutes.js";
import questionPaperRouter from "./routes/questionPaperRoutes.js";
dotenv.config();
const app = express();
const port = process.env.PORT || 4000;
connectDB();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.get("/", (req, res) => {
  console.log("✅ API hit!");
  res.send("✅ API is Working!");
});
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/questions", questionRouter);
app.use("/api/question-papers", questionPaperRouter);
app.listen(port, () => {
  console.log(`✅ Server started on PORT: ${port}`);
});