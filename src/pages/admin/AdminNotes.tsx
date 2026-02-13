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
import {
  FileText,
  Plus,
  Search,
  Trash2,
  Download,
  Upload,
  Filter,
} from "lucide-react";
import { classes, batches, subjects } from "@/lib/mock-data";
import useNotes from "@/hooks/use-notes";
import { toast } from "sonner";

const AdminNotes = () => {
  const { notes, addNote, removeNote } = useNotes();
  const [searchTerm, setSearchTerm] = useState("");
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  const [newNote, setNewNote] = useState({
    title: "",
    description: "",
    class: "",
    batch: "",
    subject: "",
    fileName: "",
  });

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
      uploadedBy: "Admin",
    });

    setIsUploadDialogOpen(false);
    setNewNote({
      title: "",
      description: "",
      class: "",
      batch: "",
      subject: "",
      fileName: "",
    });
    toast.success("Study material uploaded successfully");
  };

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.class.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <DashboardLayout
      title="Study Materials Management"
      navItems={adminNavItems}
      userName="Admin"
      userRole="admin"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title, subject or class..."
            className="pl-10 h-10 rounded-xl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl">
              <Plus className="h-4 w-4 mr-2" /> Upload Material
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Upload Study Material</DialogTitle>
              <DialogDescription>
                Add new notes, assignments or reference materials for students.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g. Chapter 1: Introduction to Calculus"
                  value={newNote.title}
                  onChange={(e) =>
                    setNewNote({ ...newNote, title: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Brief summary of the material..."
                  value={newNote.description}
                  onChange={(e) =>
                    setNewNote({ ...newNote, description: e.target.value })
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
                      {classes.map((c) => (
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
                    {subjects.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="file">File Name *</Label>
                <div className="flex gap-2">
                  <Input
                    id="file"
                    placeholder="e.g. calculus_notes.pdf"
                    value={newNote.fileName}
                    onChange={(e) =>
                      setNewNote({ ...newNote, fileName: e.target.value })
                    }
                    className="flex-1"
                  />
                  <Button variant="outline" size="icon" className="shrink-0">
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsUploadDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleUpload}>Upload Material</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[300px]">Material Details</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Target Group</TableHead>
              <TableHead>Uploaded By</TableHead>
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
                  <FileText className="h-10 w-10 mx-auto mb-4 opacity-20" />
                  No study materials found matching your search.
                </TableCell>
              </TableRow>
            ) : (
              filteredNotes.map((note) => (
                <TableRow
                  key={note.id}
                  className="group hover:bg-slate-50 transition-colors"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{note.title}</p>
                        <p className="text-xs text-muted-foreground truncate w-48">
                          {note.fileName} • {note.date}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                      {note.subject}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p className="font-medium">{note.class}</p>
                      <p className="text-xs text-muted-foreground">
                        {note.batch}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm font-medium">{note.uploadedBy}</p>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-primary"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => {
                          if (
                            confirm(
                              "Are you sure you want to delete this study material?",
                            )
                          ) {
                            removeNote(note.id);
                            toast.success("Material deleted successfully");
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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

export default AdminNotes;
