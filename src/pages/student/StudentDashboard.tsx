import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import StatCard from "@/components/StatCard";
import { students, attendance, payments } from "@/lib/mock-data";
import { studentNavItems } from "@/lib/nav-config";
import useMarks from "@/hooks/use-marks";
import { Link } from "react-router-dom";
import {
  BookOpen,
  CalendarCheck,
  Trophy,
  IndianRupee,
  FileText,
  ClipboardList,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import ChangePassword from "@/components/ChangePassword";
import useStudents from "@/hooks/use-students";

const StudentDashboard = () => {
  const { user } = useAuth();
  if (!user) return null; // Or redirect logic
  const { marks } = useMarks();
  const { students } = useStudents();
  const student = students.find((s) => s.id === user.id);

  if (!student)
    return (
      <div className="p-8 text-center text-muted-foreground">
        Student not found
      </div>
    );
  const studentMarks = marks.filter((m) => m.studentId === student.id);
  const validMarks = studentMarks.filter((m) => m.marks !== null);
  const totalMarks = validMarks.reduce((s, m) => s + (m.marks || 0), 0);
  const avgMarks = validMarks.length > 0 ? totalMarks / validMarks.length : 0;

  const studentAttendance = attendance.filter(
    (a) => a.studentId === student.id,
  );
  const presentCount = studentAttendance.filter(
    (a) => a.status === "present",
  ).length;
  const attendancePercent =
    studentAttendance.length > 0
      ? (presentCount / studentAttendance.length) * 100
      : 0;

  const studentPayments = payments.filter((p) => p.studentId === student.id);

  // Class rank
  const classmates = students.filter((s) => s.class === student.class);
  const rankings = classmates
    .map((s) => {
      const sMarks = marks.filter(
        (m) => m.studentId === s.id && m.marks !== null,
      );
      const total = sMarks.reduce((sum, m) => sum + (m.marks || 0), 0);
      return { id: s.id, total };
    })
    .sort((a, b) => b.total - a.total);
  const rank = rankings.findIndex((r) => r.id === student.id) + 1;

  return (
    <DashboardLayout
      title="Student Dashboard"
      navItems={studentNavItems}
      userName={user.name || "Student"}
      userRole="student"
    >
      {user.isFirstLogin && (
        <div className="mb-8">
          <ChangePassword
            userId={user.id}
            userRole="student"
            onSuccess={() => {
              // Reload to hide the component
              window.location.reload();
            }}
          />
        </div>
      )}

      {/* Rank Banner */}
      <div className="gradient-primary rounded-xl p-5 mb-6 text-primary-foreground">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-primary-foreground/70">
              Your Class Rank
            </p>
            <p className="text-4xl font-heading font-bold">#{rank}</p>
            <p className="text-sm text-primary-foreground/80 mt-1">
              out of {classmates.length} students in {student.class}
            </p>
          </div>
          <Trophy className="h-12 w-12 text-primary-foreground/30" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Average Score"
          value={`${avgMarks.toFixed(1)}%`}
          icon={<BookOpen className="h-5 w-5" />}
        />
        <StatCard
          title="Attendance"
          value={`${attendancePercent.toFixed(0)}%`}
          icon={<CalendarCheck className="h-5 w-5" />}
        />
        <StatCard
          title="Subjects"
          value={studentMarks.length}
          icon={<ClipboardList className="h-5 w-5" />}
        />
        <StatCard
          title="Total Marks"
          value={totalMarks}
          icon={<Trophy className="h-5 w-5" />}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Marks */}
        <div className="bg-card rounded-xl border border-border shadow-card">
          <div className="p-4 border-b border-border">
            <h2 className="font-heading font-bold">Subject-wise Marks</h2>
          </div>
          <div className="p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead className="text-right">Marks</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Percentage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentMarks.map((m, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{m.subject}</TableCell>
                    <TableCell className="text-right">
                      {m.marks !== null ? (
                        m.marks
                      ) : (
                        <span className="text-muted-foreground italic text-xs">
                          Result Not Published
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">{m.totalMarks}</TableCell>
                    <TableCell className="text-right w-32">
                      {m.marks !== null ? (
                        <div className="flex items-center justify-end gap-3">
                          <div className="w-24">
                            <Progress
                              value={Math.round((m.marks / m.totalMarks) * 100)}
                              className="h-2"
                            />
                          </div>
                          <div className="text-sm font-semibold">
                            {Math.round((m.marks / m.totalMarks) * 100)}%
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground italic text-xs">
                          —
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4 text-right">
              <Link
                to="/student/marks"
                className="text-sm font-medium text-primary hover:underline"
              >
                View full marks &amp; history
              </Link>
            </div>
          </div>
        </div>

        {/* Attendance + Payments */}
        <div className="space-y-6">
          <div className="bg-card rounded-xl border border-border shadow-card p-5">
            <h2 className="font-heading font-bold mb-4">Attendance Overview</h2>
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <Progress value={attendancePercent} className="h-3" />
                <p className="text-sm text-muted-foreground mt-2">
                  {presentCount} of {studentAttendance.length} days present
                </p>
              </div>
              <p className="text-2xl font-heading font-bold">
                {attendancePercent.toFixed(0)}%
              </p>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border shadow-card p-5">
            <h2 className="font-heading font-bold mb-4">Payment Status</h2>
            <div className="space-y-3">
              {studentPayments.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted"
                >
                  <div>
                    <p className="text-sm font-medium">
                      Installment {p.installment}/{p.totalInstallments}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Due: {p.dueDate}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-heading font-bold">
                      ₹{p.amount.toLocaleString()}
                    </p>
                    <Badge
                      variant={p.status === "paid" ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {p.status === "paid"
                        ? "Paid"
                        : p.status === "pending"
                          ? "Pending"
                          : "Not Paid"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
