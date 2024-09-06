import express from "express";
import chatController from '../controllers/chatController';

const router = express.Router()

router.get('/messages', chatController.getMessages);
router.post('/messages', chatController.sendMessage);

export default chatController;
