import User from "../models/Users.js";
import Course from "../models/Courses.js";
import Exam from "../models/Exams.js";
import Lesson from "../models/Lesson.js";
import Question from "../models/Qst.js";
import Category from "../models/Category.js";

import chatController from "../controllers/chatController.js";
import { PubSub } from "graphql-subscriptions";
import authController from "../controllers/authController.js";

const pubsub = new PubSub();
const NEW_MESSAGE = "NEW_MESSAGE";

const resolvers = {
  //here normally the queries (parent if exists, id, loader context)
  Query: {
    user: (_, { id }, { loaders }) => loaders.userLoader.load(id),
    users: async (_, { page = 1, limit = 10 }) => {
      const skip = (page - 1) * limit;
      const [users, total] = await Promise.all([
        User.find().lean().skip(skip).limit(limit),
        User.countDocuments(),
      ]);
      return {
        users,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      };
    },
    courseByCategory: async (_, { category }) => {
      try {
        console.log('Fetching courses for category:', category); // Log category parameter
        const courses = await Course.find({ category });
        console.log('Courses found:', courses); // Log courses found
        return courses;
      } catch (error) {
        console.error("Error fetching courses:", error.message);
        throw new Error("Failed to fetch courses");
      }
    },
    
    course: (_, { id }, { loaders }) => loaders.courseLoader.load(id),
    courses: async (_, { page = 1, limit = 10 }) => {
      const skip = (page - 1) * limit;
      const [courses, total] = await Promise.all([
        Course.find().lean().skip(skip).limit(limit),
        Course.countDocuments(),
      ]);
      return {
        courses,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      };
    },
    exam: (_, { id }, { loaders }) => loaders.examLoader.load(id),
    exams: async (_, { page = 1, limit = 10 }) => {
      const skip = (page - 1) * limit;
      const [exams, total] = await Promise.all([
        Exam.find().lean().skip(skip).limit(limit),
        Exam.countDocuments(),
      ]);
      return {
        exams,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      };
    },
    examsByCategory: async (_, { categoryId }, { models }) => {
      try {
        // Check if categoryId is valid
        if (!categoryId) {
          throw new Error('Category ID is required');
        }

        // Fetch exams from the database where category matches the provided categoryId
        const exams = await Exam.find({ category: categoryId });

        // Log the result for debugging purposes
        console.log('Fetched exams:', exams);

        // Return the list of exams
        return exams;
      } catch (error) {
        console.error('Error fetching exams by category:', error.message);
        throw new Error('Failed to fetch exams by category');
      }},
    messages: async (_, { limit }) => {
      return await chatController.getMessages(limit);
    },
  },

  Mutation: {
    //here the mutation the same except we mutate so more logic
    addUser: async (_, args, { loaders }) => {
      try {
        const user = new User(args);
        await user.save();
        return loaders.userLoader.load(user.id); // Use DataLoader for consistency
      } catch (error) {
        console.error("Error adding user:", error);
        throw new Error("Failed to add user");
      }
    },
    updateUser: async (_, { id, fullName, email, profilePicture, enabled }) => {
      try {
        const updatedUser = await User.findByIdAndUpdate(
          id,
          { fullName, email, profilePicture, enabled },
          { new: true } // To return the updated document
        );
        return updatedUser;
      } catch (error) {
        throw new Error(`Failed to update user: ${error.message}`);
      }
    },
    addCategory: async (_, { input }) => {
      try {
        const { name, description } = input;

        // Check if category already exists
        let existingCategory = await Category.findOne({ name });

        // If category exists, return it
        if (existingCategory) {
          return existingCategory; // Return existing category
        }

        // Create new category
        const newCategory = new Category({
          name,
          description,
          // Other fields as per your schema definition
        });

        // Save category to database
        const result = await newCategory.save();
        return result;
      } catch (error) {
        throw new Error(`Failed to add category: ${error.message}`);
      }
    },
    addCourse: async (
      _,
      { title, description, instructorId, category },
      { loaders }
    ) => {
      try {
        const course = new Course({
          title,
          description,
          instructor: instructorId,
          category,
        });
        await course.save();
        return loaders.courseLoader.load(course.id);
      } catch (error) {
        console.error("Error adding course:", error);
        throw new Error("Failed to add course");
      }
    },

    addLesson: async (
      _,
      { title, content, description, category, videoUrl, pdfUrl },
      { loaders }
    ) => {
      try {
        // Ensure category exists and is valid
        const existingCategory = await Category.findById(category);
        if (!existingCategory) {
          throw new Error(`Category with ID ${category} not found`);
        }

        // Create new lesson instance
        const lesson = new Lesson({
          title,
          content,
          description,
          category: existingCategory._id,
          videoUrl,
          pdfUrl,
        });

        // Save lesson to database
        const savedLesson = await lesson.save();

        // If DataLoader is used, load the lesson using DataLoader
        if (loaders && loaders.lessonLoader) {
          return loaders.lessonLoader.load(savedLesson._id.toString());
        }

        // Return the saved lesson directly if DataLoader is not used
        return savedLesson;
      } catch (error) {
        console.error("Error adding lesson:", error.message, error.stack);
        throw new Error("Failed to add lesson");
      }
    },

    addExam: async (
      _,
      {
        title,
        description,
        courseId,
        lessonId,
        category,
        questions,
        createdById,
        duration,
      },
      { loaders }
    ) => {
      try {
        // Create a new Exam instance with the category field
        const exam = new Exam({
          title,
          description,
          course: courseId,
          lesson: lessonId,
          category,
          questions,
          createdBy: createdById,
          duration,
        });

        // Save the exam to the database
        const savedExam = await exam.save();

        // Return the saved exam using the loader
        return loaders.examLoader.load(savedExam._id.toString());
      } catch (error) {
        // Log detailed error information
        console.error("Error adding exam:", error.message);
        console.error("Stack trace:", error.stack);
        console.error("Input data:", {
          title,
          description,
          courseId,
          lessonId,
          category,
          questions,
          createdById,
          duration,
        });

        throw new Error("Failed to add exam");
      }
    },

    addQuestion: async (
      _,
      { title, description, examId, answers },
      { loaders }
    ) => {
      try {
        const question = new Question({
          title,
          description,
          exam: examId,
          answers,
        });
        await question.save();

        // Optional: Handle answers if needed
        if (answers) {
          // Assume answers are processed separately
        }

        return loaders.questionLoader.load(question.id);
      } catch (error) {
        console.error("Error adding question:", error);
        throw new Error("Failed to add question");
      }
    },
    addAnswer: async (_, { title, questionId, isCorrect }, { loaders }) => {
      try {
        const answer = new Answer({
          title,
          question: questionId,
          isCorrect,
        });
        await answer.save();

        return loaders.answerLoader.load(answer.id);
      } catch (error) {
        console.error("Error adding answer:", error);
        throw new Error("Failed to add answer");
      }
    },

    register: authController.register,
    login: authController.login,
    logout: authController.logout,
    refreshToken: authController.refreshToken,
    sendMessage: async (_, { content, senderId }) => {
      const message = await chatController.createMessage(content, senderId);
      pubsub.publish(NEW_MESSAGE, { newMessage: message });
      return message;
    },
  },
  //here is another part of graphql capabilitis the subscription to message.
  Subscription: {
    newMessage: {
      subscribe: () => pubsub.asyncIterator(NEW_MESSAGE),
    },
  },
  Lesson: {
    category: async (lesson) => {
      // Implement your resolver for the 'category' field if needed
      // Example: Fetch category details from the database based on lesson.category
      try {
        const category = await Category.findById(lesson.category);
        return category; // Return the category object
      } catch (error) {
        console.error("Error fetching category:", error.message);
        throw new Error("Failed to fetch category for lesson");
      }
    },
    id: (parent) => parent._id || parent.id,

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
    id: (parent) => parent._id || parent.id,
  },
  Course: {
    instructor: (parent, _, { loaders }) =>
      loaders.userLoader.load(parent.instructor),
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
    category: async (parent, _, { loaders }) => {
      try {
        if (!parent.category) {
          throw new Error("No category ID found on course");
        }
        
        const category = await loaders.categoryLoader.load(parent.category.toString());
        
        if (!category) {
          throw new Error("Category not found");
        }
        
        return category;
      } catch (error) {
        console.error("Error fetching category:", error.message);
        throw new Error("Failed to fetch category");
      }
    },
    
    id: (parent) => parent._id || parent.id,

  },
  Exam: {
    course: (parent, _, { loaders }) =>
      loaders.courseLoader.load(parent.course),
    createdBy: (parent, _, { loaders }) =>
      loaders.userLoader.load(parent.createdBy),
    category: (parent, _, { loaders }) =>
      loaders.CategoryLoader.load(parent.category),
    lesson: (parent, _, { loaders }) =>
      loaders.lessonLoader.load(parent.lesson),
    id: (parent) => parent._id || parent.id,
  },
};

export default resolvers;