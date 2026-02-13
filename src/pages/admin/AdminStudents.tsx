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
import useStudents from "@/hooks/use-students";
import { classes as mockClasses, Student } from "@/lib/mock-data";
import {
  UserPlus,
  Search,
  Filter,
  Trash2,
  Edit,
  IndianRupee,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

const AdminStudents = () => {
  const { students, add, remove, update } = useStudents();
  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [registerFilter, setRegisterFilter] = useState("");
  const [offlinePaymentOpen, setOfflinePaymentOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [paymentForm, setPaymentForm] = useState({
    mode: "Cash",
    type: "full" as "full" | "installment",
    amount: "",
    date: new Date().toISOString().split("T")[0],
  });

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    class: "",
    batch: "Batch A - Morning",
    registerNumber: "",
    rollNumber: "",
  });

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.registerNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = classFilter === "all" || s.class === classFilter;
    return matchesSearch && matchesClass;
  });

  const handleAddStudent = () => {
    if (!formData.name || !formData.class || !formData.registerNumber) {
      toast.error("Name, Class, and Register Number are required");
      return;
    }

    add({
      ...formData,
      category: "normal",
      paymentStatus: "pending",
      password: "student123",
      totalFee: 30000, // Default for mock
    });

    setIsAddDialogOpen(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
      class: "",
      batch: "Batch A - Morning",
      registerNumber: "",
      rollNumber: "",
    });
    toast.success("Student added successfully!");
  };

  const handleRecordPayment = (student: Student) => {
    setSelectedStudent(student);
    setPaymentForm({
      ...paymentForm,
      amount: student.totalFee ? (student.totalFee / 2).toString() : "15000",
    });
    setOfflinePaymentOpen(true);
  };

  const saveOfflinePayment = () => {
    if (!selectedStudent || !paymentForm.amount) return;

    const amount = parseFloat(paymentForm.amount);
    const newRecord = {
      id: Date.now().toString(),
      date: paymentForm.date,
      amount: amount,
      mode: paymentForm.mode,
      type: paymentForm.type,
      receiptId: `REC-${Math.floor(Math.random() * 1000000)}`,
    };

    const history = [...(selectedStudent.paymentHistory || []), newRecord];
    const totalPaid = history.reduce((sum, r) => sum + r.amount, 0);
    const status =
      totalPaid >= (selectedStudent.totalFee || 0) ? "paid" : "partial";

    update(selectedStudent.id, {
      paymentHistory: history,
      paymentStatus: status,
    });

    toast.success("Payment recorded successfully!");
    setOfflinePaymentOpen(false);
  };

  return (
    <DashboardLayout
      title="Student Management"
      navItems={adminNavItems}
      userName="Admin"
      userRole="admin"
    >
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or register number..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={classFilter} onValueChange={setClassFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              {mockClasses.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <UserPlus className="h-4 w-4 mr-2" /> Add Student
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Roll No</TableHead>
              <TableHead>Reg No</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Batch</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground"
                >
                  No students found.
                </TableCell>
              </TableRow>
            ) : (
              filteredStudents.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-mono text-xs">
                    {s.rollNumber}
                  </TableCell>
                  <TableCell className="font-mono text-xs font-bold text-primary">
                    {s.registerNumber}
                  </TableCell>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell>{s.class}</TableCell>
                  <TableCell className="text-xs">{s.batch}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        s.paymentStatus === "paid" ? "default" : "secondary"
                      }
                      className="text-[10px] uppercase"
                    >
                      {s.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-primary"
                        title="Record Payment"
                        onClick={() => handleRecordPayment(s)}
                      >
                        <IndianRupee className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-destructive"
                        onClick={() => remove(s.id)}
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
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="col-span-2 space-y-2">
              <Label>Full Name</Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Class</Label>
              <Select
                value={formData.class}
                onValueChange={(val) =>
                  setFormData({ ...formData, class: val })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Class" />
                </SelectTrigger>
                <SelectContent>
                  {mockClasses.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Register Number</Label>
              <Input
                value={formData.registerNumber}
                onChange={(e) =>
                  setFormData({ ...formData, registerNumber: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddStudent}>Add Student</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Offline Payment Modal */}
      <Dialog open={offlinePaymentOpen} onOpenChange={setOfflinePaymentOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Record Offline Payment</DialogTitle>
            <DialogDescription>
              Record a manual payment for {selectedStudent?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Payment Mode</Label>
              <Select
                value={paymentForm.mode}
                onValueChange={(v) =>
                  setPaymentForm({ ...paymentForm, mode: v })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Cheque">Cheque</SelectItem>
                  <SelectItem value="UPI">UPI / Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Payment Type</Label>
              <Select
                value={paymentForm.type}
                onValueChange={(v) =>
                  setPaymentForm({
                    ...paymentForm,
                    type: v as "full" | "installment",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full">Full Payment</SelectItem>
                  <SelectItem value="installment">Installment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Amount (₹)</Label>
                <Input
                  type="number"
                  value={paymentForm.amount}
                  onChange={(e) =>
                    setPaymentForm({ ...paymentForm, amount: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input
                  type="date"
                  value={paymentForm.date}
                  onChange={(e) =>
                    setPaymentForm({ ...paymentForm, date: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOfflinePaymentOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={saveOfflinePayment}>Save Payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AdminStudents;
