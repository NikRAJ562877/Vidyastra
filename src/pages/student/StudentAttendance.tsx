import { useState, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { attendance } from "@/lib/mock-data";
import { studentNavItems } from "@/lib/nav-config";
import {
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Info,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const StudentAttendance = () => {
  const { user } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const studentAttendance = useMemo(
    () => attendance.filter((a) => a.studentId === user.id),
    [user.id],
  );

  const stats = useMemo(() => {
    const present = studentAttendance.filter(
      (a) => a.status === "present",
    ).length;
    const total = studentAttendance.length;
    return {
      total,
      present,
      absent: total - present,
      percentage: total > 0 ? (present / total) * 100 : 0,
    };
  }, [studentAttendance]);

  // Calendar Logic
  const daysInMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const calendarDays = useMemo(() => {
    const days = [];
    const numDays = daysInMonth(currentMonth);
    const startDay = firstDayOfMonth(currentMonth);

    // Empty slots for start of month
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }

    // Actual days
    for (let day = 1; day <= numDays; day++) {
      const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const record = studentAttendance.find((a) => a.date === dateStr);
      days.push({ day, status: record?.status || "none" });
    }

    return days;
  }, [currentMonth, studentAttendance]);

  const monthName = currentMonth.toLocaleString("default", { month: "long" });

  const nextMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
    );
  const prevMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1),
    );

  return (
    <DashboardLayout
      title="Attendance Tracker"
      navItems={studentNavItems}
      userName={user.name || "Student"}
      userRole="student"
    >
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Calendar View */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded-2xl border border-border shadow-card p-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-heading font-bold">
                  {monthName} {currentMonth.getFullYear()}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Your attendance presence for this month
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={prevMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={nextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div
                  key={d}
                  className="text-center text-xs font-bold text-muted-foreground uppercase py-2"
                >
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((d, i) => (
                <div
                  key={i}
                  className={cn(
                    "aspect-square rounded-xl flex flex-col items-center justify-center relative transition-all border",
                    !d
                      ? "border-transparent"
                      : "border-border/40 hover:border-primary/50 cursor-default",
                    d?.status === "present" &&
                    "bg-green-500/10 border-green-200",
                    d?.status === "absent" && "bg-red-500/10 border-red-200",
                  )}
                >
                  {d && (
                    <>
                      <span
                        className={cn(
                          "text-sm font-semibold",
                          d.status === "present"
                            ? "text-green-700"
                            : d.status === "absent"
                              ? "text-red-700"
                              : "text-foreground",
                        )}
                      >
                        {d.day}
                      </span>
                      {d.status === "present" && (
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1" />
                      )}
                      {d.status === "absent" && (
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1" />
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-4 pt-6 border-t border-border">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span>Present</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span>Absent</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-muted border border-border" />
                <span>No Data / Holiday</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-6">
          <div className="bg-card rounded-2xl border border-border shadow-card p-6">
            <h3 className="font-heading font-bold mb-6 flex items-center gap-2">
              <Info className="h-4 w-4 text-primary" /> Overall Statistics
            </h3>

            <div className="space-y-6">
              <div className="text-center py-6 bg-primary/5 rounded-2xl border border-primary/10">
                <p className="text-sm text-muted-foreground mb-1 font-medium">
                  Attendance Score
                </p>
                <h4 className="text-5xl font-heading font-black text-primary">
                  {stats.percentage.toFixed(0)}%
                </h4>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-green-50/50 border border-green-100">
                  <p className="text-xs text-green-700 font-bold uppercase">
                    Present
                  </p>
                  <p className="text-2xl font-heading font-bold text-green-800">
                    {stats.present}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-red-50/50 border border-red-100">
                  <p className="text-xs text-red-700 font-bold uppercase">
                    Absent
                  </p>
                  <p className="text-2xl font-heading font-bold text-red-800">
                    {stats.absent}
                  </p>
                </div>
              </div>

              <div className="pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Total Working Days
                  </span>
                  <span className="font-bold">{stats.total}</span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-full"
                    style={{ width: `${stats.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border shadow-card p-6 overflow-hidden relative">
            <div className="absolute -right-4 -bottom-4 opacity-5">
              <CalendarCheck className="w-24 h-24 text-primary" />
            </div>
            <h3 className="font-heading font-bold mb-4">Note</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Attendance is mandatory for all classes. A minimum of 75%
              attendance is required to appear for final examinations.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentAttendance;
