import mongoose from 'mongoose'
const sectionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    Courseid: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }]
  });

  const Section = mongoose.model('Section', sectionSchema);

  export default Section