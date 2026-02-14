import { useMemo, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from '@/components/ui/select';
import { BookOpen, FileText, Download, ArrowLeft, CheckCircle, IndianRupee } from 'lucide-react';
import { Link } from 'react-router-dom';
import useMarks from '@/hooks/use-marks';
import useTests from '@/hooks/use-tests';
import { students, tests as defaultTests } from '@/lib/mock-data';
import { Progress } from '@/components/ui/progress';

const navItems = [
  { label: 'Dashboard', href: '/student', icon: <BookOpen className="h-4 w-4" /> },
  { label: 'Marks', href: '/student/marks', icon: <BookOpen className="h-4 w-4" /> },
  { label: 'Attendance', href: '/student/attendance', icon: <BookOpen className="h-4 w-4" /> },
  { label: 'Notes', href: '/student/notes', icon: <FileText className="h-4 w-4" /> },
  { label: 'Rankings', href: '/student/rankings', icon: <BookOpen className="h-4 w-4" /> },
  { label: 'Payments', href: '/student/payments', icon: <IndianRupee className="h-4 w-4" /> },

];

const gradeFor = (pct: number) => {
  if (pct >= 90) return 'A+';
  if (pct >= 80) return 'A';
  if (pct >= 70) return 'B';
  if (pct >= 60) return 'C';
  return 'D';
};

const StudentMarks = () => {
  const user = JSON.parse(localStorage.getItem('auth_user') || '{}');
  const student = students.find(s => s.id === user.id);
  const { marks } = useMarks();
  const { tests } = useTests();

  const classTests = useMemo(() => {
    if (!student) return [];
    return tests.filter(t => t.classes.includes(student.class)).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [student, tests]);

  const [selectedTestId, setSelectedTestId] = useState<string | null>(classTests[0]?.id ?? null);

  const selectedTest = classTests.find(t => t.id === selectedTestId) ?? null;

  const testResults = useMemo(() => {
    if (!selectedTest || !student) return [];
    return marks.filter(m => m.testId === selectedTest.id && m.studentId === student.id);
  }, [marks, selectedTest, student]);

  if (!student) return <div className="p-8 text-center text-muted-foreground">Student not found</div>;

  const totalObtained = testResults.reduce((s, m) => s + (m.marks || 0), 0);
  const totalMax = testResults.reduce((s, m) => s + m.totalMarks, 0);
  const percent = totalMax > 0 ? (totalObtained / totalMax) * 100 : 0;

  // class rank for the selected test
  const classmates = students.filter(s => s.class === student.class);
  const rankings = classmates.map(s => {
    const sMarks = marks.filter(m => m.testId === (selectedTest?.id ?? '') && m.studentId === s.id && m.marks !== null);
    const total = sMarks.reduce((sum, m) => sum + (m.marks || 0), 0);
    return { id: s.id, total };
  }).sort((a, b) => b.total - a.total);
  const rank = rankings.findIndex(r => r.id === student.id) + 1;

  return (
    <DashboardLayout title="My Marks" navItems={navItems} userName={user.name || 'Student'} userRole="student">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold">Marks & Results</h1>
          <p className="text-sm text-muted-foreground mt-1">Subject-wise performance for selected tests</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" asChild>
            <Link to="/student">Back to dashboard</Link>
          </Button>
          <Button size="sm" className="rounded-xl">
            <Download className="h-4 w-4 mr-2" /> Download
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <BookOpen className="h-6 w-6 text-primary" />
              <div>
                <p className="font-heading font-bold">{selectedTest ? selectedTest.name : 'Select a test'}</p>
                <p className="text-xs text-muted-foreground">{selectedTest ? new Date(selectedTest.date).toLocaleDateString() : ''}</p>
              </div>
            </div>
            <div className="w-56">
              <Select onValueChange={(v) => setSelectedTestId(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a test..." />
                </SelectTrigger>
                <SelectContent>
                  {classTests.length === 0 ? (
                    <SelectItem value="none">No tests available</SelectItem>
                  ) : (
                    classTests.map(t => (
                      <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead className="text-right">Marks Obtained</TableHead>
                <TableHead className="text-right">Maximum Marks</TableHead>
                <TableHead className="text-right">Percentage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(!selectedTest || testResults.length === 0) ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-12 text-muted-foreground italic">
                    {selectedTest ? 'Marks are being updated. Check back shortly.' : 'Choose a test to view marks.'}
                  </TableCell>
                </TableRow>
              ) : (
                testResults.map(m => (
                  <TableRow key={m.id} className="h-14">
                    <TableCell className="font-semibold text-slate-700">{m.subject}</TableCell>
                    <TableCell className="text-right font-bold text-lg">{m.marks !== null ? m.marks : <span className="text-muted-foreground italic text-sm font-normal">Pending</span>}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{m.totalMarks}</TableCell>
                    <TableCell className="text-right w-32">
                      {m.marks !== null ? (
                        <div className="flex items-center justify-end gap-3">
                          <div className="w-24">
                            <Progress value={Math.round((m.marks / m.totalMarks) * 100)} className="h-2" />
                          </div>
                          <div className="text-sm font-semibold">{Math.round((m.marks / m.totalMarks) * 100)}%</div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground italic text-xs">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="space-y-4">
          <div className="bg-card rounded-xl border border-border p-5 text-center">
            <p className="text-sm text-muted-foreground uppercase font-bold tracking-wider">Total Score</p>
            <p className="text-4xl font-heading font-bold text-primary mt-2">{totalObtained} <span className="text-lg font-normal text-muted-foreground">/ {totalMax}</span></p>
            <p className="text-sm mt-2">{percent.toFixed(1)}% • Grade {gradeFor(percent)}</p>
          </div>

          <div className="bg-card rounded-xl border border-border p-5 text-center">
            <p className="text-sm text-muted-foreground uppercase font-bold tracking-wider">Class Rank</p>
            <p className="text-3xl font-heading font-bold mt-2">#{rank || '-'}</p>
            <p className="text-xs text-muted-foreground mt-1">out of {classmates.length}</p>
          </div>

          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="font-bold mb-2">What you'll find here</h3>
            <ul className="text-sm list-disc ml-5 space-y-1 text-muted-foreground">
              <li>Per-subject marks and maximum marks</li>
              <li>Overall percentage and grade for the selected test</li>
              <li>Class rank for that test</li>
              <li>Download or print your result</li>
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentMarks;
