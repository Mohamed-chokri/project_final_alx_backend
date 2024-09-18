import express from "express";
import FilesController from "../controllers/filesController.js";

const router = express.Router();


router.post('/courseImage', FilesController.postCourseImage);
router.post('/userImage', FilesController.postUserImage);
router.get('/userimage/:userId', FilesController.getUserImage);
router.get('/courseimage/:courseId', FilesController.getCourseImage);


router.post('/upload', FilesController.postFile);
router.get('/file/:id', FilesController.getFile);
router.get('/files', FilesController.getUserFiles);

router.delete('/file/:id', FilesController.delFile);

export default router;