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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useEnrollments from "@/hooks/use-enrollments";
import useStudents from "@/hooks/use-students";
import { Student, Enrollment } from "@/lib/mock-data";
import { toast } from "sonner";
import { UserPlus, Trash2, CheckCircle } from "lucide-react";

const AdminEnrollments = () => {
  const { enrollments, remove, updateStatus } = useEnrollments();
  const { add: addStudent } = useStudents();
  const [selectedEnrollment, setSelectedEnrollment] =
    useState<Enrollment | null>(null);
  const [registerNumber, setRegisterNumber] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleEnroll = (enrollment: Enrollment) => {
    setSelectedEnrollment(enrollment);
    setRegisterNumber("");
    setConfirmOpen(true);
  };

  const processEnrollment = () => {
    if (!registerNumber.trim()) {
      toast.error("Please enter a register number");
      return;
    }

    // Add to students
    addStudent({
      registerNumber,
      rollNumber: "00", // Default roll number
      name: selectedEnrollment.name,
      email: selectedEnrollment.email,
      phone: selectedEnrollment.phone,
      class: selectedEnrollment.class,
      batch: selectedEnrollment.batch,
      category: "normal",
      paymentStatus: "pending",
      password: "student123", // Default password
    });

    // Remove from enrollments
    remove(selectedEnrollment.id);

    setConfirmOpen(false);
    toast.success(`Student ${selectedEnrollment.name} enrolled successfully!`);
  };

  return (
    <DashboardLayout
      title="Enrollment Management"
      navItems={adminNavItems}
      userName="Admin"
      userRole="admin"
    >
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Class/Batch</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {enrollments.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground"
                >
                  No pending enrollments found.
                </TableCell>
              </TableRow>
            ) : (
              enrollments.map((enr) => (
                <TableRow key={enr.id}>
                  <TableCell className="font-medium">{enr.name}</TableCell>
                  <TableCell>
                    <div className="text-xs">
                      <p>{enr.email}</p>
                      <p className="text-muted-foreground">{enr.phone}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs">
                      <p>{enr.class}</p>
                      <p className="text-muted-foreground">{enr.batch}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">{enr.date}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        enr.status === "confirmed" ? "default" : "secondary"
                      }
                    >
                      {enr.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEnroll(enr)}
                      >
                        <UserPlus className="h-4 w-4 mr-2" /> Enroll
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => remove(enr.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Enrollment</DialogTitle>
            <DialogDescription>
              Assign a register number to {selectedEnrollment?.name} to complete
              enrollment.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="regNo">Register Number</Label>
              <Input
                id="regNo"
                placeholder="e.g. REG123"
                value={registerNumber}
                onChange={(e) => setRegisterNumber(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button onClick={processEnrollment}>Confirm & Enroll</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AdminEnrollments;
