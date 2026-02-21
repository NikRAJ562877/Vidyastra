import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
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
} from "@/components/ui/dialog";
import { Trash2, Edit2, Plus, BookOpen } from "lucide-react";
import useCourses from "@/hooks/use-courses";
import { adminNavItems } from "@/lib/nav-config";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { classes, batches, subjects, Course } from "@/lib/mock-data";

const AdminCourses = () => {
  const { courses, add, update, remove } = useCourses();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState<Omit<Course, "id">>({
    name: "",
    class: "",
    batch: "",
    subject: [],
    duration: "",
    fee: 0,
    minFirstInstallment: 0,
    description: "",
    showOnLandingPage: false,
  });

  const handleOpenDialog = (course: Course | null = null) => {
    if (course) {
      setEditingCourse(course);
      setFormData({
        name: course.name,
        class: course.class,
        batch: course.batch,
        subject: course.subject,
        duration: course.duration,
        fee: course.fee,
        minFirstInstallment: course.minFirstInstallment || 0,
        description: course.description,
        showOnLandingPage: course.showOnLandingPage || false,
      });
    } else {
      setEditingCourse(null);
      setFormData({
        name: "",
        class: "",
        batch: "",
        subject: [],
        duration: "",
        fee: 0,
        minFirstInstallment: 0,
        description: "",
        showOnLandingPage: false,
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.class || !formData.batch || formData.subject.length === 0) {
      toast.error("Please fill all required fields");
      return;
    }

    if (editingCourse) {
      update(editingCourse.id, formData);
      toast.success("Course updated successfully");
    } else {
      add(formData);
      toast.success("Course created successfully");
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this course?")) {
      remove(id);
      toast.success("Course deleted successfully");
    }
  };

  return (
    <DashboardLayout
      title="Manage Courses"
      navItems={adminNavItems}
      userName="Admin"
      userRole="admin"
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-heading font-bold">All Courses</h2>
          <p className="text-sm text-muted-foreground">
            Create and manage courses for enrollment
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="gradient-primary">
          <Plus className="h-4 w-4 mr-2" /> Add Course
        </Button>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Course Name</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Batch</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Fee</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.length > 0 ? (
              courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{course.class}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{course.batch}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {Array.isArray(course.subject) && course.subject.map((s) => (
                        <Badge key={s} variant="outline" className="bg-primary/5 text-[10px]">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>₹{course.fee.toLocaleString()}</TableCell>
                  <TableCell>{course.duration}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDialog(course)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(course.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground"
                >
                  No courses found. Create your first course!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingCourse ? "Edit Course" : "Create New Course"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Course Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g. JEE Advanced Physics"
                required
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="class">Class *</Label>
                <Select
                  value={formData.class}
                  onValueChange={(v) => setFormData({ ...formData, class: v })}
                >
                  <SelectTrigger id="class">
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
                <Label htmlFor="batch">Batch *</Label>
                <Select
                  value={formData.batch}
                  onValueChange={(v) => setFormData({ ...formData, batch: v })}
                >
                  <SelectTrigger id="batch">
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
              <Label>Subjects *</Label>
              <div className="grid grid-cols-3 gap-2 border rounded-md p-3 max-h-[150px] overflow-y-auto">
                {subjects.map((s) => (
                  <div key={s} className="flex items-center space-x-2">
                    <Checkbox
                      id={`subject-${s}`}
                      checked={formData.subject.includes(s)}
                      onCheckedChange={(checked) => {
                        const newSubjects = checked === true
                          ? [...formData.subject, s]
                          : formData.subject.filter((sub) => sub !== s);
                        setFormData({ ...formData, subject: newSubjects });
                      }}
                    />
                    <Label
                      htmlFor={`subject-${s}`}
                      className="text-xs font-normal cursor-pointer"
                    >
                      {s}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="fee">Fee (₹) *</Label>
                <Input
                  id="fee"
                  type="number"
                  value={formData.fee}
                  onChange={(e) =>
                    setFormData({ ...formData, fee: Number(e.target.value) })
                  }
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="duration">Duration *</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                  placeholder="e.g. 6 Months"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="minFirstInstallment">
                  First Installment (₹)
                </Label>
                <Input
                  id="minFirstInstallment"
                  type="number"
                  value={formData.minFirstInstallment || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      minFirstInstallment: Number(e.target.value),
                    })
                  }
                  placeholder="Min. pay for installment"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Course details..."
              />
            </div>
            <div className="flex items-center space-x-2 py-2">
              <Checkbox
                id="showOnLandingPage"
                checked={formData.showOnLandingPage}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    showOnLandingPage: checked === true,
                  })
                }
              />
              <Label
                htmlFor="showOnLandingPage"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                Show on landing page popularity section
              </Label>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="gradient-primary">
                {editingCourse ? "Update Course" : "Create Course"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AdminCourses;
