import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Lock, CheckCircle2 } from "lucide-react";
import useStudents from "@/hooks/use-students";
import useTeachers from "@/hooks/use-teachers";

interface ChangePasswordProps {
    userId: string;
    userRole: "student" | "teacher";
    onSuccess?: () => void;
}

const ChangePassword = ({ userId, userRole, onSuccess }: ChangePasswordProps) => {
    const { students, update: updateStudent } = useStudents();
    const { teachers, update: updateTeacher } = useTeachers();

    const [formData, setFormData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        setTimeout(() => {
            let currentUser;
            if (userRole === "student") {
                currentUser = students.find((s) => s.id === userId);
            } else {
                currentUser = teachers.find((t) => t.id === userId);
            }

            if (!currentUser) {
                toast.error("User not found");
                setLoading(false);
                return;
            }

            if (formData.oldPassword !== currentUser.password) {
                toast.error("Incorrect old password");
                setLoading(false);
                return;
            }

            if (formData.newPassword !== formData.confirmPassword) {
                toast.error("New passwords do not match");
                setLoading(false);
                return;
            }

            if (formData.newPassword.length < 6) {
                toast.error("Password must be at least 6 characters");
                setLoading(false);
                return;
            }

            const updateData = {
                password: formData.newPassword,
                isFirstLogin: false,
            };

            if (userRole === "student") {
                updateStudent(userId, updateData);
            } else {
                updateTeacher(userId, updateData);
            }

            // Update local storage user object too
            const authUser = JSON.parse(localStorage.getItem("auth_user") || "{}");
            localStorage.setItem("auth_user", JSON.stringify({ ...authUser, isFirstLogin: false }));

            toast.success("Password changed successfully!");
            setLoading(false);
            if (onSuccess) onSuccess();
        }, 500);
    };

    return (
        <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
            <div className="p-4 border-b border-border bg-muted/30">
                <h2 className="font-heading font-bold flex items-center gap-2">
                    <Lock className="h-4 w-4 text-primary" /> Setup Your Password
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                    Change your default password to a secure personal one.
                </p>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="oldPassword">Old Password</Label>
                    <Input
                        id="oldPassword"
                        type="password"
                        placeholder="••••••••"
                        value={formData.oldPassword}
                        onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })}
                        required
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                            id="newPassword"
                            type="password"
                            placeholder="••••••••"
                            value={formData.newPassword}
                            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            required
                        />
                    </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Updating..." : "Change Password"}
                </Button>
            </form>
        </div>
    );
};

export default ChangePassword;
