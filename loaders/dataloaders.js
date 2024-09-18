
import DataLoader from 'dataloader';
import User from '../models/Users.js';
import Course from '../models/Courses.js';
import Exam from '../models/Exams.js';
import Lesson from '../models/Lesson.js'
import Question from '../models/Qst.js'
import Category from '../models/Category.js';

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
  questionLoader: new DataLoader(batchFunction(Question)),
  lessonLoader: new DataLoader(batchFunction(Lesson)),
  CategoryLoader: new DataLoader(batchFunction(Category))
});

export default createLoaders;
