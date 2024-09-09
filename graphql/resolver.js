import User from '../models/Users.js';
import Course from '../models/Courses.js';
import Exam from '../models/Exams.js';
import chatController from '../controllers/chatController.js'
import { PubSub } from "graphql-subscriptions";
import authController from "../controllers/authController.js";

const pubsub =  new PubSub();
const NEW_MESSAGE = 'NEW_MESSAGE';

const resolvers = {
  //here normally the queries (parent if exists, id, loader context)
  Query: {
    user: (_, { id }, { loaders }) => loaders.userLoader.load(id),
    users: async (_, { page = 1, limit = 10 }) => {
      const skip = (page - 1) * limit;
      const [users, total] = await Promise.all([
        User.find().lean().skip(skip).limit(limit),
        User.countDocuments()
      ]);
      return {
        users,
        totalPages: Math.ceil(total / limit),
        currentPage: page
      };
    },
    course: (_, { id }, { loaders }) => loaders.courseLoader.load(id),
    courses: async (_, { page = 1, limit = 10 }) => {
      const skip = (page - 1) * limit;
      const [courses, total] = await Promise.all([
        Course.find().lean().skip(skip).limit(limit),
        Course.countDocuments()
      ]);
      return {
        courses,
        totalPages: Math.ceil(total / limit),
        currentPage: page
      };
    },
    exam: (_, { id }, { loaders }) => loaders.examLoader.load(id),
    exams: async (_, { page = 1, limit = 10 }) => {
      const skip = (page - 1) * limit;
      const [exams, total] = await Promise.all([
        Exam.find().lean().skip(skip).limit(limit),
        Exam.countDocuments()
      ]);
      return {
        exams,
        totalPages: Math.ceil(total / limit),
        currentPage: page
      };
    },
    messages: async (_, { limit }) => {
      return await chatController.getMessages(limit);
    }
  },


  Mutation: {
    //here the mutation the same except we mutate so more logic
    addUser: async (_, args, { loaders }) => {
      try {
        const user = new User(args);
        await user.save();
        return loaders.userLoader.load(user.id); // Use DataLoader for consistency
      } catch (error) {
        console.error('Error adding user:', error);
        throw new Error('Failed to add user');
      }
    },
    addCourse: async (_, { title, description, instructorId }, { loaders }) => {
      try {
        const course = new Course({ title, description, instructor: instructorId });
        await course.save();
        return loaders.courseLoader.load(course.id);
      } catch (error) {
        console.error('Error adding course:', error);
        throw new Error('Failed to add course');
      }
    },
    addExam: async (_, { title, courseId, questions, createdById, duration }, { loaders }) => {
      try {
        const exam = new Exam({ title, course: courseId, questions, createdBy: createdById, duration });
        await exam.save();
        return loaders.examLoader.load(exam.id);
      } catch (error) {
        console.error('Error adding exam:', error);
        throw new Error('Failed to add exam');
      }
    },
    register: authController.register,
    login: authController.login,
      sendMessage: async (_,{content, senderId}) => {
        const message = await chatController.createMessage(content, senderId);
        pubsub.publish(NEW_MESSAGE, { newMessage: message});
        return message;
      }
  },
  //here is another part of graphql capabilitis the subscription to message.
  Subscription: {
    newMessage: {
      subscribe: () => pubsub.asyncIterator(NEW_MESSAGE)
    }
  },
  // This is for nestation so parent is important
  Message: {
    sender: async (parent, _, { loaders }) => await loaders.userLoader.load(parent.sender)
  },
  User: {
    enrolledCourses: async (parent, _, { loaders }) => {
      if (parent.enrolledCourses && parent.enrolledCourses.length > 0) {
        return loaders.courseLoader.loadMany(parent.enrolledCourses);
      }
      return [];
    },
    createdExams: async (parent, _, { loaders }) => {
      if (parent.createdExams && parent.createdExams.length > 0) {
        return loaders.examLoader.loadMany(parent.createdExams);
      }
      return [];
    },
  },
  Course: {
    instructor: (parent, _, { loaders }) => loaders.userLoader.load(parent.instructor),
    enrolledStudents: async (parent, _, { loaders }) => {
      if (parent.enrolledStudents && parent.enrolledStudents.length > 0) {
        return loaders.userLoader.loadMany(parent.enrolledStudents);
      }
      return [];
    },
    exams: async (parent, _, { loaders }) => {
      if (parent.exams && parent.exams.length > 0) {
        return loaders.examLoader.loadMany(parent.exams);
      }
      return [];
    },
  },
  Exam: {
    course: (parent, _, { loaders }) => loaders.courseLoader.load(parent.course),
    createdBy: (parent, _, { loaders }) => loaders.userLoader.load(parent.createdBy),
  },
};







export default resolvers;
