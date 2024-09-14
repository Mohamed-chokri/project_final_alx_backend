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
    enrollments: [Enrollment]
    enrolledCourses: [Course]
    createdExams: [Exam]
  }

  type Course {
    id: ID!
    title: String!
    description: String!
    instructor: User!
    category: String!
    sections: [Section]!
    lessons: [Lesson]
    enrolledStudents: [User]
    exams: [Exam]
  }
  type Section {
    id: ID!
    title: String!
    Courseid: Int!
    lessons: [Lesson]!
  }

  type Lesson {
    id: ID!
    title: String!
    content: String!
    description: String!
    Sectionid: Int!
    videoUrl: String
    pdfurl: String
  }

  type Enrollment {
    id: ID!
    Courseid: Int!
    Sectionid: Int!
    Lessonid: Int!
    studentId: Int!
    enrollmentDate: String!
    studentName: String!
    Userid: Int!
    progress: Int!
    status: String!
  }

  type Question {
    id: ID!
    title: String!
    description: String!
    Examid: Int!
    status: String!
    answers: [Answer]!
  }
  type Exam {
    id: ID!
    title: String!
    description: String!
    Courseid: Int!
    Sectionid: Int!
    Lessonid: Int!
    questions: [Question]!
    course: Course!
    createdBy: User
  }
  type Answer {
    id: ID!
    title: String!
    Questionid: Int! # Link to Question
    isCorrect: Boolean!
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
    
    # Add a new course
    addCourse(
      title: String!
      description: String!
      instructorId: ID!
      category: String!
      sections: [SectionInput]
    ): Course
    
    # Add a new section to a course
    addSection(
      title: String!
      courseId: ID!
      lessons: [LessonInput]
    ): Section
    
    # Add a new lesson to a section
    addLesson(
      title: String!
      description: String!
      sectionId: ID!
      videoUrl: String
      pdfUrl: String
    ): Lesson

    # Add a new exam
    addExam(
      title: String!
      description: String
      courseId: ID!
      sectionId: ID
      lessonId: ID
      questions: [QuestionInput]
      createdById: ID!
      duration: String!
    ): Exam

    # Add a new question to an exam
    addQuestion(
      title: String!
      description: String!
      examId: ID!
      answers: [AnswerInput]
    ): Question
    
    # Add a new answer to a question
    addAnswer(
      title: String!
      questionId: ID!
      isCorrect: Boolean!
    ): Answer
    
    # Add a new enrollment
    addEnrollment(
      courseId: ID!
      sectionId: ID
      lessonId: ID
      studentId: ID!
      enrollmentDate: String!
      studentName: String!
      progress: Float
      status: String
    ): Enrollment

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
    questionText: String!
    options: [String]
    correctAnswer: String!
  }
    input SectionInput {
  title: String!
  courseId: ID!
  lessons: [LessonInput]
}

input LessonInput {
  title: String!
  description: String!
  sectionId: ID!
  videoUrl: String
  pdfUrl: String
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
