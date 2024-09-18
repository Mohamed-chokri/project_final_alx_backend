import jwt from 'jsonwebtoken';
import User from '../models/Users.js';
import fs from 'fs';
import path from 'path';
import stream from 'stream';
import { Types } from 'mongoose';


export const getUserByHeader = async (req) => {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    if (!token) {
        return null;
    };
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const  user = await User.findById(decodedToken.id);
        if (!user || user.accessToken !== token) {
            return null;
        }
        return user;
    } catch (error) {
        return null;
    }
};

export function setRefreshTokenCookie(res, refreshToken) {
    res.cookie('jid', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Only use HTTPS in production
        sameSite: 'Lax',
        path: '/refresh_token',
    });
    }
export const streamAndDocumentHandler = async (req, res, localPath, user, Model) => {
    try {
        const bufferStream = new stream.PassThrough();
        bufferStream.end(Buffer.from(req.body.data, 'base64'));
        const writeStream = fs.createWriteStream(localPath);
        bufferStream.pipe(writeStream);

        await new Promise((resolve, reject) => {
            writeStream.on('finish', resolve);
            writeStream.on('error', reject);
        });

        const newFile = new Model({ owner: user.id, localPath, name: req.body.name });
        await newFile.save();

        return res.status(201).json(newFile);
    } catch (error) {
        console.error('Error in file upload:', error);
        return res.status(500).json({ error: 'Error saving file' });
    }
};

export const fileGetter = async (req, res, Model) => {
    const id = req.params.id;
    if (!Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Bad ID Format' });
    }
    const fileDocument = await Model.findById(id);
    if (!fileDocument) {
        return res.status(404).json({ error: 'Not found' });
    }
    try {
        if (!fs.existsSync(fileDocument.localPath)) {
            return res.status(404).json({ error: 'File not found on server' });
        }

        res.sendFile(path.resolve(fileDocument.localPath));
    } catch (error) {
        console.error('Error retrieving file:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};