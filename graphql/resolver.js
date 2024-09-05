const User = require('../models/User');
const Course = require('../models/Courses');
const Exam = require('../models/Exams');

const resolvers = {
  Query: {
    user: (_, { id }, { loaders }) => loaders.userLoader.load(id),  // Fetch user using DataLoader
    users: () => User.find(),  // Fetch all users
    course: (_, { id }, { loaders }) => loaders.courseLoader.load(id),  // Fetch course using DataLoader
    courses: async (_, __, { loaders }) => {
      const courses = await Course.find();
      const courseIds = courses.map(course => course.id); // Extracting IDs for DataLoader
      return loaders.courseLoader.loadMany(courseIds); // Load by IDs
    },
    exam: (_, { id }, { loaders }) => loaders.examLoader.load(id),  // Fetch exam using DataLoader
    exams: () => Exam.find(),  // Fetch all exams
  },

  Mutation: {
    addUser: async (_, args) => {
      const user = new User(args);
      return await user.save();  // Save new user
    },
    addCourse: async (_, { title, description, instructorId }, { loaders }) => {
      const course = new Course({ title, description, instructor: instructorId });
      await course.save();  // Save new course
      return loaders.courseLoader.load(course.id);  // Load course via DataLoader
    },
    addExam: async (_, { title, courseId, questions, createdById, duration }, { loaders }) => {
      const exam = new Exam({ title, course: courseId, questions, createdBy: createdById, duration });
      await exam.save();  // Save new exam
      return loaders.examLoader.load(exam.id);  // Load exam via DataLoader
    },
  },

  User: {
    enrolledCourses: async (parent, _, { loaders }) => {
      if (parent.enrolledCourses && parent.enrolledCourses.length > 0) {
        return loaders.courseLoader.loadMany(parent.enrolledCourses);  // Load multiple courses via DataLoader
      }
      return [];
    },
    createdExams: async (parent, _, { loaders }) => {
      if (parent.createdExams && parent.createdExams.length > 0) {
        return loaders.examLoader.loadMany(parent.createdExams);  // Load multiple exams via DataLoader
      }
      return [];
    },
  },

  Course: {
    instructor: (parent, _, { loaders }) => loaders.userLoader.load(parent.instructor),  // Load instructor via DataLoader
    enrolledStudents: async (parent, _, { loaders }) => {
      if (parent.enrolledStudents && parent.enrolledStudents.length > 0) {
        return loaders.userLoader.loadMany(parent.enrolledStudents);  // Load multiple users via DataLoader
      }
      return [];
    },
    exams: async (parent, _, { loaders }) => {
      if (parent.exams && parent.exams.length > 0) {
        return loaders.examLoader.loadMany(parent.exams);  // Load multiple exams via DataLoader
      }
      return [];
    },
  },

  Exam: {
    course: (parent, _, { loaders }) => loaders.courseLoader.load(parent.course),  // Load course via DataLoader
    createdBy: (parent, _, { loaders }) => loaders.userLoader.load(parent.createdBy),  // Load user via DataLoader
  },
};

module.exports = { resolvers };
