import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft, Mail, Key, ShieldCheck } from "lucide-react";
import LogoImg from "@/assets/Backgroundless.png";
import useStudents from "@/hooks/use-students";
import useTeachers from "@/hooks/use-teachers";
import { adminUser } from "@/lib/mock-data";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const { students, update: updateStudent } = useStudents();
    const { teachers, update: updateTeacher } = useTeachers();

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [identifier, setIdentifier] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [targetUser, setTargetUser] = useState<{ id: string; role: string } | null>(null);

    const handleIdentifierSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        setTimeout(() => {
            // Admin check
            if (identifier === adminUser.email) {
                setTargetUser({ id: adminUser.id, role: "admin" });
                toast.info("OTP sent to your email (Mock: 1234)");
                setStep(2);
                setLoading(false);
                return;
            }

            // Teacher check
            const teacher = teachers.find(t => t.email === identifier);
            if (teacher) {
                setTargetUser({ id: teacher.id, role: "teacher" });
                toast.info("OTP sent to your email (Mock: 1234)");
                setStep(2);
                setLoading(false);
                return;
            }

            // Student check
            const student = students.find(s => s.email === identifier || s.registerNumber === identifier);
            if (student) {
                setTargetUser({ id: student.id, role: "student" });
                toast.info("OTP sent to your email (Mock: 1234)");
                setStep(2);
                setLoading(false);
                return;
            }

            toast.error("Account not found with this email/register number");
            setLoading(false);
        }, 800);
    };

    const handleOtpSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (otp === "1234") {
            setStep(3);
        } else {
            toast.error("Invalid OTP. Try 1234.");
        }
    };

    const handleResetPassword = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        setLoading(true);
        setTimeout(() => {
            if (targetUser?.role === "student") {
                updateStudent(targetUser.id, { password: newPassword });
            } else if (targetUser?.role === "teacher") {
                updateTeacher(targetUser.id, { password: newPassword });
            } else if (targetUser?.role === "admin") {
                toast.warning("In this mock, Admin password cannot be changed via UI (Rule 4).");
                navigate("/login");
                return;
            }

            toast.success("Password reset successfully!");
            navigate("/login");
        }, 1000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-8 bg-muted/30">
            <div className="w-full max-w-sm bg-card rounded-2xl border border-border shadow-soft p-8">
                <div className="text-center mb-8">
                    <Link to="/login" className="flex items-center gap-2 justify-center mb-6">
                        <img src={LogoImg} alt="Logo" className="h-12 w-9" />
                        <span className="font-heading text-lg font-bold">Vidyastara</span>
                    </Link>

                    <h1 className="text-2xl font-heading font-bold">Reset Password</h1>
                    <p className="text-sm text-muted-foreground mt-2">
                        {step === 1 && "Enter your email or register number to receive an OTP"}
                        {step === 2 && "Enter the 4-digit code sent to your email"}
                        {step === 3 && "Create a new secure password for your account"}
                    </p>
                </div>

                {step === 1 && (
                    <form onSubmit={handleIdentifierSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Email or Register Number</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    className="pl-10"
                                    placeholder="name@example.com"
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Checking..." : "Send OTP"}
                        </Button>
                        <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary pt-2">
                            <ArrowLeft className="h-4 w-4" /> Back to Login
                        </Link>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleOtpSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label>One-Time Password (OTP)</Label>
                            <div className="relative">
                                <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    className="pl-10 text-center tracking-[1em] font-bold"
                                    placeholder="0000"
                                    maxLength={4}
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                />
                            </div>
                            <p className="text-center text-[10px] text-muted-foreground">Hint: Enter 1234</p>
                        </div>
                        <Button type="submit" className="w-full">
                            Verify OTP
                        </Button>
                        <button type="button" onClick={() => setStep(1)} className="w-full text-center text-sm text-muted-foreground hover:underline">
                            Resend code
                        </button>
                    </form>
                )}

                {step === 3 && (
                    <form onSubmit={handleResetPassword} className="space-y-4">
                        <div className="space-y-2">
                            <Label>New Password</Label>
                            <div className="relative">
                                <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="password"
                                    className="pl-10"
                                    placeholder="••••••••"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Confirm New Password</Label>
                            <div className="relative">
                                <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="password"
                                    className="pl-10"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Resetting..." : "Reset Password"}
                        </Button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
