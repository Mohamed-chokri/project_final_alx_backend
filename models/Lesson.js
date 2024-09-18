import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String },
  description: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }, 
  videoUrl: { type: String },
  pdfurl: { type: String }
});

const Lesson = mongoose.model("Lesson", lessonSchema);

export default Lesson;