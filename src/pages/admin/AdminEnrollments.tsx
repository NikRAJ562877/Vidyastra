import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Student, Enrollment, getPaymentStatus } from "@/lib/mock-data";
import { toast } from "sonner";
import {
  UserPlus,
  Trash2,
  CheckCircle,
  CreditCard,
  ExternalLink,
} from "lucide-react";

const AdminEnrollments = () => {
  const navigate = useNavigate();
  const { enrollments, remove, updateStatus } = useEnrollments();
  const { add: addStudent } = useStudents();
  const [selectedEnrollment, setSelectedEnrollment] =
    useState<Enrollment | null>(null);
  const [registerNumber, setRegisterNumber] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  const handleEnroll = (enrollment: Enrollment) => {
    setSelectedEnrollment(enrollment);
    setRegisterNumber("");
    setConfirmOpen(true);
  };

  const handleViewPayment = (enrollment: Enrollment) => {
    setSelectedEnrollment(enrollment);
    setPaymentModalOpen(true);
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
      paymentStatus: getPaymentStatus(selectedEnrollment.amountPaid || 0, selectedEnrollment.totalFee || 0),
      password: "student123", // Default password
      totalFee: selectedEnrollment.totalFee || 0,
      paymentHistory: selectedEnrollment.amountPaid ? [{
        id: Date.now().toString(),
        date: selectedEnrollment.date,
        amount: selectedEnrollment.amountPaid,
        mode: selectedEnrollment.paymentMode || 'online',
        type: selectedEnrollment.paymentType || 'full',
        receiptId: `REC-${Math.floor(Math.random() * 1000000)}`,
        transactionId: selectedEnrollment.transactionId
      }] : []
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
              <TableHead>Mode</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {enrollments.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
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
                  <TableCell className="capitalize">{enr.mode}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 justify-start gap-1 p-0 text-xs hover:bg-transparent"
                        onClick={() => handleViewPayment(enr)}
                      >
                        <CreditCard className="h-3 w-3" />
                        {enr.paymentType === "installment" ? "Installment" : "Full"}
                      </Button>
                      <span className="text-[10px] text-muted-foreground">
                        Paid: ₹{enr.amountPaid?.toLocaleString() || 0}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`cursor-pointer capitalize ${getPaymentStatus(enr.amountPaid || 0, enr.totalFee || 0) === "paid"
                          ? "text-success border-success bg-success/10"
                          : getPaymentStatus(enr.amountPaid || 0, enr.totalFee || 0) === "partial"
                            ? "text-warning border-warning bg-warning/10"
                            : "text-muted-foreground border-border"
                        }`}
                      onClick={() => handleViewPayment(enr)}
                    >
                      {getPaymentStatus(enr.amountPaid || 0, enr.totalFee || 0)}
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

      {/* Payment Details Modal */}
      <Dialog open={paymentModalOpen} onOpenChange={setPaymentModalOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Payment Information</DialogTitle>
            <DialogDescription>
              Detailed payment status for {selectedEnrollment?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-muted-foreground">Payment Mode</p>
                <p className="font-bold border-b pb-1 uppercase">
                  {selectedEnrollment?.mode}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Plan Type</p>
                <p className="font-bold border-b pb-1 capitalize">
                  {selectedEnrollment?.paymentType || "Full Payment"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Amount Paid</p>
                <p className="font-bold border-b pb-1">
                  ₹{selectedEnrollment?.amountPaid?.toLocaleString() || 0}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Total Fee</p>
                <p className="font-bold border-b pb-1">
                  ₹{selectedEnrollment?.totalFee?.toLocaleString() || 0}
                </p>
              </div>
              {selectedEnrollment?.transactionId && (
                <div className="space-y-1 col-span-2">
                  <p className="text-muted-foreground">Transaction ID</p>
                  <p className="font-mono text-xs bg-muted p-1 rounded capitalize">
                    {selectedEnrollment?.transactionId}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm">Current Status</span>
              <Badge
                variant={
                  selectedEnrollment?.paymentStatus === "paid"
                    ? "default"
                    : "secondary"
                }
                className={
                  selectedEnrollment?.paymentStatus === "paid"
                    ? "bg-success"
                    : "bg-warning"
                }
              >
                {selectedEnrollment?.paymentStatus?.toUpperCase() || "PENDING"}
              </Badge>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPaymentModalOpen(false)}
            >
              Close
            </Button>
            <Button
              onClick={() =>
                navigate(`/receipt/latest`, {
                  state: { enrollment: selectedEnrollment },
                })
              }
            >
              <ExternalLink className="h-4 w-4 mr-2" /> View Receipt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AdminEnrollments;
