const DataLoader = require('dataloader');
const User = require('../models/User');
const Course = require('../models/Courses');
const Exam = require('../models/Exams');

const batchUsers = async (userIds) => {
  const users = await User.find({ _id: { $in: userIds } });
  const userMap = users.reduce((acc, user) => {
    acc[user.id.toString()] = user;
    return acc;
  }, {});
  return userIds.map(id => userMap[id.toString()] || null);
};

const batchCourses = async (courseIds) => {
  const courses = await Course.find({ _id: { $in: courseIds } });
  const courseMap = courses.reduce((acc, course) => {
    acc[course.id.toString()] = course;
    return acc;
  }, {});
  return courseIds.map(id => courseMap[id.toString()] || null);
};

const batchExams = async (examIds) => {
  const exams = await Exam.find({ _id: { $in: examIds } });
  const examMap = exams.reduce((acc, exam) => {
    acc[exam.id.toString()] = exam;
    return acc;
  }, {});
  return examIds.map(id => examMap[id.toString()] || null);
};

const createLoaders = () => ({
  userLoader: new DataLoader(keys => batchUsers(keys)),  // Pass the function correctly
  courseLoader: new DataLoader(keys => batchCourses(keys)),  // Pass the function correctly
  examLoader: new DataLoader(keys => batchExams(keys)),  // Pass the function correctly
});

module.exports = { createLoaders };
