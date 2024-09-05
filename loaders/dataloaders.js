const DataLoader = require('dataloader');
const User = require('../models/User');
const Course = require('../models/Courses');
const Exam = require('../models/Exams');

const batchFunction = (Model) => async (ids) => {
  const items = await Model.find({ _id: { $in: ids } }).lean();
  const itemMap = items.reduce((acc, item) => {
    acc[item._id.toString()] = item;
    return acc;
  }, {});
  return ids.map(id => itemMap[id.toString()] || null);
};

const createLoaders = () => ({
  userLoader: new DataLoader(batchFunction(User)),
  courseLoader: new DataLoader(batchFunction(Course)),
  examLoader: new DataLoader(batchFunction(Exam)),
});

module.exports = { createLoaders };
