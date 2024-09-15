import mongoose from "mongoose";
const answerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  isCorrect: {
    type: Boolean,
    required: true
  }
});

const Answer = mongoose.model('Answer', answerSchema);

export default Answer;
