import { Schema, model } from "mongoose";

const fileSchema = new Schema({
    name: {type: String, required: true},
    owner: {type: Schema.Types.ObjectId, ref:'User', required: true},
    localPath: {type: String, required: true},
    courseId: {type: Schema.Types.ObjectId, ref: 'Course', default: null},
});

export const File = model('File', fileSchema);
export const Image = model('Image', fileSchema)