import { useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { students } from "@/lib/mock-data";
import { studentNavItems } from "@/lib/nav-config";
import useMarks from "@/hooks/use-marks";
import { Trophy, Medal, Target, TrendingUp, User, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const StudentRankings = () => {
  const user = JSON.parse(localStorage.getItem("auth_user") || "{}");
  const { marks } = useMarks();
  const student = students.find((s) => s.id === user.id);

  const classmates = useMemo(
    () => students.filter((s) => s.class === student?.class),
    [student],
  );

  const rankings = useMemo(() => {
    if (!student) return [];

    return classmates
      .map((s) => {
        const sMarks = marks.filter(
          (m) => m.studentId === s.id && m.marks !== null,
        );
        const total = sMarks.reduce((sum, m) => sum + (m.marks || 0), 0);
        const max = sMarks.reduce((sum, m) => sum + m.totalMarks, 0);
        const percentage = max > 0 ? (total / max) * 100 : 0;

        return {
          id: s.id,
          name: s.name,
          total,
          percentage,
          isCurrentUser: s.id === user.id,
        };
      })
      .sort((a, b) => b.percentage - a.percentage);
  }, [classmates, marks, student, user.id]);

  const currentRank = rankings.findIndex((r) => r.isCurrentUser) + 1;
  const topPerformers = rankings.slice(0, 3);

  if (!student)
    return (
      <div className="p-8 text-center text-muted-foreground">
        Student not found
      </div>
    );

  return (
    <DashboardLayout
      title="Class Rankings"
      navItems={studentNavItems}
      userName={user.name || "Student"}
      userRole="student"
    >
      <div className="space-y-8">
        {/* Top 3 Podium */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topPerformers.map((r, i) => (
            <div
              key={r.id}
              className={cn(
                "p-6 rounded-2xl border relative overflow-hidden bg-card shadow-card transition-all hover:shadow-elevated",
                i === 0
                  ? "border-amber-200"
                  : i === 1
                    ? "border-slate-200"
                    : "border-amber-700/10",
              )}
            >
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "mb-2",
                      i === 0
                        ? "bg-amber-100 text-amber-700"
                        : i === 1
                          ? "bg-slate-100 text-slate-700"
                          : "bg-orange-100 text-orange-700",
                    )}
                  >
                    {i === 0
                      ? "Gold Medalist"
                      : i === 1
                        ? "Silver Medalist"
                        : "Bronze Medalist"}
                  </Badge>
                  <h3 className="font-heading font-bold text-xl flex items-center gap-2">
                    {r.name}{" "}
                    {r.isCurrentUser && (
                      <Badge className="bg-primary/10 text-primary border-primary/20">
                        You
                      </Badge>
                    )}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 font-medium">
                    {r.percentage.toFixed(1)}% Score
                  </p>
                </div>
                <div
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center shadow-inner",
                    i === 0
                      ? "bg-amber-100 text-amber-600"
                      : i === 1
                        ? "bg-slate-100 text-slate-600"
                        : "bg-orange-100 text-orange-600",
                  )}
                >
                  {i === 0 ? (
                    <Trophy className="h-6 w-6" />
                  ) : (
                    <Medal className="h-6 w-6" />
                  )}
                </div>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex-1 bg-muted h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-full"
                    style={{ width: `${r.percentage}%` }}
                  />
                </div>
                <span className="text-xs font-bold font-heading">
                  Rank #{i + 1}
                </span>
              </div>

              <div
                className={cn(
                  "absolute -right-6 -bottom-6 opacity-5",
                  i === 0
                    ? "text-amber-500"
                    : i === 1
                      ? "text-slate-500"
                      : "text-orange-950",
                )}
              >
                <Star className="w-24 h-24 rotate-12" />
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Detailed Leaderboard */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
              <div className="p-6 border-b border-border bg-muted/20">
                <h3 className="font-heading font-bold flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" /> Full Class
                  Leaderboard
                </h3>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Rank</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Score Progress</TableHead>
                    <TableHead className="text-right">Percentage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rankings.map((r, i) => (
                    <TableRow
                      key={r.id}
                      className={cn(
                        "transition-colors",
                        r.isCurrentUser
                          ? "bg-primary/5 hover:bg-primary/10"
                          : "hover:bg-muted/30",
                      )}
                    >
                      <TableCell className="font-bold">
                        <div
                          className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center text-sm",
                            i === 0
                              ? "bg-amber-100 text-amber-700"
                              : i === 1
                                ? "bg-slate-100 text-slate-700"
                                : i === 2
                                  ? "bg-orange-100 text-orange-700"
                                  : "bg-muted text-muted-foreground",
                          )}
                        >
                          #{i + 1}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 border flex items-center justify-center">
                            <User className="h-4 w-4 text-slate-400" />
                          </div>
                          <span
                            className={cn(
                              "font-medium",
                              r.isCurrentUser && "text-primary font-bold",
                            )}
                          >
                            {r.name} {r.isCurrentUser && "(You)"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="w-48">
                        <Progress value={r.percentage} className="h-2" />
                      </TableCell>
                      <TableCell className="text-right font-bold font-heading">
                        {r.percentage.toFixed(1)}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* User Performance Card */}
          <div className="space-y-6">
            <div className="bg-card rounded-2xl border border-border shadow-card p-6">
              <h3 className="font-heading font-bold mb-6 flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" /> Your Standing
              </h3>

              <div className="text-center py-8 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl border border-primary/10">
                <p className="text-sm text-muted-foreground mb-1 font-medium">
                  Class Rank
                </p>
                <h4 className="text-6xl font-heading font-black text-primary">
                  #{currentRank}
                </h4>
                <p className="text-xs text-muted-foreground mt-2">
                  out of {classmates.length} students
                </p>
              </div>

              <div className="mt-8 space-y-4">
                <div className="p-4 rounded-xl bg-muted/50 border border-border">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">
                    Percentage Grade
                  </p>
                  <p className="text-xl font-bold font-heading">
                    {rankings
                      .find((r) => r.isCurrentUser)
                      ?.percentage.toFixed(1)}
                    %
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-muted/50 border border-border">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">
                    Batches Percentile
                  </p>
                  <p className="text-xl font-bold font-heading">
                    {Math.round(
                      ((classmates.length - currentRank) / classmates.length) *
                        100,
                    )}
                    th
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl border border-border shadow-card p-6 overflow-hidden relative">
              <div className="absolute -right-4 -bottom-4 opacity-10">
                <Trophy className="w-24 h-24 text-primary" />
              </div>
              <h3 className="font-heading font-bold mb-4">Aiming Higher?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Consistent practice and finishing your daily assignments will
                help you move up the ranks! You're doing great.
              </p>
              <Button
                variant="link"
                className="px-0 mt-2 text-primary font-bold"
              >
                View Roadmap →
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentRankings;
