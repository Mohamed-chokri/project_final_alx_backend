import jwt from 'jsonwebtoken';
import User from '../models/Users.js';


export const getUserByHeader = async ({ req }) => {
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

export function setRefreshTokenCookie(res, refreshToken) {
    res.cookie('jid', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Only use HTTPS in production
        sameSite: 'Lax',
        path: '/refresh_token',
    });
}

export default {getUserByHeader, setRefreshTokenCookie};
