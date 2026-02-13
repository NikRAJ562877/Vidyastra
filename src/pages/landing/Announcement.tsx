import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import useAnnouncements from '@/hooks/use-announcements';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Trash2, Edit, Plus, Users, Megaphone, BookOpen, IndianRupee, CalendarCheck, Trophy, GraduationCap, UserPlus, ClipboardList } from 'lucide-react';

const Announcements = () => {
	const { announcements, add, update, remove } = useAnnouncements();
	const navItems = [
	    { label: 'Dashboard', href: '/admin', icon: <ClipboardList className="h-4 w-4" /> },
		{ label: 'Enrollments', href: '/admin/enrollments', icon: <UserPlus className="h-4 w-4" /> },
		{ label: 'Students', href: '/admin/students', icon: <Users className="h-4 w-4" /> },
		{ label: 'Teachers', href: '/admin/teachers', icon: <GraduationCap className="h-4 w-4" /> },
		{ label: 'Marks & Ranking', href: '/admin/marks', icon: <Trophy className="h-4 w-4" /> },
		{ label: 'Attendance', href: '/admin/attendance', icon: <CalendarCheck className="h-4 w-4" /> },
		{ label: 'Payments', href: '/admin/payments', icon: <IndianRupee className="h-4 w-4" /> },
		{ label: 'Notes', href: '/admin/notes', icon: <BookOpen className="h-4 w-4" /> },
		{ label: 'Announcements', href: '/admin/announcements', icon: <Megaphone className="h-4 w-4" /> },
	];
	const [editingId, setEditingId] = useState<number | string | null>(null);
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [date, setDate] = useState('');

	const startEdit = (id: number | string) => {
		const a = announcements.find(x => x.id === id);
		if (!a) return;
		setEditingId(id);
		setTitle(a.title);
		setDescription(a.description);
		setDate(a.date);
	};

	const clearForm = () => {
		setEditingId(null);
		setTitle('');
		setDescription('');
		setDate('');
	};

	const save = () => {
		if (!title.trim() || !description.trim()) return;
		if (editingId) {
			update(editingId, { title: title.trim(), description: description.trim(), date: date || new Date().toLocaleDateString() });
		} else {
			add({ title: title.trim(), description: description.trim(), date: date || new Date().toLocaleDateString() });
		}
		clearForm();
	};

	return (
		<DashboardLayout title="Manage Announcements" navItems={navItems} userName="Admin" userRole="admin">
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-2 space-y-4">
					{announcements.map(a => (
						<div key={a.id} className="bg-card rounded-xl border border-border p-4 flex items-start justify-between">
							<div>
								<h3 className="font-heading font-semibold">{a.title}</h3>
								<p className="text-sm text-muted-foreground mt-1">{a.description}</p>
								<p className="text-xs text-muted-foreground mt-2">{a.date}</p>
							</div>
							<div className="flex flex-col gap-2 ml-4">
								<Button variant="ghost" size="sm" onClick={() => startEdit(a.id)} title="Edit">
									<Edit className="h-4 w-4" />
								</Button>
								<Button variant="ghost" size="sm" onClick={() => remove(a.id)} title="Delete">
									<Trash2 className="h-4 w-4 text-destructive" />
								</Button>
							</div>
						</div>
					))}
				</div>

				<div className="bg-card rounded-xl border border-border p-4">
					<h3 className="font-heading font-semibold mb-3">{editingId ? 'Edit Announcement' : 'New Announcement'}</h3>
					<div className="space-y-3">
						<Input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
						<Textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} rows={4} />
						<Input placeholder="Date (optional)" value={date} onChange={e => setDate(e.target.value)} />
						<div className="flex items-center gap-2">
							<Button onClick={save}>
								<Plus className="mr-2 h-4 w-4" /> {editingId ? 'Update' : 'Add'}
							</Button>
							{editingId && (
								<Button variant="ghost" onClick={clearForm}>Cancel</Button>
							)}
						</div>
					</div>
				</div>
			</div>
		</DashboardLayout>
	);
};

export default Announcements;

