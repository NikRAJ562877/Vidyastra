// Mock data for the educational management system

export interface Course {
  id: string;
  name: string;
  class: string;
  batch: string;
  duration: string;
  fee: number;
  description: string;
  image?: string;
  tag?: string;
  startDate?: string;
  language?: string;
  achiever?: {
    name: string;
    rank: string;
    achievement: string;
    imageUrl?: string;
  };
  showOnLandingPage?: boolean;
}

export interface Student {
  id: string;
  uniqueId: string;
  registerNumber: string;
  rollNumber: string;
  name: string;
  email: string;
  phone: string;
  class: string;
  batch: string;
  category: 'slow_learner' | 'normal';
  paymentStatus: 'paid' | 'pending' | 'partial';
  enrollmentStatus: 'pending' | 'confirmed';
  password: string;
  isFirstLogin: boolean;
  role: 'student';
  paymentHistory?: PaymentRecord[];
  totalFee?: number;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  assignedClasses: string[];
  assignedBatches: string[];
  assignedSubjects: string[];
  password: string;
  role: 'teacher';
  isFirstLogin: boolean;
}

export interface Test {
  id: string;
  name: string;
  date: string;
  description: string;
  classes: string[]; // Which classes this test is for
}

export interface Mark {
  id: string;
  testId: string;
  studentId: string;
  subject: string;
  marks: number | null;
  totalMarks: number;
}

export interface Enrollment {
  id: string;
  uniqueId: string;
  name: string;
  phone: string;
  email: string;
  class: string;
  batch: string;
  registerNumber: string;
  mode: 'online' | 'offline';
  status: 'pending' | 'confirmed';
  date: string;
  paymentType?: 'full' | 'installment';
  amountPaid?: number;
  totalFee?: number;
  transactionId?: string;
  paymentStatus?: 'paid' | 'pending' | 'partial';
}

export interface PaymentRecord {
  id: string;
  date: string;
  amount: number;
  mode: string;
  type: 'full' | 'installment';
  transactionId?: string;
  receiptId: string;
}

export interface Attendance {
  studentId: string;
  date: string;
  status: 'present' | 'absent';
}

export interface Payment {
  id: string;
  studentId: string;
  studentName: string;
  amount: number;
  totalFee: number;
  installment: number;
  totalInstallments: number;
  status: 'paid' | 'pending' | 'not_paid';
  dueDate: string;
  paidDate?: string;
  month: string;
}

export interface Note {
  id: string;
  title: string;
  description: string;
  class: string;
  batch: string;
  subject: string;
  fileUrl: string;
  fileName: string;
  date: string;
  uploadedBy: string; // admin or teacher name
  isSlowLearnerOnly?: boolean;
}

