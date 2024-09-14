interface Course {
  id: string;
  title: string;
  description: string;
  Userid: number;
  sections: Section[];
}
interface Section {
  id: string;
  title: string;
  Courseid: number;
  lessons: Lesson[];
}
interface Lesson {
  id: string;
  title: string;
  description: string;
  Sectionid: number;
  videoUrl: string;
  pdfurl: string;
}
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  profilePicture: string;
  dateJoined: Date;
  enabled: boolean;
  courses: Course[];
  enrollments: Enrollment[];
}
interface Enrollment {
  id: string;
  Courseid: number;
  Sectionid: number;
  Lessonid: number;
  studentId: number;
  enrollmentDate: Date;
  studentName: string;
  Userid: number;
  progress: number;
  status: string;
}

interface Exam {
  id: string;
  title: string;
  description: string;
  Courseid: number;
  Lessonid: number;
  Sectionid: number;


  questions: Question[];
}
interface Question {
  id: string;
  title: string;
  description: string;
  Examid: number;
  status: string;
  answers: Answer[];
}
interface Answer {
  id: string;
  title: string;
  Questionid: number;
  isCorrect: boolean;
}
