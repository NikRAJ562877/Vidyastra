import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import { teachers, students } from "@/lib/mock-data";
import { BookOpen, Users, ClipboardList } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { teacherNavItems } from "@/lib/nav-config";
import ChangePassword from "@/components/ChangePassword";
import useTeachers from "@/hooks/use-teachers";

const TeacherDashboard = () => {
  const user = JSON.parse(localStorage.getItem("auth_user") || "{}");
  const { teachers } = useTeachers();
  const teacher = teachers.find((t) => t.id === user.id);

  if (!teacher)
    return (
      <div className="p-8 text-center text-muted-foreground">Teacher not found</div>
    );

  const assignedStudents = students.filter((s) =>
    teacher.assignedClasses.includes(s.class),
  );

  return (
    <DashboardLayout
      title="Teacher Dashboard"
      navItems={teacherNavItems}
      userName={user.name || "Teacher"}
      userRole="teacher"
    >
      {user.isFirstLogin && (
        <div className="mb-8">
          <ChangePassword
            userId={user.id}
            userRole="teacher"
            onSuccess={() => {
              window.location.reload();
            }}
          />
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard title="Assigned Classes" value={teacher.assignedClasses.length} icon={<BookOpen className="h-5 w-5" />} />
        <StatCard title="Total Students" value={assignedStudents.length} icon={<Users className="h-5 w-5" />} />
        <StatCard title="Subjects" value={teacher.assignedSubjects.length} icon={<ClipboardList className="h-5 w-5" />} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border border-border shadow-card p-5">
          <h2 className="font-heading font-bold mb-4">Assigned Classes & Batches</h2>
          <div className="space-y-3">
            {teacher.assignedClasses.map((cls) => (
              <div key={cls} className="flex items-center justify-between p-3 rounded-lg bg-muted">
                <span className="font-medium text-sm">{cls}</span>
                <div className="flex gap-2">
                  {teacher.assignedBatches.map((b) => (
                    <Badge key={b} variant="secondary" className="text-xs">{b}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border shadow-card p-5">
          <h2 className="font-heading font-bold mb-4">Assigned Subjects</h2>
          <div className="flex flex-wrap gap-2">
            {teacher.assignedSubjects.map((s) => (
              <Badge key={s} className="gradient-primary text-primary-foreground border-0 px-4 py-1.5">{s}</Badge>
            ))}
          </div>

          <h2 className="font-heading font-bold mt-6 mb-4">Students in Your Classes</h2>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {assignedStudents.map((s) => (
              <div key={s.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors">
                <span className="text-sm font-medium">{s.name}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">{s.class}</Badge>
                  {s.category === "slow_learner" && (
                    <Badge variant="destructive" className="text-xs">Slow Learner</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TeacherDashboard;
