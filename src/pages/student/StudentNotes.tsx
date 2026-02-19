import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { studentNavItems } from "@/lib/nav-config";
import { FileText, Download, Search, Clock } from "lucide-react";
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
import useNotes from "@/hooks/use-notes";
import { students } from "@/lib/mock-data";

const StudentNotes = () => {
  const { user } = useAuth();
  const student = students.find((s) => s.id === user.id);
  const { notes } = useNotes();
  const [searchTerm, setSearchTerm] = useState("");

  if (!student)
    return (
      <div className="p-8 text-center text-muted-foreground">
        Student not found
      </div>
    );

  const studentNotes = notes.filter((n) => {
    const isTargetedToClass = n.class === student.class;
    const isTargetedToBatch = n.batch === "All Batches" || n.batch === student.batch;
    const matchesSearch =
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.subject.toLowerCase().includes(searchTerm.toLowerCase());

    // Slow learner logic
    // Common notes (not isSlowLearnerOnly) are shown to everyone
    // Slow learner notes are ONLY shown to slow learners
    const isVisibleToStudent = !n.isSlowLearnerOnly || student.category === "slow_learner";

    return isTargetedToClass && isTargetedToBatch && matchesSearch && isVisibleToStudent;
  });

  return (
    <DashboardLayout
      title="Study Materials & Notes"
      navItems={studentNavItems}
      userName={user.name || "Student"}
      userRole="student"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title or subject..."
            className="pl-10 h-10 rounded-xl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="text-right">
          <p className="text-sm font-medium">{student.class}</p>
          <p className="text-xs text-muted-foreground">{student.batch}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead>Study Material</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Uploaded</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {studentNotes.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-16 text-muted-foreground"
                >
                  <div className="max-w-xs mx-auto">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-10" />
                    <p className="font-heading font-bold text-lg text-slate-400">
                      No materials yet
                    </p>
                    <p className="text-sm">
                      Study materials for your class will appear here once
                      uploaded by teachers or admins.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              studentNotes.map((note) => (
                <TableRow
                  key={note.id}
                  className="group transition-colors hover:bg-slate-50"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{note.title}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          {note.fileName}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-md">
                      {note.subject}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                      <Clock className="h-3.5 w-3.5" />
                      {note.date}
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      By {note.uploadedBy}
                    </p>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-lg shadow-sm group-hover:bg-primary group-hover:text-white transition-all"
                    >
                      <Download className="h-4 w-4 mr-2" /> Download
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </DashboardLayout>
  );
};

export default StudentNotes;
