import jwt from 'jsonwebtoken';
import User from '../models/Users.js';


const getUserByHeader = async ({ req }) => {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    if (!token) return null;

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        return await User.findById(decodedToken.id);
    } catch (error) {
        return null;
    }
};

export default getUserByHeader
;