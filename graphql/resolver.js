import User from '../models/Users.js';
import Course from '../models/Courses.js';
import Exam from '../models/Exams.js';
import Lesson from '../models/Lesson.js'
import Section from '../models/Section.js'
import Question from '../models/Qst.js'
import Answer from '../models/Answer.js'
import Enrollment from '../models/Enrollment.js'

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
    courseByCategory: async (_, { category }) => {
      try {
        const courses = await Course.find({ category });
        return courses;
      } catch (error) {
        throw new Error('Failed to fetch courses');
      }
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
    addCourse: async (_, { title, description, instructorId ,category}, { loaders }) => {
      try {
        const course = new Course({ title, description, instructor: instructorId,category });
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
    addSection: async (_, { title, courseId, lessons }, { loaders }) => {
      try {
        const section = new Section({ title, Courseid: courseId });
    
        if (lessons) {
          section.lessons = lessons;
        }
    
        const savedSection = await section.save();
        return loaders.sectionLoader.load(savedSection._id.toString());
      } catch (error) {
        console.error('Error adding section:', error.message, error.stack); // Detailed error logging
        throw new Error('Failed to add section');
      }
    },
    
    addLesson: async (_, { title, description, sectionId,content, videoUrl, pdfUrl }, { loaders }) => {
      try {
        const lesson = new Lesson({ title, description,  section: sectionId,  content, videoUrl, pdfUrl });
        const savedLesson = await lesson.save();
        return loaders.lessonLoader.load(savedLesson._id.toString());
      } catch (error) {
        console.error('Error adding lesson:', error.message, error.stack);
        throw new Error('Failed to add lesson');
      }
    },
    
    
    addExam: async (_, { title, description, courseId, sectionId, lessonId, questions, createdById, duration }, { loaders }) => {
      try {
        // Create a new Exam instance
        const exam = new Exam({
          title,
          description,
          course: courseId,
          section: sectionId,
          lesson: lessonId,
          questions,
          createdBy: createdById,
          duration
        });
    
        // Save the exam to the database
        const savedExam = await exam.save();
    
        // Optional: Handle questions if needed
        if (questions && questions.length > 0) {
          // Process questions separately if required
        }
    
        // Return the saved exam using the loader
        return loaders.examLoader.load(savedExam.id);
      } catch (error) {
        // Log detailed error information
        console.error('Error adding exam:', error.message);
        console.error('Stack trace:', error.stack);
        console.error('Input data:', {
          title,
          description,
          courseId,
          sectionId,
          lessonId,
          questions,
          createdById,
          duration
        });
    
        throw new Error('Failed to add exam');
      }
    },
    
    
    addQuestion: async (_, { title, description, examId, answers }, { loaders }) => {
      try {
        const question = new Question({
          title,
          description,
          exam: examId,
          answers
        });
        await question.save();
    
        // Optional: Handle answers if needed
        if (answers) {
          // Assume answers are processed separately
        }
    
        return loaders.questionLoader.load(question.id);
      } catch (error) {
        console.error('Error adding question:', error);
        throw new Error('Failed to add question');
      }
    },
    addAnswer: async (_, { title, questionId, isCorrect }, { loaders }) => {
      try {
        const answer = new Answer({
          title,
          question: questionId,
          isCorrect
        });
        await answer.save();
    
        return loaders.answerLoader.load(answer.id);
      } catch (error) {
        console.error('Error adding answer:', error);
        throw new Error('Failed to add answer');
      }
    },
    addEnrollment: async (_, args, { loaders }) => {
      try {
        const enrollment = new Enrollment(args); // Create the enrollment using the entire args object
        await enrollment.save(); // Save the new enrollment to the database
    
        // Use DataLoader to load the saved enrollment by ID for consistency
        return loaders.enrollmentLoader.load(enrollment.id);
      } catch (error) {
        console.error('Error adding enrollment:', error);
        throw new Error('Failed to add enrollment');
      }
    },
    

    
    
    
    register: authController.register,
    login: authController.login,
    logout: authController.logout,
    refreshToken: authController.refreshToken,
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
