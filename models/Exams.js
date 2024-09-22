import mongoose from 'mongoose';

// Define Answer Schema
const answerSchema = new mongoose.Schema({
  id: { type: String },
  title: { type: String },
  Questionid: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
  isCorrect: { type: Boolean }
});

// Define Question Schema with nested answers
const questionSchema = new mongoose.Schema({
  id: { type: String },
  title: { type: String },
  description: { type: String },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  sectionId: { type: Number },
  status: { type: String, enum: ['active', 'inactive'] },
  answers: [answerSchema] // Nested array of answers, not required
});

// Define Exam Schema with nested questions
const examSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true },
  sectionId: { type: Number,  },
  questions: [questionSchema] // Nested array of questions, not required
});
const exam = mongoose.model('Exam', examSchema);

export default exam;