import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  ArrowLeft,
  Search,
  CheckCircle,
  FileText,
  Lock,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";
import LogoImg from "@/assets/Backgroundless.png";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useStudents from "@/hooks/use-students";
import useTests from "@/hooks/use-tests";
import useMarks from "@/hooks/use-marks";
import { Student, Test } from "@/lib/mock-data";

const Results = () => {
  const { students } = useStudents();
  const { tests } = useTests();
  const { marks } = useMarks();

  const [regNumber, setRegNumber] = useState("");
  const [password, setPassword] = useState("");

  const [loggedInStudent, setLoggedInStudent] = useState<Student | null>(null);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [searched, setSearched] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find(
      (s) => s.registerNumber === regNumber && s.password === password,
    );
    setSearched(true);
    if (!student) {
      toast.error("Invalid register number or password");
      setLoggedInStudent(null);
      return;
    }
    setLoggedInStudent(student);
    toast.success(`Welcome back, ${student.name}`);
  };

  const studentTests = useMemo(() => {
    if (!loggedInStudent) return [];
    return tests.filter((t) => t.classes.includes(loggedInStudent.class));
  }, [loggedInStudent, tests]);

  const testResults = useMemo(() => {
    if (!loggedInStudent || !selectedTest) return [];
    return marks.filter(
      (m) => m.testId === selectedTest.id && m.studentId === loggedInStudent.id,
    );
  }, [loggedInStudent, selectedTest, marks]);

  const totalObtained = testResults.reduce((sum, m) => sum + (m.marks || 0), 0);
  const totalMax = testResults.reduce((sum, m) => sum + m.totalMarks, 0);

  if (!loggedInStudent) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <Link
          to="/"
          className="fixed top-8 left-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <img
              src={LogoImg}
              alt="Vidyastara logo"
              className="h-16 w-16 mx-auto mb-4"
            />
            <h1 className="text-3xl font-heading font-bold text-slate-900">
              Result Portal
            </h1>
            <p className="text-muted-foreground mt-2">
              Enter credentials to access your performance records
            </p>
          </div>

          <form
            onSubmit={handleLogin}
            className="bg-white rounded-3xl border border-border p-8 shadow-xl space-y-6"
          >
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Register Number</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  className="pl-10 h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white"
                  value={regNumber}
                  onChange={(e) => setRegNumber(e.target.value)}
                  placeholder="e.g. REG001"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Portal Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  className="pl-10 h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full h-12 rounded-xl text-base font-bold shadow-md hover:shadow-lg transition-all"
            >
              Login to View Results
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-8">
            Forgot your password? Please contact the administration office.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-white shadow-md">
              <User className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {loggedInStudent.name}
              </h1>
              <p className="text-sm text-muted-foreground">
                {loggedInStudent.class} • {loggedInStudent.registerNumber}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            className="rounded-xl"
            onClick={() => {
              setLoggedInStudent(null);
              setSelectedTest(null);
            }}
          >
            Sign Out
          </Button>
        </div>

        {!selectedTest ? (
          <div className="grid gap-4">
            <h2 className="text-xl font-heading font-bold mb-2">
              Available Examinations
            </h2>
            {studentTests.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-dashed text-muted-foreground">
                No results have been published for your class yet.
              </div>
            ) : (
              studentTests.map((t) => (
                <div
                  key={t.id}
                  className="bg-white p-6 rounded-2xl border border-border shadow-sm flex justify-between items-center hover:shadow-md transition-shadow group"
                >
                  <div>
                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                      {t.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(t.date).toLocaleDateString()} • {t.description}
                    </p>
                  </div>
                  <Button
                    className="rounded-xl px-6"
                    onClick={() => setSelectedTest(t)}
                  >
                    View Result
                  </Button>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Button
              variant="ghost"
              className="mb-6 hover:bg-slate-200"
              onClick={() => setSelectedTest(null)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Test List
            </Button>

            <div className="bg-white rounded-3xl border border-border shadow-xl overflow-hidden">
              <div className="bg-[#3b2545] p-8 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2 inline-block">
                      Official Result
                    </span>
                    <h2 className="text-3xl font-heading font-bold">
                      {selectedTest.name}
                    </h2>
                    <p className="opacity-80 mt-1">
                      Generated on {new Date().toLocaleDateString()}
                    </p>
                  </div>
                  <FileText className="h-12 w-12 opacity-30" />
                </div>
              </div>

              <div className="p-8">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b-2 hover:bg-transparent">
                      <TableHead className="text-slate-900 font-bold h-12">
                        Subject
                      </TableHead>
                      <TableHead className="text-right text-slate-900 font-bold h-12">
                        Marks Obtained
                      </TableHead>
                      <TableHead className="text-right text-slate-900 font-bold h-12">
                        Maximum Marks
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {testResults.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          className="text-center py-12 text-muted-foreground italic"
                        >
                          Marks are being updated. Check back shortly.
                        </TableCell>
                      </TableRow>
                    ) : (
                      testResults.map((m) => (
                        <TableRow key={m.id} className="h-14">
                          <TableCell className="font-semibold text-slate-700">
                            {m.subject}
                          </TableCell>
                          <TableCell className="text-right font-bold text-lg">
                            {m.marks !== null ? (
                              m.marks
                            ) : (
                              <span className="text-muted-foreground italic text-sm font-normal">
                                Pending
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-right text-muted-foreground">
                            {m.totalMarks}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>

                <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-6 p-6 bg-slate-50 rounded-2xl border">
                  <div className="text-center md:text-left">
                    <p className="text-sm text-muted-foreground uppercase font-bold tracking-widest mb-1">
                      Total Score
                    </p>
                    <p className="text-4xl font-heading font-bold text-primary">
                      {totalObtained}{" "}
                      <span className="text-lg font-normal text-muted-foreground">
                        / {totalMax}
                      </span>
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <div className="bg-green-100 text-green-700 px-4 py-2 rounded-xl flex items-center gap-2 border border-green-200">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-bold">PASSED</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-8 pb-8 text-center">
                <p className="text-[10px] text-muted-foreground uppercase font-bold">
                  This is a system generated result and does not require a
                  physical signature.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;
