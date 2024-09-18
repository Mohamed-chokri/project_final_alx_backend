import mongoose from 'mongoose'

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }, 
  lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', default: [] }],
  exams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exam', default: [] }],
});

const Course = mongoose.model('Course', courseSchema);

export default Course;