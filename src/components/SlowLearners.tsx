import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import useStudents from "@/hooks/use-students";
import { classes as mockClasses, Student } from "@/lib/mock-data";
import { Search } from "lucide-react";
import { toast } from "sonner";

interface SlowLearnersProps {
    userRole: "admin" | "teacher";
    teacherClasses?: string[];
}

const SlowLearners = ({ userRole, teacherClasses }: SlowLearnersProps) => {
    const { students, update } = useStudents();
    const [searchQuery, setSearchQuery] = useState("");
    const [classFilter, setClassFilter] = useState("all");

    const availableClasses = userRole === "admin" ? mockClasses : (teacherClasses || []);

    const filteredStudents = students.filter((s) => {
        const matchesSearch =
            s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.registerNumber.toLowerCase().includes(searchQuery.toLowerCase());

        // For teachers, only show students from their assigned classes
        const isVisibleToTeacher = userRole === "admin" || (teacherClasses && teacherClasses.includes(s.class));

        const matchesClass = classFilter === "all" ? isVisibleToTeacher : s.class === classFilter;

        return matchesSearch && matchesClass && isVisibleToTeacher;
    });

    const handleToggleSlowLearner = (studentId: string, isSlowLearner: boolean) => {
        update(studentId, { category: isSlowLearner ? "slow_learner" : "normal" });
        toast.success(`Student updated successfully`);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by name or register number..."
                        className="pl-10 h-11 rounded-xl"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <Select value={classFilter} onValueChange={setClassFilter}>
                        <SelectTrigger className="w-[200px] h-11 rounded-xl">
                            <SelectValue placeholder="Filter by Class" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Available Classes</SelectItem>
                            {availableClasses.map((c) => (
                                <SelectItem key={c} value={c}>
                                    {c}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            <TableHead>Reg No</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Class</TableHead>
                            <TableHead>Batch</TableHead>
                            <TableHead className="text-center w-[150px]">Slow Learner</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredStudents.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={5}
                                    className="text-center py-12 text-muted-foreground"
                                >
                                    No students found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredStudents.map((s) => (
                                <TableRow key={s.id} className="hover:bg-muted/30 transition-colors">
                                    <TableCell className="font-mono text-xs font-bold text-primary">
                                        {s.registerNumber}
                                    </TableCell>
                                    <TableCell className="font-medium text-slate-900">{s.name}</TableCell>
                                    <TableCell>{s.class}</TableCell>
                                    <TableCell className="text-xs">{s.batch}</TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex justify-center">
                                            <Checkbox
                                                checked={s.category === "slow_learner"}
                                                onCheckedChange={(checked) =>
                                                    handleToggleSlowLearner(s.id, checked as boolean)
                                                }
                                                className="h-5 w-5 rounded-md"
                                            />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default SlowLearners;
