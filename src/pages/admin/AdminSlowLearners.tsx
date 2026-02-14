import DashboardLayout from "@/components/DashboardLayout";
import { adminNavItems } from "@/lib/nav-config";
import SlowLearners from "@/components/SlowLearners";

const AdminSlowLearners = () => {
    return (
        <DashboardLayout
            title="Slow Learners Management"
            navItems={adminNavItems}
            userName="Admin"
            userRole="admin"
        >
            <SlowLearners userRole="admin" />
        </DashboardLayout>
    );
};

export default AdminSlowLearners;
