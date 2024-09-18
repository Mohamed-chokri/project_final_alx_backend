import mongoose, { Schema } from "mongoose";

const MessageSchema =new Schema({
    sender: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    content: {type: String, required: true},
    createdAt: {type: Date, default: Date.now}
});

const Messages = mongoose.model('Message', MessageSchema);
export default Messages;