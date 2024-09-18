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
    pdfurl: String
  }
  type Category {
    id: ID!
    name: String
    description: String
  }

  type Question {
    questionText: String!
    options: [String!]!
    correctAnswer: String!
  }
  type Exam {
    id: ID
    title: String
    description: String
    course: Course
    lesson: Lesson
    questions: [Question]
    category: Category
    createdBy: User
    duration: String
  }
  type Answer {
    id: ID!
    title: String!
    Questionid: Int! # Link to Question
    isCorrect: Boolean!
  }
  type Category {
    _id: ID!
    name: String!
    description: String
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

    # Add a new course
    addCourse(
      title: String!
      description: String!
      instructorId: ID!
      category: ID!
    ): Course

    addCategory(input: CategoryInput!): Category!

    # Add a new lesson to a section
    addLesson(
      title: String!
      content: String
      description: String!
      category: ID!
      videoUrl: String
      pdfUrl: String
    ): Lesson

    # Add a new exam
    addExam(
      title: String!
      description: String!
      courseId: ID!
      lessonId: ID!
      category: ID!
      questions: [QuestionInput]
      createdById: ID!
      duration: String
    ): Exam

    # Add a new question to an exam
    addQuestion(
      title: String!
      description: String!
      examId: ID!
      answers: [AnswerInput]
    ): Question

    # Add a new answer to a question
    addAnswer(title: String!, questionId: ID!, isCorrect: Boolean!): Answer

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
    questionText: String
    options: [String]
    correctAnswer: String
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
    # Other input fields as per your category schema
  }
  input AnswerInput {
    title: String!
    isCorrect: Boolean!
  }

  type Subscription {
    newMessage: Message!
  }
`;

export default typeDefs;