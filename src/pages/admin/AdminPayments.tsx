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
import { badgeVariants } from "@/components/ui/badge";
import {
  IndianRupee,
  Search,
  Filter,
  Download,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  User,
  ExternalLink,
  Plus,
  Clock,
  PlayCircle, // Added for WhatsApp reminder
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import usePayments, { Transaction } from "@/hooks/use-payments";
import useStudents from "@/hooks/use-students";
import { Student } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const AdminPayments = () => {
  const navigate = useNavigate();
  const { transactions, stats } = usePayments();
  const { students, update: updateStudent } = useStudents();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMode, setFilterMode] = useState("all");

  const [recordModalOpen, setRecordModalOpen] = useState(false);
  const [pendingDuesOpen, setPendingDuesOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [paymentForm, setPaymentForm] = useState({
    mode: "Cash",
    type: "full" as "full" | "installment",
    amount: "",
    date: new Date().toISOString().split("T")[0],
  });

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [installmentPercent, setInstallmentPercent] = useState(() => {
    return localStorage.getItem("installmentMetrics") || "50";
  });

  const handleSaveSettings = () => {
    localStorage.setItem("installmentMetrics", installmentPercent);
    toast.success("Payment settings saved");
    setSettingsOpen(false);
  };

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.receiptId?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMode =
      filterMode === "all" || t.mode.toLowerCase() === filterMode.toLowerCase();

    return matchesSearch && matchesMode;
  });

  const handleRecordPayment = () => {
    const student = students.find((s) => s.id === selectedStudentId);
    if (!student || !paymentForm.amount) {
      toast.error("Please select a student and enter amount");
      return;
    }

    const amount = parseFloat(paymentForm.amount);
    const newRecord = {
      id: `PAY-${Date.now()}`,
      date: paymentForm.date,
      amount: amount,
      mode: paymentForm.mode,
      type: paymentForm.type,
      receiptId: `RCP-${Math.floor(Math.random() * 1000000)}`,
    };

    updateStudent(student.id, {
      paymentStatus:
        (student.totalFee || 0) <=
        newRecord.amount +
          (student.paymentHistory?.reduce((s, p) => s + p.amount, 0) || 0)
          ? "paid"
          : "partial",
      paymentHistory: [...(student.paymentHistory || []), newRecord],
    });

    toast.success("Payment recorded successfully!");
    setRecordModalOpen(false);
    setSelectedStudentId("");
    setPaymentForm({
      mode: "Cash",
      type: "full",
      amount: "",
      date: new Date().toISOString().split("T")[0],
    });
  };

  return (
    <DashboardLayout
      title="Payment Management"
      navItems={adminNavItems}
      userName="Admin"
      userRole="admin"
    >
      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Payments</h2>
            <p className="text-muted-foreground">
              Manage student fee payments and transactions.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" /> Export JSON
            </Button>
            <Button onClick={() => setRecordModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" /> Record Payment
            </Button>
            <Button
              variant="destructive"
              onClick={() => setPendingDuesOpen(true)}
            >
              <Clock className="h-4 w-4 mr-2" /> Pending Dues
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {/* ... existing cards ... */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{stats.totalCollected.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Total collected fees
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Payments
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{stats.totalPending.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {
                  students.filter(
                    (s) =>
                      s.paymentStatus === "pending" ||
                      s.paymentStatus === "partial",
                  ).length
                }{" "}
                students with pending dues
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Transactions
              </CardTitle>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.transactionCount}</div>
              <p className="text-xs text-muted-foreground">
                Total transactions recorded
              </p>
            </CardContent>
          </Card>
        </div>

        {/* ... Search and Filter ... */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={filterMode} onValueChange={setFilterMode}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Payment Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Modes</SelectItem>
              <SelectItem value="online">Online</SelectItem>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="upi">UPI</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Receipt ID</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">
                      {transaction.receiptId}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {transaction.studentName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {transaction.courseName}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      ₹{transaction.amount.toLocaleString()}
                      {transaction.type === "installment" && (
                        <span className="text-xs text-muted-foreground block">
                          (Installment)
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {transaction.mode}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={badgeVariants({
                          variant:
                            transaction.status === "paid"
                              ? "default"
                              : "secondary",
                        })}
                      >
                        {transaction.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Payment Settings</DialogTitle>
            <DialogDescription>
              Configure installment payment rules.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label>First Installment Percentage (%)</Label>
            <Input
              type="number"
              min="10"
              max="100"
              value={installmentPercent}
              onChange={(e) => setInstallmentPercent(e.target.value)}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-2">
              The remaining {100 - Number(installmentPercent)}% will be
              collected in the second installment.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSettingsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveSettings}>Save Settings</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Record Payment Dialog */}
      <Dialog open={recordModalOpen} onOpenChange={setRecordModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Record Manual Payment</DialogTitle>
            <DialogDescription>
              Select a student and enter the payment details received offline.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Select Student</Label>
              <Select
                value={selectedStudentId}
                onValueChange={setSelectedStudentId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Search student name..." />
                </SelectTrigger>
                <SelectContent>
                  {students.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name} ({s.class})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Amount (₹)</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={paymentForm.amount}
                  onChange={(e) =>
                    setPaymentForm({ ...paymentForm, amount: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Payment Date</Label>
                <Input
                  type="date"
                  value={paymentForm.date}
                  onChange={(e) =>
                    setPaymentForm({ ...paymentForm, date: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Payment Mode</Label>
                <Select
                  value={paymentForm.mode}
                  onValueChange={(val) =>
                    setPaymentForm({ ...paymentForm, mode: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="UPI">UPI / GPay</SelectItem>
                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                    <SelectItem value="Cheque">Cheque</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Payment Type</Label>
                <Select
                  value={paymentForm.type}
                  onValueChange={(val: any) =>
                    setPaymentForm({ ...paymentForm, type: val })
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
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setRecordModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRecordPayment}>Record Payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Pending Dues Dialog */}
      <Dialog open={pendingDuesOpen} onOpenChange={setPendingDuesOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Pending Dues</DialogTitle>
            <DialogDescription>
              Students with outstanding fee payments.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Total Fee</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.filter(
                  (s) =>
                    s.paymentStatus === "pending" ||
                    s.paymentStatus === "partial",
                ).length > 0 ? (
                  students
                    .filter(
                      (s) =>
                        s.paymentStatus === "pending" ||
                        s.paymentStatus === "partial",
                    )
                    .map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">
                          {student.name}
                        </TableCell>
                        <TableCell>{student.class}</TableCell>
                        <TableCell>
                          ₹{student.totalFee?.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <span
                            className={badgeVariants({
                              variant:
                                student.paymentStatus === "pending"
                                  ? "destructive"
                                  : "warning",
                            })}
                          >
                            {student.paymentStatus}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 border-green-200 hover:bg-green-50"
                            onClick={() =>
                              toast.success(
                                `WhatsApp reminder sent into ${student.name}'s registered number`,
                              )
                            }
                          >
                            <PlayCircle className="h-4 w-4 mr-2" /> Remind
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-4 text-muted-foreground"
                    >
                      No pending dues found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setPendingDuesOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AdminPayments;