export const courses: Course[] = [
  {
    id: '1',
    name: 'Mathematics Foundation',
    class: 'Class 10',
    batch: 'Batch A - Morning',
    duration: '6 Months',
    fee: 15000,
    description: 'Comprehensive mathematics course covering algebra, geometry, trigonometry and statistics for Class 10 students.',
  },
  {
    id: '2',
    name: 'Science Excellence',
    class: 'Class 10',
    batch: 'Batch B - Evening',
    duration: '6 Months',
    fee: 18000,
    description: 'In-depth science program covering Physics, Chemistry & Biology with lab practicals and weekly tests.',
  },
  {
    id: '3',
    name: 'English Mastery',
    class: 'Class 12',
    batch: 'Batch A - Morning',
    duration: '4 Months',
    fee: 12000,
    description: 'Advanced English course focusing on literature, grammar, and communication skills for competitive exams.',
  },
  {
    id: '4',
    name: 'Physics Advanced',
    class: 'Class 12',
    batch: 'Batch B - Evening',
    duration: '8 Months',
    fee: 22000,
    description: 'Advanced physics concepts including mechanics, thermodynamics, optics and modern physics with problem solving.',
  },
  {
    id: '5',
    name: 'Computer Science',
    class: 'Class 11',
    batch: 'Batch A - Morning',
    duration: '12 Months',
    fee: 25000,
    description: 'Full computer science curriculum covering programming, data structures, and web development fundamentals.',
  },
  {
    id: '6',
    name: 'Chemistry Crash Course',
    class: 'Class 11',
    batch: 'Batch C - Weekend',
    duration: '3 Months',
    fee: 10000,
    description: 'Intensive weekend chemistry program for quick revision and exam preparation with practice papers.',
  },
  {
    id: '7',
    name: 'JEE Nurture Online Course: Target 2028',
    class: 'JEE',
    batch: 'Batch A - Morning',
    duration: '1 Year',
    fee: 45000,
    description: 'Specialized JEE preparation focusing on Physics, Chemistry, and Mathematics concepts.',
    tag: 'Live Course',
    startDate: '15 Dec, 2025',
    language: 'Hinglish, English',
    achiever: {
      name: 'Chirag Singh',
      rank: 'AIR 516',
      achievement: 'IIT Delhi',
    },
    showOnLandingPage: true
  },
  {
    id: '8',
    name: 'NEET Bio Mastery: Target 2026',
    class: 'NEET',
    batch: 'Batch B - Evening',
    duration: '1 Year',
    fee: 42000,
    description: 'Comprehensive Biology and Chemistry focus for NEET aspirants with regular mock tests.',
    tag: 'Live Course',
    startDate: '21 Dec, 2025',
    language: 'English',
    achiever: {
      name: 'Priya Patel',
      rank: 'AIR 124',
      achievement: 'AIIMS Delhi',
    },
    showOnLandingPage: true
  },
  {
    id: '9',
    name: 'CET Practice Batch: Target 2026',
    class: 'CET',
    batch: 'Batch C - Weekend',
    duration: '6 Months',
    fee: 25000,
    description: 'Fast-paced revision and practice for CET exams with emphasis on previous year papers.',
    tag: 'Crash Course',
    startDate: '10 Jan, 2026',
    language: 'Hinglish, Kannada',
    achiever: {
      name: 'Rohan Kumar',
      rank: 'Rank 45',
      achievement: 'RVCE Bangalore',
    },
    showOnLandingPage: true
  },
  {
    id: '14',
    name: 'JEE Major Online Test Series: Target 2026',
    class: 'JEE',
    batch: 'Batch C - Weekend',
    duration: '1 Year',
    fee: 15000,
    description: 'Comprehensive test series for JEE Mains and Advanced.',
    tag: 'Online Test Series',
    startDate: '21 Dec, 2025',
    language: 'English',
    achiever: {
      name: 'Natu Dhruv Amol',
      rank: 'AIR 293',
      achievement: 'IIT Bombay',
    },
    showOnLandingPage: true
  },
  {
    id: '15',
    name: 'NEET Conqueror Test Series: Target 2026',
    class: 'NEET',
    batch: 'Batch C - Weekend',
    duration: '1 Year',
    fee: 12000,
    description: 'Mock tests and analysis for NEET aspirants.',
    tag: 'Online Test Series',
    startDate: '15 Dec, 2025',
    language: 'English',
    achiever: {
      name: 'Ananya Gupta',
      rank: 'AIR 412',
      achievement: 'MAMC Delhi',
    },
    showOnLandingPage: true
  },
  {
    id: '10',
    name: 'Primary Math Fun',
    class: 'Class 1-4',
    batch: 'Batch A - Morning',
    duration: '10 Months',
    fee: 8000,
    description: 'Building strong mathematical foundations for primary school students through interactive learning.',
  },
  {
    id: '11',
    name: 'Middle School Science',
    class: 'Class 5-6',
    batch: 'Batch B - Evening',
    duration: '10 Months',
    fee: 10000,
    description: 'Exploring scientific concepts for classes 5 and 6 with fun experiments and projects.',
  },
  {
    id: '12',
    name: 'Bridge Course 7-8',
    class: 'Class 7-8',
    batch: 'Batch A - Morning',
    duration: '10 Months',
    fee: 12000,
    description: 'Transition course for middle school students to prepare for high school academic rigor.',
  },
  {
    id: '13',
    name: 'High School Topper Batch',
    class: 'Class 9-10',
    batch: 'Batch B - Evening',
    duration: '10 Months',
    fee: 15000,
    description: 'Dedicated batch for students aiming for top ranks in board examinations.',
  },
];

export const students: Student[] = [
  { id: '1', uniqueId: 'STU-2025-001', registerNumber: 'REG001', rollNumber: '01', name: 'Aarav Sharma', email: 'aarav@test.com', phone: '9876543210', class: 'Class 10', batch: 'Batch A - Morning', category: 'normal', paymentStatus: 'paid', enrollmentStatus: 'confirmed', password: 'student123', isFirstLogin: true, role: 'student' },
  { id: '2', uniqueId: 'STU-2025-002', registerNumber: 'REG002', rollNumber: '02', name: 'Priya Patel', email: 'priya@test.com', phone: '9876543211', class: 'Class 10', batch: 'Batch A - Morning', category: 'normal', paymentStatus: 'paid', enrollmentStatus: 'confirmed', password: 'student123', isFirstLogin: false, role: 'student' },
  { id: '3', uniqueId: 'STU-2025-003', registerNumber: 'REG003', rollNumber: '03', name: 'Rohan Kumar', email: 'rohan@test.com', phone: '9876543212', class: 'Class 10', batch: 'Batch B - Evening', category: 'slow_learner', paymentStatus: 'partial', enrollmentStatus: 'confirmed', password: 'student123', isFirstLogin: true, role: 'student' },
  { id: '4', uniqueId: 'STU-2025-004', registerNumber: 'REG004', rollNumber: '04', name: 'Ananya Gupta', email: 'ananya@test.com', phone: '9876543213', class: 'Class 12', batch: 'Batch A - Morning', category: 'normal', paymentStatus: 'pending', enrollmentStatus: 'confirmed', password: 'student123', isFirstLogin: true, role: 'student' },
  { id: '5', uniqueId: 'STU-2025-005', registerNumber: 'REG005', rollNumber: '05', name: 'Vikram Singh', email: 'vikram@test.com', phone: '9876543214', class: 'Class 12', batch: 'Batch B - Evening', category: 'normal', paymentStatus: 'paid', enrollmentStatus: 'confirmed', password: 'student123', isFirstLogin: false, role: 'student' },
  { id: '6', uniqueId: 'STU-2025-006', registerNumber: 'REG006', rollNumber: '06', name: 'Kavya Nair', email: 'kavya@test.com', phone: '9876543215', class: 'Class 11', batch: 'Batch A - Morning', category: 'normal', paymentStatus: 'paid', enrollmentStatus: 'confirmed', password: 'student123', isFirstLogin: true, role: 'student' },
];

