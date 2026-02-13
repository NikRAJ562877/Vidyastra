import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { adminNavItems } from "@/lib/nav-config";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Trophy, Plus, Save, Trash2, Search, Edit } from "lucide-react";
import { toast } from "sonner";
import useTests from "@/hooks/use-tests";
import useMarks from "@/hooks/use-marks";
import useStudents from "@/hooks/use-students";
import {
  classes as mockClasses,
  subjects as mockSubjects,
} from "@/lib/mock-data";

const AdminMarks = () => {
  const { tests, add: addTest, remove: removeTest } = useTests();
  const { marks, updateMark } = useMarks();
  const { students } = useStudents();

  const [isTestDialogOpen, setIsTestDialogOpen] = useState(false);
  const [newTest, setNewTest] = useState({
    name: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
    classes: [] as string[],
  });

  const [selectedTestId, setSelectedTestId] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  const handleAddTest = () => {
    if (!newTest.name || newTest.classes.length === 0) {
      toast.error("Test name and at least one class are required");
      return;
    }
    addTest(newTest);
    setIsTestDialogOpen(false);
    setNewTest({
      name: "",
      date: new Date().toISOString().split("T")[0],
      description: "",
      classes: [],
    });
    toast.success("New test created successfully!");
  };

  const toggleClass = (cls: string) => {
    setNewTest((prev) => ({
      ...prev,
      classes: prev.classes.includes(cls)
        ? prev.classes.filter((c) => c !== cls)
        : [...prev.classes, cls],
    }));
  };

  const filteredStudents = students.filter((s) => s.class === selectedClass);
  const currentTest = tests.find((t) => t.id === selectedTestId);

  const handleMarkChange = (studentId: string, value: string) => {
    const marksValue = value === "" ? null : parseInt(value);
    updateMark(selectedTestId, studentId, selectedSubject, marksValue);
  };

  return (
    <DashboardLayout
      title="Test Management"
      navItems={adminNavItems}
      userName="Admin"
      userRole="admin"
    >
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-muted-foreground">
          Manage examinations and student performance records.
        </div>
        <Button onClick={() => setIsTestDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Create New Test
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="space-y-2">
          <Label>Select Test</Label>
          <Select value={selectedTestId} onValueChange={setSelectedTestId}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a test..." />
            </SelectTrigger>
            <SelectContent>
              {tests.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.name} ({t.date})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Select Class</Label>
          <Select
            value={selectedClass}
            onValueChange={setSelectedClass}
            disabled={!selectedTestId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose a class..." />
            </SelectTrigger>
            <SelectContent>
              {currentTest?.classes.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Select Subject</Label>
          <Select
            value={selectedSubject}
            onValueChange={setSelectedSubject}
            disabled={!selectedClass}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose a subject..." />
            </SelectTrigger>
            <SelectContent>
              {mockSubjects.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedTestId && selectedClass && selectedSubject ? (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="p-4 bg-muted/30 border-b flex justify-between items-center">
            <h3 className="font-heading font-bold text-sm">
              Mark Entry: {currentTest?.name} - {selectedClass} -{" "}
              {selectedSubject}
            </h3>
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
              Autosaved
            </span>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead>Register No.</TableHead>
                <TableHead className="w-[200px]">Marks Obtained</TableHead>
                <TableHead className="w-[100px]">Total Marks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-8 text-muted-foreground"
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
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {s.registerNumber}
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          placeholder="Enter marks"
                          className="h-8"
                          value={mark?.marks === null ? "" : mark?.marks}
                          onChange={(e) =>
                            handleMarkChange(s.id, e.target.value)
                          }
                        />
                      </TableCell>
                      <TableCell className="text-sm font-bold text-muted-foreground">
                        / 100
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border border-dashed p-12 text-center">
          <Trophy className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="font-heading font-bold mb-2">Ready to Enter Marks?</h3>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto">
            Please select a test, class, and subject from the filters above to
            start entering or viewing marks.
          </p>
        </div>
      )}

      {/* Create Test Dialog */}
      <Dialog open={isTestDialogOpen} onOpenChange={setIsTestDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Examination / Test</DialogTitle>
            <DialogDescription>
              Set up a new test to start collecting marks from teachers.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Test Name</Label>
              <Input
                placeholder="e.g. June Monthly Test"
                value={newTest.name}
                onChange={(e) =>
                  setNewTest({ ...newTest, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Date of Examination</Label>
              <Input
                type="date"
                value={newTest.date}
                onChange={(e) =>
                  setNewTest({ ...newTest, date: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Description (Optional)</Label>
              <Input
                placeholder="Brief details about the test"
                value={newTest.description}
                onChange={(e) =>
                  setNewTest({ ...newTest, description: e.target.value })
                }
              />
            </div>
            <div className="space-y-3">
              <Label>Applicable Classes</Label>
              <div className="grid grid-cols-2 gap-2 max-h-[150px] overflow-y-auto p-2 border rounded-md">
                {mockClasses.map((c) => (
                  <div key={c} className="flex items-center space-x-2">
                    <Checkbox
                      id={`class-${c}`}
                      checked={newTest.classes.includes(c)}
                      onCheckedChange={() => toggleClass(c)}
                    />
                    <label
                      htmlFor={`class-${c}`}
                      className="text-xs cursor-pointer"
                    >
                      {c}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsTestDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAddTest}>Create Test</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AdminMarks;
