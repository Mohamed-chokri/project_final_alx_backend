import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  answers: [
    {
      title: { type: String, required: true },
      isCorrect: { type: Boolean, required: true }
    }
  ]
});

const Question = mongoose.model("Question", questionSchema);

export default Question;