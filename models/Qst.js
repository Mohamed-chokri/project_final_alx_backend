import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    questionText: { type: String, required: true },
    options: [{ type: String }],
    correctAnswer: { type: String, required: true },
    exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true }
  });

  const Question = mongoose.model("Question", questionSchema);

  export default Question