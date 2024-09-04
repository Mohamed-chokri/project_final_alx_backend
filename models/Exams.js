const mongoose = require('mongoose'); // Import mongoose

const examSchema = new mongoose.Schema({
  title: { type: String, required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true }, // Course ID
  questions: [{
    questionText: { type: String, required: true },
    options: [String], // Multiple choice options
    correctAnswer: { type: String, required: true }
  }], // Array of questions
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Instructor who created the exam
  dateCreated: { type: Date, default: Date.now },
  duration: { type: Number, required: true } // Duration in minutes
});

const Exam = mongoose.model('Exam', examSchema);

module.exports = Exam;
