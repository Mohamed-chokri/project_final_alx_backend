import { Schema } from "mongoose";

const MessageSchema =new Schema({
    sender: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    content: {type: String, required: true},
    createdAt: {type: String, required: true}
});

export default MessageSchema;
