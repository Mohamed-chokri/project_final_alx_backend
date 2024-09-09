import jwt  from 'jsonwebtoken';
import User from '../models/Users.js';
import dotenv from 'dotenv';
dotenv.config();

const generateToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

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
        const token = generateToken(user);
        return { token, user };
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

        const token = generateToken(user);
        return { token, user };
    }
};
