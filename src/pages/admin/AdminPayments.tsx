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
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [paymentForm, setPaymentForm] = useState({
    mode: "Cash",
    type: "full" as "full" | "installment",
    amount: "",
    date: new Date().toISOString().split("T")[0],
  });

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
      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-primary text-primary-foreground border-none shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium uppercase opacity-80 flex justify-between">
              Total Collected
              <IndianRupee className="h-4 w-4" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{stats.totalCollected.toLocaleString()}
            </div>
            <p className="text-[10px] opacity-70 mt-1">
              From {stats.transactionCount} transactions
            </p>
          </CardContent>
        </Card>

        <Card className="bg-success text-white border-none shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium uppercase opacity-80 flex justify-between">
              Expected Revenue
              <ArrowUpRight className="h-4 w-4" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{stats.totalExpected.toLocaleString()}
            </div>
            <div className="w-full bg-white/20 h-1 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-white h-full"
                style={{
                  width: `${(stats.totalCollected / stats.totalExpected) * 100}%`,
                }}
              ></div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-amber-500 text-white border-none shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium uppercase opacity-80 flex justify-between">
              Pending Dues
              <ArrowDownLeft className="h-4 w-4" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{stats.totalPending.toLocaleString()}
            </div>
            <p className="text-[10px] opacity-90 mt-1">Active payment plans</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 text-white border-none shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium uppercase opacity-80 flex justify-between">
              Transactions
              <Calendar className="h-4 w-4" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.transactionCount}</div>
            <p className="text-[10px] opacity-70 mt-1">This academic year</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by student, course or receipt..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              setFilterMode(
                filterMode === "online"
                  ? "offline"
                  : filterMode === "offline"
                    ? "all"
                    : "online",
              )
            }
          >
            <Filter
              className={cn("h-4 w-4", filterMode !== "all" && "text-primary")}
            />
          </Button>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" /> Export JSON
          </Button>
          <Button onClick={() => setRecordModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" /> Record Payment
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Student</TableHead>
              <TableHead>Course/Class</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-12 text-muted-foreground"
                >
                  No payment records found matching your filters.
                </TableCell>
              </TableRow>
            ) : (
              filteredTransactions.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="text-xs">
                    {new Date(t.date).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <User className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <span className="font-medium">{t.studentName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">{t.courseName}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-bold uppercase text-muted-foreground">
                        {t.mode}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {t.type === "full" ? "Full Payment" : "Installment"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-bold">
                    ₹{t.amount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium",
                        t.status === "paid"
                          ? "bg-green-100 text-green-700"
                          : t.status === "partial"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-amber-100 text-amber-700",
                      )}
                    >
                      {t.status.toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        navigate(`/receipt/${t.id}`, {
                          state: {
                            enrollment: {
                              name: t.studentName,
                              class: t.courseName,
                              amountPaid: t.amount,
                              date: t.date,
                              transactionId: t.receiptId,
                              paymentType: t.type,
                            },
                          },
                        })
                      }
                    >
                      <ExternalLink className="h-4 w-4 mr-2" /> Receipt
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Record Payment Modal */}
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
    </DashboardLayout>
  );
};

export default AdminPayments;
