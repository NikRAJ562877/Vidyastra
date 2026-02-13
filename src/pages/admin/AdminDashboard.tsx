import DashboardLayout from '@/components/DashboardLayout';
import StatCard from '@/components/StatCard';
import { students, teachers, enrollments, payments } from '@/lib/mock-data';
import { Users, GraduationCap, UserPlus, IndianRupee, ClipboardList, Trophy, BookOpen, CalendarCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: <ClipboardList className="h-4 w-4" /> },
  { label: 'Enrollments', href: '/admin/enrollments', icon: <UserPlus className="h-4 w-4" /> },
  { label: 'Students', href: '/admin/students', icon: <Users className="h-4 w-4" /> },
  { label: 'Teachers', href: '/admin/teachers', icon: <GraduationCap className="h-4 w-4" /> },
  { label: 'Courses', href: '/admin/courses', icon: <BookOpen className="h-4 w-4" /> },
  { label: 'Marks & Ranking', href: '/admin/marks', icon: <Trophy className="h-4 w-4" /> },
  { label: 'Attendance', href: '/admin/attendance', icon: <CalendarCheck className="h-4 w-4" /> },
  { label: 'Payments', href: '/admin/payments', icon: <IndianRupee className="h-4 w-4" /> },
  { label: 'Notes', href: '/admin/notes', icon: <BookOpen className="h-4 w-4" /> },
  { label: 'Announcements', href: '/admin/announcements', icon: <Users className="h-4 w-4" /> },
];

const AdminDashboard = () => {
  const user = JSON.parse(localStorage.getItem('auth_user') || '{}');
  const pendingEnrollments = enrollments.filter(e => e.status === 'pending');
  const totalPaid = payments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0);

  return (
    <DashboardLayout title="Admin Dashboard" navItems={navItems} userName={user.name || 'Admin'} userRole="admin">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Students" value={students.length} icon={<Users className="h-5 w-5" />} />
        <StatCard title="Total Teachers" value={teachers.length} icon={<GraduationCap className="h-5 w-5" />} />
        <StatCard title="Pending Enrollments" value={pendingEnrollments.length} icon={<UserPlus className="h-5 w-5" />} />
        <StatCard title="Revenue Collected" value={`₹${totalPaid.toLocaleString()}`} icon={<IndianRupee className="h-5 w-5" />} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Enrollments */}
        <div className="bg-card rounded-xl border border-border shadow-card">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-heading font-bold">Pending Enrollments</h2>
            <Badge variant="secondary">{pendingEnrollments.length}</Badge>
          </div>
          <div className="p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingEnrollments.map(e => (
                  <TableRow key={e.id}>
                    <TableCell className="font-medium">{e.name}</TableCell>
                    <TableCell>{e.class}</TableCell>
                    <TableCell><Badge variant="outline" className="text-warning border-warning">Pending</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-card rounded-xl border border-border shadow-card">
          <div className="p-4 border-b border-border">
            <h2 className="font-heading font-bold">Payment Overview</h2>
          </div>
          <div className="p-4 space-y-4">
            {[
              { label: 'Paid', count: payments.filter(p => p.status === 'paid').length, color: 'bg-success' },
              { label: 'Pending', count: payments.filter(p => p.status === 'pending').length, color: 'bg-warning' },
              { label: 'Not Paid', count: payments.filter(p => p.status === 'not_paid').length, color: 'bg-destructive' },
            ].map(s => (
              <div key={s.label} className="flex items-center justify-between p-3 rounded-lg bg-muted">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${s.color}`} />
                  <span className="text-sm font-medium">{s.label}</span>
                </div>
                <span className="font-heading font-bold">{s.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
