const User = require('../models/User'); // Import Mongoose models
const Course = require('../models/Courses');
const Exam = require('../models/Exams');

const resolvers = {
  Query: {
    user: (parent, args) => User.findById(args.id),
    users: () => User.find(),
    course: (parent, args) => Course.findById(args.id),
    courses: () => Course.find(),
    exam: (parent, args) => Exam.findById(args.id),
    exams: () => Exam.find(),
  },
  Mutation: {
    addUser: async (parent, args) => {
      const user = new User({
        fullName: args.fullName,
        email: args.email,
        password: args.password,
        role: args.role,
      });
      return await user.save();
    },
    addCourse: async (parent, args) => {
      const course = new Course({
        title: args.title,
        description: args.description,
        instructor: args.instructorId,
      });
      return await course.save();
    },
    addExam: async (parent, args) => {
      const exam = new Exam({
        title: args.title,
        course: args.courseId,
        questions: args.questions,
        createdBy: args.createdById,
        duration: args.duration,
      });
      return await exam.save();
    },
  },
  User: {
    enrolledCourses: (parent) => Course.find({ _id: { $in: parent.enrolledCourses } }),
    createdExams: (parent) => Exam.find({ _id: { $in: parent.createdExams } }),
  },
  Course: {
    instructor: (parent) => User.findById(parent.instructor),
    enrolledStudents: (parent) => User.find({ _id: { $in: parent.enrolledStudents } }),
    exams: (parent) => Exam.find({ _id: { $in: parent.exams } }),
  },
  Exam: {
    course: (parent) => Course.findById(parent.course),
    createdBy: (parent) => User.findById(parent.createdBy),
  },
};

module.exports = { resolvers };
