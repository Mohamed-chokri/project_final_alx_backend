import mongoose from 'mongoose'

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
<<<<<<< HEAD
  lessons: [{
    title: String,
    content: String
  }],
  enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  exams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exam' }],
  createdDate: { type: Date, default: Date.now },
  imageId: {type: mongoose.Schema.Types.ObjectId, ref: 'Image', required: false},
=======
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }, 
  lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', default: [] }],
  exams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exam', default: [] }],
>>>>>>> edit_graphql_logic
});

const Course = mongoose.model('Course', courseSchema);

export default Course;
