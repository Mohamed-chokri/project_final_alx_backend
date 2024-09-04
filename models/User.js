const mongoose = require('mongoose'); // Import Mongoose

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  createdExams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exam' }],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
