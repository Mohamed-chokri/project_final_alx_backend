import jwt  from 'jsonwebtoken';
import User from '../models/Users.js';
import dotenv from 'dotenv';
import {setRefreshTokenCookie} from '../utils/helper.js'
import { AuthenticationError } from "apollo-server-express";

dotenv.config();

const generateAccsessToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
};

const generateRefreshToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d'});
}
export default {
    register: async (_, { fullName, email, password, role }, { res }) => {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error('User already exists');
        }

        const user = new User({ fullName, email, password, role });
        const accessToken = generateAccsessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Set refresh token in HTTP-only cookie
        setRefreshTokenCookie(res, refreshToken);

        // Save user with tokens
        user.accessToken = accessToken;
        user.refreshToken = refreshToken;
        await user.save();

        // Return both tokens as part of the response
        return { 
            accessToken, 
            refreshToken,   // Add refreshToken to the response
            user 
        };
    },

    login: async (_, { email, password }, { res }) => {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('email is not registered');
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        const accessToken = generateAccsessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Set refresh token in HTTP-only cookie
        setRefreshTokenCookie(res, refreshToken);

        // Save user with new tokens
        user.accessToken = accessToken;
        user.refreshToken = refreshToken;
        await user.save();

        // Return both tokens as part of the response
        return { 
            accessToken, 
            refreshToken,   // Add refreshToken to the response
            user 
        };
    },

    refreshToken: async (_, __, { cookies }) => {
        const token = cookies.jid;
        if (!token) {
            throw new Error('Refresh Token is required');
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        } catch (error) {
            throw new Error('Invalid refresh token');
        }

        const user = await User.findById(decoded.id);
        if (!user || token !== user.refreshToken) {
            throw new Error('Refresh token not valid');
        }

        const accessToken = generateAccsessToken(user);

        return { accessToken }; // Return new accessToken
    },

    logout: async (_, __, { user, res }) => {
        if (!user) {
            throw new AuthenticationError('Not Authorized');
        }

        user.accessToken = null;
        user.refreshToken = null;
        await user.save();

        return true;
    }
};
