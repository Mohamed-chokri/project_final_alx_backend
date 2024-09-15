import mongoose from "mongoose";
const enrollmentSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  sectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Section'
  },
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson'
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  enrollmentDate: {
    type: String,
    required: true
  },
  studentName: {
    type: String,
    required: true
  },
  progress: {
    type: Number
  },
  status: {
    type: String
  }
});

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

export default Enrollment