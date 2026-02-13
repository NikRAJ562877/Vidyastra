import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Course, batches } from "@/lib/mock-data";
import { toast } from "sonner";
import { CheckCircle, Clock, IndianRupee } from "lucide-react";

import { useNavigate } from "react-router-dom";
import useEnrollments from "@/hooks/use-enrollments";

interface Props {
  course: Course | null;
  open: boolean;
  onClose: () => void;
}

const EnrollmentDialog = ({ course, open, onClose }: Props) => {
  const navigate = useNavigate();
  const { add } = useEnrollments();
  const [step, setStep] = useState<"info" | "form" | "success">("info");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    class: "",
    batch: "",
    registerNumber: "",
    mode: "online" as "online" | "offline",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.email) {
      toast.error("Please fill all required fields");
      return;
    }

    if (form.mode === "online") {
      // Pass data to payment page
      navigate("/submit-enrollment", {
        state: {
          enrollment: {
            ...form,
            class: form.class || course?.class,
            batch: form.batch || course?.batch,
            totalFee: course?.fee,
          },
        },
      });
      onClose();
    } else {
      // Offline mode - just add to enrollments
      add({
        ...form,
        class: form.class || course?.class || "",
        batch: form.batch || course?.batch || "",
        status: "pending",
        totalFee: course?.fee || 0,
      });
      setStep("success");
    }
  };

  const handleClose = () => {
    setStep("info");
    setForm({
      name: "",
      phone: "",
      email: "",
      class: "",
      batch: "",
      registerNumber: "",
      mode: "online",
    });
    onClose();
  };

  if (!course) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        {step === "info" && (
          <>
            <DialogHeader>
              <DialogTitle className="font-heading text-xl">
                {course.name}
              </DialogTitle>
              <DialogDescription>
                Course details and enrollment information
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-accent rounded-lg p-3">
                  <p className="text-muted-foreground">Class</p>
                  <p className="font-semibold text-accent-foreground">
                    {course.class}
                  </p>
                </div>
                <div className="bg-accent rounded-lg p-3">
                  <p className="text-muted-foreground">Batch</p>
                  <p className="font-semibold text-accent-foreground">
                    {course.batch}
                  </p>
                </div>
                <div className="bg-accent rounded-lg p-3">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3 w-3" /> Duration
                  </div>
                  <p className="font-semibold text-accent-foreground">
                    {course.duration}
                  </p>
                </div>
                <div className="bg-accent rounded-lg p-3">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <IndianRupee className="h-3 w-3" /> Fee
                  </div>
                  <p className="font-semibold text-accent-foreground">
                    ₹{course.fee.toLocaleString()}
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {course.description}
              </p>
              <Button className="w-full" onClick={() => setStep("form")}>
                Proceed to Enroll
              </Button>
            </div>
          </>
        )}

        {step === "form" && (
          <>
            <DialogHeader>
              <DialogTitle className="font-heading text-xl">
                Enrollment Form
              </DialogTitle>
              <DialogDescription>
                Fill in your details to enroll in {course.name}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Name *</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Full Name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Phone *</Label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="Phone Number"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="Email Address"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Register Number (if existing student)</Label>
                <Input
                  value={form.registerNumber}
                  onChange={(e) =>
                    setForm({ ...form, registerNumber: e.target.value })
                  }
                  placeholder="Optional"
                />
              </div>
              <div className="space-y-2">
                <Label>Batch</Label>
                <Select
                  value={form.batch || course.batch}
                  onValueChange={(v) => setForm({ ...form, batch: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
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
              <div className="space-y-2">
                <Label>Mode</Label>
                <Select
                  value={form.mode}
                  onValueChange={(v) =>
                    setForm({ ...form, mode: v as "online" | "offline" })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep("info")}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button type="submit" className="flex-1">
                  Submit Enrollment
                </Button>
              </div>
            </form>
          </>
        )}

        {step === "success" && (
          <div className="text-center py-8 space-y-4">
            <div className="mx-auto w-16 h-16 gradient-primary rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-primary-foreground" />
            </div>
            <DialogTitle className="font-heading text-xl">
              Enrollment Submitted!
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              Your enrollment request has been received. You will receive a
              confirmation once approved by the admin.
            </p>
            <p className="text-xs text-muted-foreground">
              Status:{" "}
              <span className="font-semibold text-warning">Pending</span>
            </p>
            <Button onClick={handleClose} className="w-full">
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EnrollmentDialog;
