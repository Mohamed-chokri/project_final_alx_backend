import jwt  from 'jsonwebtoken';
import User from '../models/Users.js';
import dotenv from 'dotenv';
import e from "express";
dotenv.config();

const generateAccsessToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
};

const generateRefreshToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d'});
}
export default {
    register: async (_, { fullName, email, password, role }) => {

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error('User already exists');
        }

        // Create a new user
        const user = new User({ fullName, email, password, role });
        await user.save();

        // Return the token
        const accessToken = generateAccsessToken(user);
        const refreshToken = generateRefreshToken(user);
        user.refreshToken = refreshToken;
        await user.save()
        return { accessToken, refreshToken, user };
    },

    login: async (_, { email, password }) => {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }
        const accessToken = generateAccsessToken(user);
        const refreshToken = generateRefreshToken(user);
        user.refreshToken = refreshToken;
        await user.save()
        return { accessToken, refreshToken,user };
    },

    refreshToken: async (_, { refreshToken }) => {
        if (!refreshToken) {
            throw new Error('Refresh Token is required');
        }
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decoded.id);
        if (!user || refreshToken !== user.refreshToken)
        {
            throw new Error('refreshToken is not valid');
        }
        try{
            const newAccessToken = generateAccsessToken(user);
            const newRefreshToken = generateRefreshToken(user);
            user.refreshToken = newRefreshToken;
            await user.save();
            return{accessToken: newAccessToken, refreshToken: newRefreshToken};
        } catch (error){
            throw new Error('Invalid refresh token')
        }
    },
    logout: async (_, __, { user }) => {
        if (!user) {
            throw new Error('Authentication required');
        }

        user.refreshToken = null;
        await user.save();

        return true;
    }
}
