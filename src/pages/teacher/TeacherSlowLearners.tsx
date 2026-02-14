import DashboardLayout from "@/components/DashboardLayout";
import { teacherNavItems } from "@/lib/nav-config";
import SlowLearners from "@/components/SlowLearners";
import { teachers } from "@/lib/mock-data";

const TeacherSlowLearners = () => {
    const user = JSON.parse(localStorage.getItem("auth_user") || "{}");
    const teacher = teachers.find((t) => t.id === user.id);

    return (
        <DashboardLayout
            title="Slow Learners Management"
            navItems={teacherNavItems}
            userName={user.name || "Teacher"}
            userRole="teacher"
        >
            <SlowLearners
                userRole="teacher"
                teacherClasses={teacher?.assignedClasses}
            />
        </DashboardLayout>
    );
};

export default TeacherSlowLearners;