export const teachers: Teacher[] = [
  { id: '1', name: 'Dr. Rajesh Iyer', email: 'rajesh@academy.com', assignedClasses: ['Class 10'], assignedBatches: ['Batch A - Morning'], assignedSubjects: ['Mathematics'], password: 'teacher123', role: 'teacher', isFirstLogin: false },
  { id: '2', name: 'Mrs. Sunita Verma', email: 'sunita@academy.com', assignedClasses: ['Class 10', 'Class 12'], assignedBatches: ['Batch A - Morning', 'Batch B - Evening'], assignedSubjects: ['English', 'Hindi'], password: 'teacher123', role: 'teacher', isFirstLogin: false },
  { id: '3', name: 'Mr. Arjun Desai', email: 'arjun@academy.com', assignedClasses: ['Class 12'], assignedBatches: ['Batch B - Evening'], assignedSubjects: ['Physics', 'Chemistry'], password: 'teacher123', role: 'teacher', isFirstLogin: true },
];

export const tests: Test[] = [
  { id: '1', name: 'June Monthly Test', date: '2025-06-15', description: 'Internal assessment for June month.', classes: ['Class 10', 'Class 12'] },
  { id: '2', name: 'First Term Examination', date: '2025-09-20', description: 'Comprehensive examination for the first term.', classes: ['Class 10', 'Class 11', 'Class 12'] },
];

export const marks: Mark[] = [
  { id: '1', testId: '1', studentId: '1', subject: 'Mathematics', marks: 92, totalMarks: 100 },
  { id: '2', testId: '1', studentId: '1', subject: 'Science', marks: 88, totalMarks: 100 },
  { id: '3', testId: '1', studentId: '1', subject: 'English', marks: 76, totalMarks: 100 },
  { id: '4', testId: '1', studentId: '2', subject: 'Mathematics', marks: 95, totalMarks: 100 },
  { id: '5', testId: '1', studentId: '2', subject: 'Science', marks: 91, totalMarks: 100 },
  { id: '6', testId: '1', studentId: '2', subject: 'English', marks: 89, totalMarks: 100 },
];

export const enrollments: Enrollment[] = [
  { id: '1', uniqueId: 'ENR-2025-101', name: 'Meera Joshi', phone: '9988776655', email: 'meera@test.com', class: 'Class 10', batch: 'Batch A - Morning', registerNumber: '', mode: 'online', status: 'pending', date: '2025-02-10' },
  { id: '2', uniqueId: 'ENR-2025-102', name: 'Arjun Reddy', phone: '9988776656', email: 'arjun.r@test.com', class: 'Class 12', batch: 'Batch B - Evening', registerNumber: 'REG007', mode: 'offline', status: 'pending', date: '2025-02-11' },
  { id: '3', uniqueId: 'ENR-2025-103', name: 'Divya Menon', phone: '9988776657', email: 'divya@test.com', class: 'Class 11', batch: 'Batch A - Morning', registerNumber: '', mode: 'online', status: 'pending', date: '2025-02-12' },
];

export const attendance: Attendance[] = [
  { studentId: '1', date: '2025-02-10', status: 'present' },
  { studentId: '1', date: '2025-02-11', status: 'present' },
  { studentId: '1', date: '2025-02-12', status: 'absent' },
  { studentId: '1', date: '2025-02-13', status: 'present' },
  { studentId: '2', date: '2025-02-10', status: 'present' },
  { studentId: '2', date: '2025-02-11', status: 'present' },
  { studentId: '2', date: '2025-02-12', status: 'present' },
  { studentId: '2', date: '2025-02-13', status: 'present' },
  { studentId: '3', date: '2025-02-10', status: 'absent' },
  { studentId: '3', date: '2025-02-11', status: 'present' },
  { studentId: '3', date: '2025-02-12', status: 'absent' },
  { studentId: '3', date: '2025-02-13', status: 'present' },
];

