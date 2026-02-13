import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  BookOpen,
  ClipboardList,
  CalendarCheck,
  Trophy,
  Upload,
  Plus,
  Save,
  User,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import useTests from "@/hooks/use-tests";
import useMarks from "@/hooks/use-marks";
import useStudents from "@/hooks/use-students";
import { teachers } from "@/lib/mock-data";

const navItems = [
  {
    label: "Dashboard",
    href: "/teacher",
    icon: <ClipboardList className="h-4 w-4" />,
  },
  {
    label: "Upload Notes",
    href: "/teacher/notes",
    icon: <Upload className="h-4 w-4" />,
  },
  {
    label: "Upload Marks",
    href: "/teacher/marks",
    icon: <BookOpen className="h-4 w-4" />,
  },
  {
    label: "Attendance",
    href: "/teacher/attendance",
    icon: <CalendarCheck className="h-4 w-4" />,
  },
  {
    label: "Rankings",
    href: "/teacher/rankings",
    icon: <Trophy className="h-4 w-4" />,
  },
];

const TeacherMarks = () => {
  const user = JSON.parse(localStorage.getItem("auth_user") || "{}");
  const teacher = teachers.find((t) => t.id === user.id);

  const { tests } = useTests();
  const { marks, updateMark } = useMarks();
  const { students } = useStudents();

  const [selectedTestId, setSelectedTestId] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  if (!teacher)
    return (
      <div className="p-8 text-center text-muted-foreground">
        Teacher not found
      </div>
    );

  // Only tests that are applicable to teacher's assigned classes
  const applicableTests = tests.filter((t) =>
    t.classes.some((c) => teacher.assignedClasses.includes(c)),
  );
  const currentTest = tests.find((t) => t.id === selectedTestId);

  // Available classes for selected test that teacher is also assigned to
  const availableClasses =
    currentTest?.classes.filter((c) => teacher.assignedClasses.includes(c)) ||
    [];

  const filteredStudents = students.filter((s) => s.class === selectedClass);

  const handleMarkChange = (studentId: string, value: string) => {
    const marksValue = value === "" ? null : parseInt(value);
    updateMark(selectedTestId, studentId, selectedSubject, marksValue);
  };

  return (
    <DashboardLayout
      title="Upload Subject Marks"
      navItems={navItems}
      userName={user.name || "Teacher"}
      userRole="teacher"
    >
      <div className="text-sm text-muted-foreground mb-6">
        Select a test and class to enter marks for your assigned subjects.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="space-y-2">
          <Label>Examination / Test</Label>
          <Select
            value={selectedTestId}
            onValueChange={(val) => {
              setSelectedTestId(val);
              setSelectedClass("");
              setSelectedSubject("");
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose a test..." />
            </SelectTrigger>
            <SelectContent>
              {applicableTests.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Class</Label>
          <Select
            value={selectedClass}
            onValueChange={setSelectedClass}
            disabled={!selectedTestId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose a class..." />
            </SelectTrigger>
            <SelectContent>
              {availableClasses.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Subject</Label>
          <Select
            value={selectedSubject}
            onValueChange={setSelectedSubject}
            disabled={!selectedClass}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose a subject..." />
            </SelectTrigger>
            <SelectContent>
              {teacher.assignedSubjects.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedTestId && selectedClass && selectedSubject ? (
        <div className="bg-card rounded-xl border border-border overflow-hidden shadow-card">
          <div className="p-4 bg-primary/5 border-b flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Badge className="gradient-primary border-none">
                {selectedSubject}
              </Badge>
              <h3 className="font-heading font-bold text-sm">
                Mark Entry: {currentTest?.name} - {selectedClass}
              </h3>
            </div>
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider flex items-center gap-1">
              <Save className="h-3 w-3" /> Autosaving...
            </span>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead>Register No.</TableHead>
                <TableHead className="w-[200px]">Marks Obtained</TableHead>
                <TableHead className="w-[100px]">Out Of</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-12 text-muted-foreground"
                  >
                    No students found in this class.
                  </TableCell>
                </TableRow>
              ) : (
                filteredStudents.map((s) => {
                  const mark = marks.find(
                    (m) =>
                      m.testId === selectedTestId &&
                      m.studentId === s.id &&
                      m.subject === selectedSubject,
                  );
                  return (
                    <TableRow key={s.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-sm bg-muted flex items-center justify-center">
                            <User className="h-3.5 w-3.5 text-muted-foreground" />
                          </div>
                          <span className="font-medium text-sm">{s.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground font-mono">
                        {s.registerNumber}
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          placeholder="Enter marks"
                          className="h-8 border-primary/20 focus:border-primary"
                          value={mark?.marks === null ? "" : mark?.marks}
                          onChange={(e) =>
                            handleMarkChange(s.id, e.target.value)
                          }
                        />
                      </TableCell>
                      <TableCell className="text-xs font-bold text-muted-foreground opacity-50">
                        / 100
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
          <div className="p-4 bg-muted/20 border-t flex justify-end">
            <p className="text-[10px] text-muted-foreground italic">
              Note: Marks are saved instantly as you type. Ensure all entries
              are double-checked before final publication.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border border-dashed p-16 text-center shadow-sm">
          <BookOpen className="h-12 w-12 text-primary/20 mx-auto mb-4" />
          <h3 className="font-heading font-bold text-lg mb-2">
            Subject Performance Entry
          </h3>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Please select the specific test, class, and subject you wish to
            update from the filters above.
          </p>
        </div>
      )}
    </DashboardLayout>
  );
};

export default TeacherMarks;
