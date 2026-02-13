import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, CreditCard, Wallet, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import useEnrollments from "@/hooks/use-enrollments";
import { motion } from "framer-motion";

const SubmitEnrollment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { add } = useEnrollments();
  const [selectedPlan, setSelectedPlan] = useState<
    "full" | "installment" | null
  >(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Get enrollment data from location state
  const enrollmentData = location.state?.enrollment;

  if (!enrollmentData) {
    navigate("/enroll");
    return null;
  }

  const totalFee = enrollmentData.totalFee || 0;
  const installmentAmount = Math.ceil(totalFee / 2);

  const handlePayment = () => {
    if (!selectedPlan) {
      toast.error("Please select a payment plan");
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing delay
    setTimeout(() => {
      const amountPaid = selectedPlan === "full" ? totalFee : installmentAmount;
      const paymentStatus = selectedPlan === "full" ? "paid" : "partial";

      // Record the enrollment
      const newEnrollment = {
        ...enrollmentData,
        paymentType: selectedPlan,
        amountPaid,
        paymentStatus,
        transactionId: `TXN-${Math.floor(Math.random() * 1000000)}`,
        status: "pending", // Admin still needs to confirm/convert to student
      };

      // Since the hook uses Date.now() for ID, we can predict the ID or just use the whole list
      // In a real app, the hook would return the newly added item's ID.
      // For now, let's just use a fake receipt transition.
      add(newEnrollment);

      toast.success("Payment successful!");
      setIsProcessing(false);
      navigate(`/receipt/latest`, { state: { enrollment: newEnrollment } });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <Navbar />
      <div className="container max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-heading font-bold mb-2">
            Select Payment Plan
          </h1>
          <p className="text-muted-foreground">
            Choose how you want to pay for {enrollmentData.class}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Full Payment */}
          <Card
            className={`cursor-pointer transition-all border-2 ${selectedPlan === "full" ? "border-primary ring-2 ring-primary/20" : "hover:border-primary/50"}`}
            onClick={() => setSelectedPlan("full")}
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="font-heading">Full Payment</CardTitle>
                {selectedPlan === "full" && (
                  <div className="bg-primary text-white p-1 rounded-full">
                    <Check className="h-4 w-4" />
                  </div>
                )}
              </div>
              <CardDescription>
                Pay the entire fee upfront and get peace of mind.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-4">
                ₹{totalFee.toLocaleString()}
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-success" /> One-time payment
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-success" /> Instant receipt
                  generation
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-success" /> No future payment
                  reminders
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Installment Payment */}
          <Card
            className={`cursor-pointer transition-all border-2 ${selectedPlan === "installment" ? "border-primary ring-2 ring-primary/20" : "hover:border-primary/50"}`}
            onClick={() => setSelectedPlan("installment")}
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="font-heading">Installment Plan</CardTitle>
                {selectedPlan === "installment" && (
                  <div className="bg-primary text-white p-1 rounded-full">
                    <Check className="h-4 w-4" />
                  </div>
                )}
              </div>
              <CardDescription>
                Split your payment into two easy installments.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-4">
                ₹{installmentAmount.toLocaleString()}{" "}
                <span className="text-sm font-normal text-muted-foreground">
                  / now
                </span>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-success" /> 2 Installments of ₹
                  {installmentAmount.toLocaleString()}
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-success" /> 1st installment due
                  now
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-success" /> 2nd installment due
                  next month
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="bg-muted/50 rounded-xl p-6 border border-border">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white p-3 rounded-lg border border-border">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-bold">Secure Online Payment</p>
                <p className="text-xs text-muted-foreground">
                  Encrypted transaction via our secure payment gateway.
                </p>
              </div>
            </div>

            <Button
              size="lg"
              className="w-full md:w-auto min-w-[200px]"
              disabled={!selectedPlan || isProcessing}
              onClick={handlePayment}
            >
              {isProcessing ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" /> Complete Payment
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-8 opacity-50 grayscale">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/1200px-PayPal.svg.png"
            alt="PayPal"
            className="h-4"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png"
            alt="Visa"
            className="h-4"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png"
            alt="Mastercard"
            className="h-4"
          />
        </div>
      </div>
    </div>
  );
};

export default SubmitEnrollment;
