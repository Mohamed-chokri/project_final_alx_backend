import mongoose from 'mongoose'

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  lessons: [{
    title: String,
    content: String
  }],
  enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  exams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exam' }],
  createdDate: { type: Date, default: Date.now },
  imageId: {type: mongoose.Schema.Types.ObjectId, ref: 'Image', required: false},
});

const Course = mongoose.model('Course', courseSchema);

export default Course;
