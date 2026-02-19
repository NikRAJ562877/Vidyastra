import { useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { students, payments, enrollments } from "@/lib/mock-data";
import { studentNavItems } from "@/lib/nav-config";
import {
  IndianRupee,
  CreditCard,
  History as HistoryIcon,
  Info,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const StudentPayments = () => {
  const { user } = useAuth();
  const student = students.find((s) => s.id === user.id);

  const studentPayments = useMemo(
    () => payments.filter((p) => p.studentId === user.id),
    [user.id],
  );

  const enrollment = useMemo(
    () =>
      enrollments.find(
        (e) => e.uniqueId === student?.uniqueId || e.phone === student?.phone,
      ),
    [student],
  );

  const stats = useMemo(() => {
    const totalPaid = studentPayments
      .filter((p) => p.status === "paid")
      .reduce((sum, p) => sum + p.amount, 0);
    const totalFee =
      student?.totalFee ||
      enrollment?.totalFee ||
      (studentPayments.length > 0 ? studentPayments[0].totalFee : 0);
    const balance = totalFee - totalPaid;
    const progress = totalFee > 0 ? (totalPaid / totalFee) * 100 : 0;

    return { totalFee, totalPaid, balance, progress };
  }, [studentPayments, student, enrollment]);

  if (!student)
    return (
      <div className="p-8 text-center text-muted-foreground">
        Student not found
      </div>
    );

  return (
    <DashboardLayout
      title="Payments & Fee Plan"
      navItems={studentNavItems}
      userName={user.name || "Student"}
      userRole="student"
    >
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Payment Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Plan Summary Card */}
          <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
            <div className="gradient-primary p-6 text-primary-foreground">
              <div className="flex justify-between items-start">
                <div>
                  <Badge
                    variant="secondary"
                    className="bg-white/20 text-white border-0 mb-2"
                  >
                    My Active Plan
                  </Badge>
                  <h2 className="text-3xl font-heading font-bold">
                    {student.class} - {student.batch}
                  </h2>
                  <p className="text-primary-foreground/70 mt-1">
                    Enrollment ID: {student.uniqueId}
                  </p>
                </div>
                <CreditCard className="h-10 w-10 opacity-20" />
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
                  Total Course Fee
                </p>
                <p className="text-2xl font-bold font-heading">
                  ₹{stats.totalFee.toLocaleString()}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
                  Amount Paid
                </p>
                <p className="text-2xl font-bold font-heading text-green-600">
                  ₹{stats.totalPaid.toLocaleString()}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
                  Remaining Balance
                </p>
                <p className="text-2xl font-bold font-heading text-primary">
                  ₹{stats.balance.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="px-6 pb-8">
              <div className="flex justify-between text-sm mb-2 font-bold">
                <span>Fee Clearance Progress</span>
                <span>{stats.progress.toFixed(0)}%</span>
              </div>
              <Progress value={stats.progress} className="h-3" />
            </div>
          </div>

          {/* Payment History Table */}
          <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="font-heading font-bold flex items-center gap-2">
                <HistoryIcon className="h-5 w-5 text-primary" /> Installment
                History
              </h3>
              <Button variant="outline" size="sm">
                Download All Receipts
              </Button>
            </div>
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="py-4">Installment</TableHead>
                  <TableHead>Month</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentPayments.length > 0 ? (
                  studentPayments.map((p) => (
                    <TableRow
                      key={p.id}
                      className="hover:bg-muted/20 transition-colors"
                    >
                      <TableCell className="font-bold">
                        #{p.installment}
                      </TableCell>
                      <TableCell className="font-medium">{p.month}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {p.dueDate}
                      </TableCell>
                      <TableCell className="font-bold">
                        ₹{p.amount.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          className={cn(
                            "px-3 py-1",
                            p.status === "paid"
                              ? "bg-green-500/10 text-green-600 border-green-200"
                              : "bg-orange-500/10 text-orange-600 border-orange-200",
                          )}
                        >
                          {p.status === "paid" ? "Paid" : "Pending"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-12 text-muted-foreground italic"
                    >
                      No payment records found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-6">
          <div className="bg-card rounded-2xl border border-border shadow-card p-6">
            <h3 className="font-heading font-bold mb-6 flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-primary" /> Fast Payment
            </h3>

            {stats.balance > 0 ? (
              <div className="space-y-4">
                <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                  <p className="text-sm text-primary font-bold">
                    Next Due Amount
                  </p>
                  <p className="text-3xl font-heading font-black mt-1">
                    ₹
                    {studentPayments
                      .find((p) => p.status !== "paid")
                      ?.amount.toLocaleString() ||
                      stats.balance.toLocaleString()}
                  </p>
                </div>
                <Button className="w-full h-12 rounded-xl gradient-primary shadow-lg shadow-primary/20">
                  Pay Installment Now
                </Button>
                <p className="text-[10px] text-center text-muted-foreground">
                  Secure payment gateway powered by Razorpay
                </p>
              </div>
            ) : (
              <div className="text-center py-6">
                <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
                <h4 className="font-bold">All Fees Cleared!</h4>
                <p className="text-sm text-muted-foreground">
                  You have successfully paid all installments.
                </p>
              </div>
            )}
          </div>

          <div className="bg-card rounded-2xl border border-border shadow-card p-6">
            <h3 className="font-heading font-bold mb-4 flex items-center gap-2">
              <Info className="h-4 w-4 text-primary" /> Payment Policy
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <li className="flex gap-2">
                <div className="min-w-[4px] h-4 bg-primary/30 rounded-full mt-1" />
                <span>
                  Fees once paid are non-refundable and non-transferable.
                </span>
              </li>
              <li className="flex gap-2">
                <div className="min-w-[4px] h-4 bg-primary/30 rounded-full mt-1" />
                <span>Late payment will attract a penalty of ₹50 per day.</span>
              </li>
              <li className="flex gap-2">
                <div className="min-w-[4px] h-4 bg-primary/30 rounded-full mt-1" />
                <span>
                  GST of 18% is included in the mentioned fee structure.
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-secondary/10 rounded-2xl p-6 border border-secondary/20 flex items-center gap-4">
            <AlertCircle className="h-8 w-8 text-secondary" />
            <div>
              <p className="text-sm font-bold text-secondary">Need Help?</p>
              <p className="text-xs text-muted-foreground">
                Contact the accounts office at +91 9090909090
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentPayments;
