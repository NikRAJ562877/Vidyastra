import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Results from "./pages/Results";
import Enroll from "./pages/Enroll";

// Core admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCourses from "./pages/admin/AdminCourses";
import AdminEnrollments from "./pages/admin/AdminEnrollments";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminTeachers from "./pages/admin/AdminTeachers";
import AdminAttendance from "./pages/admin/AdminAttendance";
import Announcements from "./pages/admin/Announcement";
import AdminAchievers from "./pages/admin/AdminAchievers";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminMarks from "./pages/admin/AdminMarks";
import AdminRankings from "./pages/admin/AdminRankings";
import AdminNotes from "./pages/admin/AdminNotes";

import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import TeacherMarks from "./pages/teacher/TeacherMarks";
import TeacherNotes from "./pages/teacher/TeacherNotes";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentNotes from "./pages/student/StudentNotes";
import SubmitEnrollment from "./pages/SubmitEnrollment";
import ReceiptPage from "./pages/ReceiptPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/results" element={<Results />} />
          <Route path="/enroll" element={<Enroll />} />
          <Route path="/enroll/:classId" element={<Enroll />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/courses" element={<AdminCourses />} />
          <Route path="/admin/enrollments" element={<AdminEnrollments />} />
          <Route path="/admin/students" element={<AdminStudents />} />
          <Route path="/admin/teachers" element={<AdminTeachers />} />
          <Route path="/admin/attendance" element={<AdminAttendance />} />
          <Route path="/admin/achievers" element={<AdminAchievers />} />
          <Route path="/admin/announcements" element={<Announcements />} />
          <Route path="/admin/payments" element={<AdminPayments />} />
          <Route path="/admin/marks" element={<AdminMarks />} />
          <Route path="/admin/rankings" element={<AdminRankings />} />
          <Route path="/admin/notes" element={<AdminNotes />} />
          <Route path="/submit-enrollment" element={<SubmitEnrollment />} />
          <Route path="/receipt/:id" element={<ReceiptPage />} />
          <Route path="/teacher" element={<TeacherDashboard />} />
          <Route path="/teacher/marks" element={<TeacherMarks />} />
          <Route path="/teacher/notes" element={<TeacherNotes />} />
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/student/notes" element={<StudentNotes />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
