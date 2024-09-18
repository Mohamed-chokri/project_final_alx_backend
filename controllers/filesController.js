
import { getUserByHeader, streamAndDocumentHandler, fileGetter } from "../utils/helper.js";
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Image, File } from "../models/Files.js";
import { Types } from 'mongoose';
import Course from "../models/Courses.js";

const BASE_FOLDER_PATH = process.env.FOLDER_PATH || '/tmp/files_manager'; //put here your windows path

class FilesController {
    static async postFile(req, res) {
        await FilesController.handleFileUpload(req, res, 'files', File);
    }

    static async postUserImage(req, res) {
        await FilesController.handleFileUpload(req, res, 'user_images', Image, true);
    }

    static async postCourseImage(req, res) {
        try {
            const user = await getUserByHeader(req);
            if (!user) {
                return res.status(401).json({ error: 'Not Authorized' });
            }
            const { name, courseId } = req.body;

            if (!Types.ObjectId.isValid(courseId)) {
                return res.status(400).json({ error: 'Invalid course ID format' });
            }

            const course = await Course.findById(courseId);
            if (!course) {
                return res.status(404).json({ error: 'Course not found' });
            }

            const { data } = req.body;
            if (!data) {
                return res.status(400).json({ error: 'No image data provided' });
            }

            const oldFile = await Image.findOneAndDelete({ owner: user.id, courseId });
            if (oldFile) {
                try {
                    fs.unlinkSync(path.resolve(oldFile.localPath));
                } catch (error) {}
            }

            const buffer = Buffer.from(data, 'base64');
            const folderPath = path.join(process.env.FOLDER_PATH, 'course_image');
            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath, { recursive: true });
            }

            const fileName = `${uuidv4()}`;
            const localPath = path.join(folderPath, fileName);

             fs.writeFileSync(localPath, buffer);

            const newImage = new Image({ owner: user.id, name, courseId, localPath });
            await newImage.save();

            return res.status(201).json({ message: 'Image uploaded successfully', image: newImage });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async handleFileUpload(req, res, folderName, Model, replaceExisting = false) {
        try {
            const user = await getUserByHeader(req);
            if (!user) {
                return res.status(401).json({ error: 'Not Authorized' });
            }

            const { name } = req.body;
            if (!name) {
                return res.status(400).json({ error: 'Missing name' });
            }

            const folderPath = path.join(BASE_FOLDER_PATH, folderName);
            fs.mkdirSync(folderPath, { recursive: true });

            if (replaceExisting) {
                const oldFile = await Model.findOneAndDelete({ owner: user.id });
                if (oldFile) {
                    fs.unlinkSync(path.resolve(oldFile.localPath));
                }
            }

            const localPath = path.join(folderPath, uuidv4());
            return await streamAndDocumentHandler(req, res, localPath, user, Model);
        } catch (error) {
            console.error(`Error in ${folderName} upload:`, error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    static async getFile(req, res) {
        await fileGetter(req, res, File);
    }

    static async getUserImage(req, res) {
        const userId = req.params.userId;
        if (!Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'Invalid user ID format' });
        }
        const image = await Image.findOne({ owner: userId, courseId: null });
        if (!image) {
            res.status(404).json({ error: 'No image found' })
        }
        return res.status(201).sendFile(path.resolve(image.localPath));
    }

    static async getCourseImage(req, res) {
        const courseId = req.params.courseId;
        if (!Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({ error: 'Invalid course ID format' });
        }
        const image = await Image.findOne({ courseId });
        if (!image) {
           return res.status(404).json({ error: 'No image found' })
        }
        return res.status(201).sendFile(path.resolve(image.localPath));
    }


    static async getUserFiles(req, res) {
        try {
            const user = await getUserByHeader(req);
            if (!user) {
                return res.status(401).json({ error: 'Not Authorized' });
            }

            const userFiles = await File.find({ owner: user.id });
            return userFiles.length === 0
                ? res.status(404).json({ error: 'No files found' })
                : res.status(200).json({ files: userFiles });
        } catch (error) {
            console.error('Error retrieving user files:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    static async delFile(req, res) {
        try {
            const user = await getUserByHeader(req);
            if (!user) {
                return res.status(401).json({ error: 'Not Authorized' });
            }

            const fileId = req.params.id;
            if (!Types.ObjectId.isValid(fileId)) {
                return res.status(400).json({ error: 'Bad ID Format' });
            }

            const file = await File.findById(fileId);
            if (!file) {
                return res.status(404).json({ error: 'File not found' });
            }

            if (user.id !== file.owner.toString()) {
                return res.status(403).json({ error: 'Forbidden: Not the owner' });
            }

            fs.unlinkSync(file.localPath);
            await File.findByIdAndDelete(fileId);
            return res.status(200).json({ message: 'File deleted successfully' });
        } catch (error) {
            console.error('Error deleting file:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

export default FilesController;
