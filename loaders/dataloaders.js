import DataLoader from 'dataloader';
import User from '../models/Users.js';
import Course from '../models/Courses.js';
import Exam from '../models/Exams.js';
import Lesson from '../models/Lesson.js'
import Section from '../models/Section.js'
import Question from '../models/Qst.js'
import Answer from '../models/Answer.js'
import Enrollment from '../models/Enrollment.js'

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
  answerLoader: new DataLoader(batchFunction(Answer)),
  enrollmentLoader: new DataLoader(batchFunction(Enrollment)),
  lessonLoader: new DataLoader(batchFunction(Lesson)),
  sectionLoader: new DataLoader(batchFunction(Section)),
});

export default createLoaders;
