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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import useTeachers from "@/hooks/use-teachers";
import {
  classes as mockClasses,
  subjects as mockSubjects,
} from "@/lib/mock-data";
import { UserPlus, Trash2, Edit, Key, Mail } from "lucide-react";
import { toast } from "sonner";

const AdminTeachers = () => {
  const { teachers, add, remove, update } = useTeachers();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    assignedClasses: [] as string[],
    assignedSubjects: [] as string[],
  });

  const handleAddTeacher = () => {
    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Name, Email, and Password are required");
      return;
    }

    add({
      ...formData,
      assignedBatches: ["Batch A - Morning"], // Default
    });

    setIsAddDialogOpen(false);
    setFormData({
      name: "",
      email: "",
      password: "",
      assignedClasses: [],
      assignedSubjects: [],
    });
    toast.success("Teacher account created successfully!");
  };

  const toggleClass = (cls: string) => {
    setFormData((prev) => ({
      ...prev,
      assignedClasses: prev.assignedClasses.includes(cls)
        ? prev.assignedClasses.filter((c) => c !== cls)
        : [...prev.assignedClasses, cls],
    }));
  };

  return (
    <DashboardLayout
      title="Teacher Management"
      navItems={adminNavItems}
      userName="Admin"
      userRole="admin"
    >
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-muted-foreground">
          Manage faculty accounts and their login credentials.
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <UserPlus className="h-4 w-4 mr-2" /> Add Teacher
        </Button>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Teacher Info</TableHead>
              <TableHead>Assigned Classes</TableHead>
              <TableHead>Subjects</TableHead>
              <TableHead>Login ID</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teachers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-muted-foreground"
                >
                  No teachers found.
                </TableCell>
              </TableRow>
            ) : (
              teachers.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>
                    <div className="font-medium">{t.name}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Mail className="h-3 w-3" /> {t.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {t.assignedClasses.map((c) => (
                        <Badge
                          key={c}
                          variant="outline"
                          className="text-[10px]"
                        >
                          {c}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs text-muted-foreground">
                      {t.assignedSubjects.join(", ")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-[10px] bg-muted px-1.5 py-0.5 rounded flex items-center gap-1 w-fit">
                      <Key className="h-3 w-3" /> {t.email}
                    </code>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-destructive"
                        onClick={() => remove(t.id)}
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

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Teacher</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-6 py-4">
            <div className="col-span-2 space-y-4 border-b pb-4 border-border">
              <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Account Info
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email (Login ID)</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Initial Password</Label>
                  <Input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="col-span-2 space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Assignments
              </h4>
              <div className="space-y-3">
                <Label>Assigned Classes</Label>
                <div className="grid grid-cols-3 gap-2">
                  {mockClasses.map((c) => (
                    <div key={c} className="flex items-center space-x-2">
                      <Checkbox
                        id={`class-${c}`}
                        checked={formData.assignedClasses.includes(c)}
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTeacher}>Generate Account</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AdminTeachers;
