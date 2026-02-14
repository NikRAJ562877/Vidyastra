import { useState, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { teacherNavItems } from "@/lib/nav-config";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trophy, Download, TrendingUp, Medal, User } from "lucide-react";
import useTests from "@/hooks/use-tests";
import useMarks from "@/hooks/use-marks";
import useStudents from "@/hooks/use-students";
import { teachers } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface StudentRanking {
  id: string;
  name: string;
  registerNumber: string;
  totalMarks: number;
  maxMarks: number;
  percentage: number;
  rank: number;
  subjectsCount: number;
}

const TeacherRankings = () => {
  const user = JSON.parse(localStorage.getItem("auth_user") || "{}");
  const teacher = teachers.find((t) => t.id === user.id);

  const { tests } = useTests();
  const { marks } = useMarks();
  const { students } = useStudents();

  const [selectedTestId, setSelectedTestId] = useState("");
  const [selectedClass, setSelectedClass] = useState("");

  const currentTest = tests.find((t) => t.id === selectedTestId);

  const classOptions = currentTest
    ? currentTest.classes.filter((c) => teacher?.assignedClasses.includes(c))
    : [];

  const rankings = useMemo(() => {
    if (!selectedTestId || !selectedClass) return [];

    const classStudents = students.filter(
      (s) => s.class === selectedClass && (!teacher || teacher.assignedClasses.includes(s.class)),
    );
    const testMarks = marks.filter((m) => m.testId === selectedTestId);

    const list: StudentRanking[] = classStudents.map((student) => {
      const studentMarks = testMarks.filter(
        (m) => m.studentId === student.id && m.marks !== null,
      );
      const total = studentMarks.reduce((sum, m) => sum + (m.marks || 0), 0);
      const max = studentMarks.reduce((sum, m) => sum + m.totalMarks, 0);
      const percentage = max > 0 ? (total / max) * 100 : 0;

      return {
        id: student.id,
        name: student.name,
        registerNumber: student.registerNumber,
        totalMarks: total,
        maxMarks: max,
        percentage,
        rank: 0,
        subjectsCount: studentMarks.length,
      };
    });

    return list
      .sort((a, b) => b.totalMarks - a.totalMarks)
      .map((item, index) => ({ ...item, rank: index + 1 }));
  }, [selectedTestId, selectedClass, students, marks, teacher]);

  if (!teacher) return <div className="p-8 text-center text-muted-foreground">Teacher not found</div>;

  return (
    <DashboardLayout title="Class Rankings" navItems={teacherNavItems} userName={user.name || 'Teacher'} userRole="teacher">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex gap-4 w-full md:w-auto">
          <div className="space-y-2 flex-1 md:w-64">
            <Label>Examination Name</Label>
            <Select
              value={selectedTestId}
              onValueChange={(val) => {
                setSelectedTestId(val);
                setSelectedClass("");
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a test..." />
              </SelectTrigger>
              <SelectContent>
                {tests.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 flex-1 md:w-48">
            <Label>Class / Grade</Label>
            <Select value={selectedClass} onValueChange={setSelectedClass} disabled={!selectedTestId}>
              <SelectTrigger>
                <SelectValue placeholder="Select class..." />
              </SelectTrigger>
              <SelectContent>
                {classOptions.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" /> Export PDF
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" /> Export CSV
          </Button>
        </div>
      </div>

      {selectedTestId && selectedClass ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {rankings.slice(0, 3).map((r, i) => (
              <div key={r.id} className={cn("p-6 rounded-2xl border relative overflow-hidden bg-white shadow-sm transition-all hover:shadow-md", i === 0 ? "border-amber-200" : i === 1 ? "border-slate-200" : "border-amber-800/10") }>
                <div className="flex justify-between items-start relative z-10">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Rank #{r.rank}</p>
                    <h3 className="font-heading font-bold text-xl">{r.name}</h3>
                    <p className="text-sm text-muted-foreground">{r.percentage.toFixed(1)}% ({r.totalMarks}/{r.maxMarks})</p>
                  </div>
                  <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", i === 0 ? "bg-amber-100 text-amber-600" : i === 1 ? "bg-slate-100 text-slate-600" : "bg-orange-100 text-orange-600") }>
                    <Medal className="h-6 w-6" />
                  </div>
                </div>
                <div className={cn("absolute -right-4 -bottom-4 opacity-5", i === 0 ? "text-amber-500" : i === 1 ? "text-slate-500" : "text-orange-950") }>
                  <Trophy className="w-24 h-24" />
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
            <div className="p-4 bg-muted/20 border-b flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <h2 className="font-heading font-bold">Class Standing & Performance</h2>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Rank</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Reg. ID</TableHead>
                  <TableHead>Subjects</TableHead>
                  <TableHead>Total Marks</TableHead>
                  <TableHead>Percentage</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rankings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">No results available for the selected criteria.</TableCell>
                  </TableRow>
                ) : (
                  rankings.map((r) => (
                    <TableRow key={r.id} className={cn(r.rank <= 3 && "bg-primary/5")}>
                      <TableCell className="font-bold">
                        <div className={cn("w-7 h-7 rounded-sm flex items-center justify-center text-xs", r.rank === 1 ? "bg-amber-100 text-amber-700" : r.rank === 2 ? "bg-slate-100 text-slate-700" : r.rank === 3 ? "bg-orange-100 text-orange-700" : "bg-muted text-muted-foreground") }>
                          #{r.rank}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-slate-50 border flex items-center justify-center">
                            <User className="h-4 w-4 text-slate-400" />
                          </div>
                          <span className="font-medium">{r.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground font-mono">{r.registerNumber}</TableCell>
                      <TableCell>{r.subjectsCount}</TableCell>
                      <TableCell className="font-bold">{r.totalMarks} <span className="text-xs font-normal text-muted-foreground">/ {r.maxMarks}</span></TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-muted h-1.5 rounded-full overflow-hidden">
                            <div className="bg-primary h-full" style={{ width: `${r.percentage}%` }}></div>
                          </div>
                          <span className="text-sm font-bold">{r.percentage.toFixed(1)}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost">View Details</Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-dashed p-24 text-center">
          <Trophy className="h-16 w-16 text-muted-foreground/20 mx-auto mb-6" />
          <h2 className="text-2xl font-heading font-bold text-slate-400">Class Performance Analytics</h2>
          <p className="text-muted-foreground max-w-sm mx-auto mt-2">Select an examination and a class to generate comparative rankings and performance statistics for your assigned classes.</p>
        </div>
      )}
    </DashboardLayout>
  );
};

export default TeacherRankings;
