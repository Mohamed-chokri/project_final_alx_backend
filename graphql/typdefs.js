import { gql } from "apollo-server-express";

const typeDefs = gql`
  type User {
    id: ID!
    fullName: String!
    email: String!
    role: String!
    profilePicture: String
    dateJoined: String!
    enabled: Boolean!
    courses: [Course]
    enrolledCourses: [Course]
    createdExams: [Exam]
  }

  type Course {
    id: ID!
    title: String!
    description: String!
    instructor: User!
    category: Category
    lessons: [Lesson]
    enrolledStudents: [User]
    exams: [Exam]
  }

  type Lesson {
    id: ID!
    title: String!
    content: String
    category: Category
    description: String!
    videoUrl: String
    pdfUrl: String
  }

  type Category {
    id: ID!
    name: String
    description: String
  }
  type Answer {
    id: ID
    title: String
    isCorrect: Boolean
    Questionid: ID
  }
  type Question {
    id: ID
    title: String!
    description: String
    categoryId: ID!
    courseId: ID!
    sectionId: Int
    status: String
    answers: [Answer] # Nested array of answers
  }

  type Exam {
    id: ID!
    title: String!
    description: String!
    courseId: ID! # Reference to the Course
    lessonId: ID! # Reference to the Lesson
    sectionId: Int! # Updated to match the schema type
    questions: [Question] # Nested array of questions
  }

  type UserConnection {
    users: [User!]!
    totalPages: Int!
    currentPage: Int!
  }

  type CourseConnection {
    courses: [Course!]!
    totalPages: Int!
    currentPage: Int!
  }

  type ExamConnection {
    exams: [Exam!]!
    totalPages: Int!
    currentPage: Int!
  }

  type Message {
    id: ID!
    content: String!
    sender: ID!
    createdAt: String!
  }

  type AuthPayload {
    accessToken: String!
    refreshToken: String!
    user: User!
  }

  type refreshTokenPayload {
    accessToken: String!
    refreshToken: String!
  }

  type Query {
    user(id: ID!): User
    users(page: Int, limit: Int): UserConnection!
    course(id: ID!): Course
    courseByCategory(category: String!): [Course]
    courses(page: Int, limit: Int): CourseConnection!
    exam(id: ID!): Exam
    examsByCategory(categoryId: ID!): [Exam!]!
    exams(page: Int, limit: Int): ExamConnection!
    messages(limit: Int): [Message]!
  }

  type Mutation {
    addUser(
      fullName: String!
      email: String!
      password: String!
      role: String!
      profilePicture: String
      dateJoined: String
      enabled: Boolean
    ): User

    updateUser(
      id: ID!
      fullName: String
      email: String
      profilePicture: String
      enabled: Boolean
    ): User

    addCourse(
      title: String!
      description: String!
      instructorId: ID!
      category: ID!
    ): Course

    addCategory(input: CategoryInput!): Category!

    addLesson(
      title: String!
      content: String
      description: String!
      category: ID!
      videoUrl: String
      pdfUrl: String
    ): Lesson

    addExam(
      title: String!
      description: String!
      courseId: ID!
      lessonId: ID!
      sectionId: Int!
      questions: [QuestionInput!]!
    ): Exam

    addQuestion(
      title: String!
      description: String!
      examId: ID!
      answers: [AnswerInput]
    ): Question

    addAnswer(title: String!, Questionid: ID!, isCorrect: Boolean!): Answer

    sendMessage(content: String, senderId: ID!): Message!
    register(
      fullName: String!
      email: String!
      password: String!
      role: String!
    ): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    refreshToken(refreshToken: String!): refreshTokenPayload
    logout: Boolean
  }

  input QuestionInput {
    title: String
    description: String
    categoryId: ID # Reference to the Category
    courseId: ID # Reference to the Course
    sectionId: Int
    status: String
    answers: [AnswerInput]
  }
  input AnswerInput {
    title: String
    isCorrect: Boolean
  }

  input LessonInput {
    title: String!
    description: String!
    videoUrl: String
    pdfUrl: String
  }

  input CategoryInput {
    name: String!
    description: String
  }

  input AnswerInput {
    title: String!
    isCorrect: Boolean!
    Questionid: ID
  }

  type Subscription {
    newMessage: Message!
  }
`;

export default typeDefs;
