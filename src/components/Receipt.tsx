import { Enrollment, PaymentRecord } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Download, Printer, CheckCircle } from "lucide-react";

interface Props {
  data:
    | Enrollment
    | (PaymentRecord & {
        studentName: string;
        courseName: string;
        uniqueId: string;
      });
  onClose?: () => void;
}

const Receipt = ({ data }: Props) => {
  const isEnrollment = "name" in data;

  const studentName = isEnrollment ? data.name : data.studentName;
  const uniqueId = isEnrollment ? data.uniqueId : data.uniqueId;
  const courseName = isEnrollment ? data.class : data.courseName;
  const paymentType = isEnrollment
    ? data.paymentType || "Full"
    : data.type || "Full";
  const amountPaid = isEnrollment ? data.amountPaid || 0 : data.amount;
  const totalFee = isEnrollment ? data.totalFee || 0 : 0; // For individual records, we might not have total fee here
  const paymentMode = isEnrollment ? data.mode || "Online" : data.mode;
  const date = isEnrollment ? data.date : data.date;
  const transactionId = isEnrollment ? data.transactionId : data.transactionId;

  const remainingAmount = isEnrollment ? totalFee - amountPaid : 0;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white text-slate-900 p-8 rounded-xl shadow-lg border border-slate-200 max-w-2xl mx-auto print:shadow-none print:border-none print:p-0">
      <div className="flex justify-between items-start mb-8 border-b pb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-primary">
            VIDYASTARA LMS
          </h1>
          <p className="text-sm text-slate-500">Official Payment Receipt</p>
        </div>
        <div className="text-right">
          <CheckCircle className="h-10 w-10 text-success ml-auto mb-2" />
          <p className="text-xs font-mono">
            {transactionId ? `TXN: ${transactionId}` : `REF: ${uniqueId}`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Student Details
          </h3>
          <p className="font-bold">{studentName}</p>
          <p className="text-sm text-slate-600">ID: {uniqueId}</p>
        </div>
        <div className="text-right">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Payment Info
          </h3>
          <p className="text-sm">
            <span className="text-slate-500">Date:</span>{" "}
            {new Date(date).toLocaleDateString()}
          </p>
          <p className="text-sm uppercase">
            <span className="text-slate-500">Mode:</span> {paymentMode}
          </p>
        </div>
      </div>

      <div className="bg-slate-50 rounded-lg p-6 mb-8">
        <div className="flex justify-between border-b border-slate-200 pb-3 mb-3">
          <span className="text-slate-600 font-medium">
            Course / Description
          </span>
          <span className="font-bold">Amount Paid</span>
        </div>
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="font-bold">{courseName}</p>
            <p className="text-xs text-slate-500">
              {paymentType === "installment"
                ? "Installment Payment (1/2)"
                : "Full Enrollment Fee"}
            </p>
          </div>
          <p className="text-xl font-heading font-bold">
            ₹{amountPaid.toLocaleString()}
          </p>
        </div>

        {remainingAmount > 0 && (
          <div className="flex justify-between text-sm text-slate-500">
            <span>Remaining Balance:</span>
            <span>₹{remainingAmount.toLocaleString()}</span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center border-t pt-6 text-sm text-slate-500 italic">
        <p>This is a computer-generated receipt and requires no signature.</p>
        <div className="flex gap-2 print:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="h-8"
          >
            <Printer className="h-3 w-3 mr-2" /> Print
          </Button>
          <Button variant="outline" size="sm" className="h-8">
            <Download className="h-3 w-3 mr-2" /> PDF
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Receipt;