export const payments: Payment[] = [
  { id: '1', studentId: '1', studentName: 'Aarav Sharma', amount: 15000, totalFee: 15000, installment: 1, totalInstallments: 1, status: 'paid', dueDate: '2025-01-15', paidDate: '2025-01-14', month: 'January' },
  { id: '2', studentId: '2', studentName: 'Priya Patel', amount: 7500, totalFee: 15000, installment: 1, totalInstallments: 2, status: 'paid', dueDate: '2025-01-15', paidDate: '2025-01-15', month: 'January' },
  { id: '3', studentId: '2', studentName: 'Priya Patel', amount: 7500, totalFee: 15000, installment: 2, totalInstallments: 2, status: 'pending', dueDate: '2025-03-15', month: 'March' },
  { id: '4', studentId: '3', studentName: 'Rohan Kumar', amount: 9000, totalFee: 18000, installment: 1, totalInstallments: 2, status: 'paid', dueDate: '2025-01-20', paidDate: '2025-01-18', month: 'January' },
  { id: '5', studentId: '3', studentName: 'Rohan Kumar', amount: 9000, totalFee: 18000, installment: 2, totalInstallments: 2, status: 'not_paid', dueDate: '2025-03-20', month: 'March' },
  { id: '6', studentId: '4', studentName: 'Ananya Gupta', amount: 12000, totalFee: 12000, installment: 1, totalInstallments: 1, status: 'pending', dueDate: '2025-02-01', month: 'February' },
];

export const notes: Note[] = [
  {
    id: '1',
    title: 'Calculus Fundamentals',
    description: 'Basic concepts of limits and derivatives for Class 12.',
    class: 'Class 12',
    batch: 'Batch A - Morning',
    subject: 'Mathematics',
    fileUrl: '#',
    fileName: 'calculus_basics.pdf',
    date: '2025-02-10',
    uploadedBy: 'Dr. Rajesh Iyer'
  }
];

export const subjects = ['Mathematics', 'Science', 'English', 'Physics', 'Chemistry', 'Hindi', 'Computer Science', 'Biology'];

export const classes = ['Class 10', 'Class 11', 'Class 12', 'JEE', 'NEET', 'CET', 'Class 1-4', 'Class 5-6', 'Class 7-8', 'Class 9-10'];

export const batches = ['Batch A - Morning', 'Batch B - Evening', 'Batch C - Weekend'];

// Announcements (default seed)
export interface Announcement {
  id: number | string;
  title: string;
  description: string;
  date: string;
}

export const defaultAnnouncements: Announcement[] = [
  { id: 1, title: 'Admissions Open for 2025-26', description: 'Enroll now for the upcoming academic year. Early bird discounts available!', date: 'Feb 10, 2025' },
  { id: 2, title: 'Annual Day Celebration', description: 'Join us for our annual day celebrations on March 15, 2025.', date: 'Feb 8, 2025' },
  { id: 3, title: 'Board Exam Preparation Crash Course', description: 'Special crash course starting Feb 20 for board exam students.', date: 'Feb 5, 2025' },
];

// Auth mock
export type UserRole = 'admin' | 'teacher' | 'student';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isFirstLogin?: boolean;
}

export const adminUser: AuthUser = {
  id: 'admin-1',
  name: 'System Admin',
  email: 'admin@academy.com',
  role: 'admin',
};

export function authenticateUser(email: string, password: string): { user: AuthUser; redirect: string } | null {
  // Admin
  if (email === 'admin@academy.com' && password === 'admin123') {
    return { user: adminUser, redirect: '/admin' };
  }

  // Get live data from localStorage if available
  const storedTeachers = localStorage.getItem('vidyastara_teachers_v1');
  const liveTeachers: Teacher[] = storedTeachers ? JSON.parse(storedTeachers) : teachers;

  const storedStudents = localStorage.getItem('vidyastara_students_v1');
  const liveStudents: Student[] = storedStudents ? JSON.parse(storedStudents) : students;

  // Teachers
  const teacher = liveTeachers.find(t => t.email === email && t.password === password);
  if (teacher) {
    return {
      user: { id: teacher.id, name: teacher.name, email: teacher.email, role: 'teacher', isFirstLogin: teacher.isFirstLogin },
      redirect: '/teacher',
    };
  }

  // Students (login by register number or email)
  const student = liveStudents.find(s => (s.email === email || s.registerNumber === email) && s.password === password);
  if (student) {
    return {
      user: { id: student.id, name: student.name, email: student.email, role: 'student', isFirstLogin: student.isFirstLogin },
      redirect: '/student',
    };
  }

  return null;
}
