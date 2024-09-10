import { gql } from 'apollo-server-express'

const typeDefs = gql`
  type User {
    id: ID!
    fullName: String!
    email: String!
    role: String!
    enrolledCourses: [Course]
    createdExams: [Exam]
  }

  type Course {
    id: ID!
    title: String!
    description: String!
    instructor: User!
    lessons: [Lesson]
    enrolledStudents: [User]
    exams: [Exam]
  }

  type Lesson {
    title: String!
    content: String!
  }

  type Exam {
    id: ID!
    title: String!
    course: Course!
    questions: [Question]
    createdBy: User!
    duration: String!
  }

  type Question {
    questionText: String!
    options: [String]
    correctAnswer: String!
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
  
  type Message{
      id: ID!
      content: String!
      sender: ID!
      createdAt: String!
  }

  type AuthPayload {
      accessToken: String!
      user: User!
  }

  type refreshTokenPayload {
      accessToken: String!
  }

  type Query {
      user(id: ID!): User
      users(page: Int, limit: Int): UserConnection!
      course(id: ID!): Course
      courses(page: Int, limit: Int): CourseConnection!
      exam(id: ID!): Exam
      exams(page: Int, limit: Int): ExamConnection!
      messages(limit: Int): [Message]!
  }

  type Mutation {
    addUser(fullName: String!, email: String!, password: String!, role: String!): User
    addCourse(title: String!, description: String!, instructorId: ID!): Course
    addExam(title: String!, courseId: ID!, questions: [QuestionInput], createdById: ID!, duration: String!): Exam
    sendMessage(content: String, senderId: ID!): Message!
      register(fullName: String!, email: String!, password: String!, role: String!): AuthPayload!
      login(email: String!, password: String!): AuthPayload!
      refreshToken(refreshToken: String!):  refreshTokenPayload
      logout: Boolean
  }

  input QuestionInput {
    questionText: String!
    options: [String]
    correctAnswer: String!
  }
  type Subscription {
      newMessage: Message!
  }
`;

export default typeDefs;
