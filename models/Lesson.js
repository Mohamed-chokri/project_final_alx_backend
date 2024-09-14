import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  description: { type: String, required: true },
  Sectionid: { type: mongoose.Schema.Types.ObjectId, ref: 'Section', required: true },
  videoUrl: { type: String },
  pdfurl: { type: String }
});

const Lesson = mongoose.model("Lesson", lessonSchema);

export default Lesson;