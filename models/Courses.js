import mongoose from 'mongoose'

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
  enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  exams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exam' }],
  sections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Section' }]
});

const Course = mongoose.model('Course', courseSchema);

export default Course;
