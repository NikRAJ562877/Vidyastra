import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { ClipboardList, Upload, BookOpen, CalendarCheck, Trophy, FileText, Plus, Trash2, Download, Search, } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useStudents from "@/hooks/use-students";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { classes, batches, subjects } from "@/lib/mock-data";
import useNotes from "@/hooks/use-notes";
import { toast } from "sonner";
import { teacherNavItems } from '@/lib/nav-config';

const TeacherNotes = () => {
  const { notes, addNote, removeNote } = useNotes();
  const [searchTerm, setSearchTerm] = useState("");
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  // Mock teacher context (normally would come from auth)
  const teacherName = "Dr. Rajesh Iyer";
  const teacherSubjects = ["Mathematics", "Physics"];
  const teacherClasses = ["Class 10", "Class 12"];

  const [newNote, setNewNote] = useState({
    title: "",
    description: "",
    class: "",
    batch: "",
    subject: "",
    fileName: "",
    isSlowLearnerOnly: false,
  });

  const { students } = useStudents();
  const slowLearnersInClass = students.filter(
    (s) => s.class === newNote.class && s.category === "slow_learner",
  );

  const handleUpload = () => {
    if (
      !newNote.title ||
      !newNote.class ||
      !newNote.subject ||
      !newNote.fileName
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    addNote({
      ...newNote,
      fileUrl: "#", // Mock URL
      uploadedBy: teacherName,
    });

    setIsUploadDialogOpen(false);
    setNewNote({
      title: "",
      description: "",
      class: "",
      batch: "",
      subject: "",
      fileName: "",
      isSlowLearnerOnly: false,
    });
    toast.success("Study material uploaded successfully");
  };

  // Teachers only see their own uploads or all relevant uploads?
  // Let's show all relevant, but only allow deleting their own.
  const filteredNotes = notes.filter(
    (n) =>
      (n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.subject.toLowerCase().includes(searchTerm.toLowerCase())) &&
      teacherClasses.includes(n.class),
  );

  return (
    <DashboardLayout title="Study Materials & Notes" navItems={teacherNavItems} userName={teacherName} userRole="teacher">
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

        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl">
              <Plus className="h-4 w-4 mr-2" /> Upload New Note
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Upload Study Material</DialogTitle>
              <DialogDescription>
                Share notes or assignments with your assigned classes.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g. Algebraic Expressions Handout"
                  value={newNote.title}
                  onChange={(e) =>
                    setNewNote({ ...newNote, title: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Class *</Label>
                  <Select
                    value={newNote.class}
                    onValueChange={(val) =>
                      setNewNote({ ...newNote, class: val })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      {teacherClasses.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Batch *</Label>
                  <Select
                    value={newNote.batch}
                    onValueChange={(val) =>
                      setNewNote({ ...newNote, batch: val })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select batch" />
                    </SelectTrigger>
                    <SelectContent>
                      {batches.map((b) => (
                        <SelectItem key={b} value={b}>
                          {b}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Subject *</Label>
                <Select
                  value={newNote.subject}
                  onValueChange={(val) =>
                    setNewNote({ ...newNote, subject: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {teacherSubjects.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2 py-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="slowLearnerOnly"
                    checked={newNote.isSlowLearnerOnly}
                    onChange={(e) =>
                      setNewNote({
                        ...newNote,
                        isSlowLearnerOnly: e.target.checked,
                      })
                    }
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="slowLearnerOnly" className="cursor-pointer">
                    Target Slow Learners Only
                  </Label>
                </div>
              </div>

              {newNote.isSlowLearnerOnly && newNote.class && (
                <div className="bg-muted/50 p-3 rounded-lg space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Slow Learners in {newNote.class}:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {slowLearnersInClass.length > 0 ? (
                      slowLearnersInClass.map((s) => (
                        <Badge key={s.id} variant="secondary" className="text-[10px]">
                          {s.name}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-xs text-muted-foreground italic">
                        No slow learners found in this class.
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="file">File Name (Mock) *</Label>
                <Input
                  id="file"
                  placeholder="e.g. math_notes_chap1.pdf"
                  value={newNote.fileName}
                  onChange={(e) =>
                    setNewNote({ ...newNote, fileName: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsUploadDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleUpload}>Post Study Material</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Document</TableHead>
              <TableHead>Class & Batch</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Uploaded</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredNotes.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-12 text-muted-foreground"
                >
                  <FileText className="h-10 w-10 mx-auto mb-4 opacity-10" />
                  No study materials available for your classes.
                </TableCell>
              </TableRow>
            ) : (
              filteredNotes.map((note) => (
                <TableRow key={note.id}>
                  <TableCell>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-slate-800">{note.title}</p>
                        {note.isSlowLearnerOnly && (
                          <Badge variant="destructive" className="text-[8px] h-4 py-0 uppercase">
                            Slow Learner
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {note.fileName}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm font-medium">{note.class}</p>
                    <p className="text-xs text-muted-foreground">
                      {note.batch}
                    </p>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs font-bold uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-md">
                      {note.subject}
                    </span>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">{note.date}</p>
                    <p className="text-[10px] text-muted-foreground">
                      By {note.uploadedBy}
                    </p>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <Download className="h-4 w-4" />
                      </Button>
                      {note.uploadedBy === teacherName && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-red-500 hover:bg-red-50"
                          onClick={() => removeNote(note.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
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

export default TeacherNotes;
