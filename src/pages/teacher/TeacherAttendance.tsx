import { useState, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
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
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import useStudents from "@/hooks/use-students";
import useAttendance from "@/hooks/use-attendance";
import {
  classes as mockClasses,
  batches as mockBatches,
  Student,
  teachers,
} from "@/lib/mock-data";
import {
  Search,
  Filter,
  MessageSquare,
  CheckCircle,
  XCircle,
  Send,
} from "lucide-react";
import { toast } from "sonner";

const TeacherAttendance = () => {
  const { user } = useAuth();
  const teacher = teachers.find((t) => t.id === user.id);

  const { students } = useStudents();
  const { attendance, markAttendance } = useAttendance();
  const [classFilter, setClassFilter] = useState(teacher?.assignedClasses?.[0] ?? mockClasses[0]);
  const [batchFilter, setBatchFilter] = useState(teacher?.assignedBatches?.[0] ?? mockBatches[0]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  // WhatsApp Dialog State
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [targetStudent, setTargetStudent] = useState<Student | null>(null); // null means bulk
  const [messageType, setMessageType] = useState<"absent" | "ptm" | "custom">(
    "absent",
  );
  const [customMessage, setCustomMessage] = useState("");

  const filteredStudents = useMemo(() => {
    return students.filter(
      (s) => s.class === classFilter && s.batch === batchFilter && (!teacher || teacher.assignedClasses.includes(s.class)),
    );
  }, [students, classFilter, batchFilter, teacher]);

  const getStatus = (studentId: string) => {
    const record = attendance.find(
      (a) => a.studentId === studentId && a.date === selectedDate,
    );
    return record?.status || "none"; // none, present, absent
  };

  const handleWhatsApp = (student: Student | null = null) => {
    setTargetStudent(student);
    setIsWhatsAppOpen(true);
  };

  const sendWhatsApp = () => {
    let message = "";
    if (messageType === "absent") {
      message = targetStudent
        ? `Hello, your ward ${targetStudent.name} is absent today (${selectedDate}).`
        : `Hello, your ward is absent today (${selectedDate}).`;
    } else if (messageType === "ptm") {
      message =
        "Dear Parent, we have a PTM meeting scheduled for this Saturday at 10 AM. Please make sure to attend.";
    } else {
      message = customMessage;
    }

    if (targetStudent) {
      // Individual message simulation
      const whatsappUrl = `https://wa.me/${targetStudent.phone}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, "_blank");
      toast.success(
        `WhatsApp redirection for ${targetStudent.name} initiated.`,
      );
    } else {
      // Bulk message simulation
      toast.success(
        `Bulk WhatsApp broadcast for ${filteredStudents.length} students initiated.`,
      );
      console.log("Bulk Message:", message);
      console.log(
        "Recipients:",
        filteredStudents.map((s) => s.phone),
      );
    }

    setIsWhatsAppOpen(false);
    setCustomMessage("");
  };

  return (
    <DashboardLayout
      title="Attendance & Communication"
      navItems={teacherNavItems}
      userName={user.name || "Teacher"}
      userRole="teacher"
    >
      <div className="flex flex-col md:flex-row gap-4 mb-6 bg-card p-4 rounded-xl border border-border shadow-sm">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground uppercase font-bold px-1">
              Select Class
            </Label>
            <Select value={classFilter} onValueChange={setClassFilter}>
              <SelectTrigger className="bg-background border-border hover:border-primary/50 transition-colors">
                <SelectValue placeholder="Class" />
              </SelectTrigger>
              <SelectContent>
                {(teacher?.assignedClasses ?? mockClasses).map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground uppercase font-bold px-1">
              Select Batch
            </Label>
            <Select value={batchFilter} onValueChange={setBatchFilter}>
              <SelectTrigger className="bg-background border-border hover:border-primary/50 transition-colors">
                <SelectValue placeholder="Batch" />
              </SelectTrigger>
              <SelectContent>
                {(teacher?.assignedBatches ?? mockBatches).map((b) => (
                  <SelectItem key={b} value={b}>
                    {b}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground uppercase font-bold px-1">
              Date
            </Label>
            <input
              type="date"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-end">
          <Button
            variant="secondary"
            className="w-full md:w-auto"
            onClick={() => handleWhatsApp(null)}
          >
            <MessageSquare className="h-4 w-4 mr-2" /> Bulk Notify (WA)
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="py-4">Student Name</TableHead>
              <TableHead>Register No</TableHead>
              <TableHead className="text-center">Current Status</TableHead>
              <TableHead className="text-right">Mark Attendance</TableHead>
              <TableHead className="text-right">Notify</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-12 text-muted-foreground"
                >
                  No students found for the selected filters.
                </TableCell>
              </TableRow>
            ) : (
              filteredStudents.map((s) => {
                const status = getStatus(s.id);
                return (
                  <TableRow
                    key={s.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <TableCell className="font-medium py-4">{s.name}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {s.registerNumber}
                    </TableCell>
                    <TableCell className="text-center">
                      {status === "present" ? (
                        <Badge className="bg-green-500/10 text-green-600 border-green-200 hover:bg-green-500/20">
                          Present
                        </Badge>
                      ) : status === "absent" ? (
                        <Badge
                          variant="destructive"
                          className="bg-red-500/10 text-red-600 border-red-200 hover:bg-red-500/20"
                        >
                          Absent
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">
                          Not marked
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant={status === "present" ? "default" : "outline"}
                          className={
                            status === "present"
                              ? "bg-green-600 hover:bg-green-700"
                              : ""
                          }
                          onClick={() =>
                            markAttendance(s.id, "present", selectedDate)
                          }
                        >
                          <CheckCircle className="h-3 w-3 mr-1" /> P
                        </Button>
                        <Button
                          size="sm"
                          variant={
                            status === "absent" ? "destructive" : "outline"
                          }
                          onClick={() =>
                            markAttendance(s.id, "absent", selectedDate)
                          }
                        >
                          <XCircle className="h-3 w-3 mr-1" /> A
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-secondary hover:text-secondary-foreground"
                        onClick={() => handleWhatsApp(s)}
                      >
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isWhatsAppOpen} onOpenChange={setIsWhatsAppOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="bg-green-500/10 p-2 rounded-lg">
                <MessageSquare className="h-5 w-5 text-green-600" />
              </span>
              WhatsApp Notification
            </DialogTitle>
            <DialogDescription>
              {targetStudent
                ? `Sending notification to parent of ${targetStudent.name}`
                : `Sending bulk notification to all ${filteredStudents.length} parents in ${classFilter} - ${batchFilter}`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-3">
              <Label className="text-xs font-bold uppercase text-muted-foreground">
                Select Preset Message
              </Label>
              <div className="grid grid-cols-1 gap-2">
                <button
                  className={`text-left px-4 py-3 rounded-xl border text-sm transition-all ${messageType === "absent" ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "border-border hover:bg-muted"}`}
                  onClick={() => setMessageType("absent")}
                >
                  <p className="font-bold">Absence Alert</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Notifies that the ward is absent today.
                  </p>
                </button>
                <button
                  className={`text-left px-4 py-3 rounded-xl border text-sm transition-all ${messageType === "ptm" ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "border-border hover:bg-muted"}`}
                  onClick={() => setMessageType("ptm")}
                >
                  <p className="font-bold">PTM Invitation</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Invites parents for a meeting this Saturday.
                  </p>
                </button>
                <button
                  className={`text-left px-4 py-3 rounded-xl border text-sm transition-all ${messageType === "custom" ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "border-border hover:bg-muted"}`}
                  onClick={() => setMessageType("custom")}
                >
                  <p className="font-bold">Custom Message</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Write your own message below.
                  </p>
                </button>
              </div>
            </div>

            {messageType === "custom" && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                <Label htmlFor="custom-msg">Your Message</Label>
                <Textarea
                  id="custom-msg"
                  placeholder="Type your message here..."
                  rows={4}
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsWhatsAppOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={sendWhatsApp}
              className="bg-green-600 hover:bg-green-700"
            >
              <Send className="h-4 w-4 mr-2" /> Send via WhatsApp
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default TeacherAttendance;
