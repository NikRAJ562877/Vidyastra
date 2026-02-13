import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { students, marks } from '@/lib/mock-data';
import { toast } from 'sonner';
import { GraduationCap, ArrowLeft, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const Results = () => {
  const [regNumber, setRegNumber] = useState('');
  const [password, setPassword] = useState('');
  const [result, setResult] = useState<any>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find(s => s.registerNumber === regNumber && s.password === password);
    if (!student) {
      toast.error('Invalid register number or password');
      setResult(null);
      setSearched(true);
      return;
    }

    const studentMarks = marks.filter(m => m.studentId === student.id);

    // Calculate rank among same class
    const classmates = students.filter(s => s.class === student.class);
    const rankings = classmates.map(s => {
      const sMarks = marks.filter(m => m.studentId === s.id && m.marks !== null);
      const total = sMarks.reduce((sum, m) => sum + (m.marks || 0), 0);
      return { id: s.id, total };
    }).sort((a, b) => b.total - a.total);
    const rank = rankings.findIndex(r => r.id === student.id) + 1;

    const validMarks = studentMarks.filter(m => m.marks !== null);
    const total = validMarks.reduce((sum, m) => sum + (m.marks || 0), 0);

    setResult({ student, marks: studentMarks, rank, total });
    setSearched(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="gradient-primary rounded-lg p-2.5">
            <GraduationCap className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold">Result Portal</h1>
            <p className="text-sm text-muted-foreground">Check your academic results</p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="bg-card rounded-xl border border-border p-6 shadow-card space-y-4">
          <div className="space-y-2">
            <Label>Register Number</Label>
            <Input value={regNumber} onChange={e => setRegNumber(e.target.value)} placeholder="e.g. REG001" required />
          </div>
          <div className="space-y-2">
            <Label>Password</Label>
            <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
          </div>
          <Button type="submit" className="w-full">
            <Search className="h-4 w-4 mr-2" /> View Results
          </Button>
        </form>

        {searched && !result && (
          <div className="mt-6 bg-card rounded-xl border border-border p-8 text-center shadow-card">
            <p className="text-muted-foreground">No results found. Please check your credentials.</p>
          </div>
        )}

        {result && (
          <div className="mt-6 bg-card rounded-xl border border-border shadow-card overflow-hidden">
            <div className="gradient-primary p-5 text-primary-foreground">
              <h2 className="font-heading font-bold text-lg">{result.student.name}</h2>
              <p className="text-sm text-primary-foreground/80">{result.student.class} • {result.student.batch} • Reg: {result.student.registerNumber}</p>
            </div>
            <div className="p-5">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead className="text-right">Marks</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {result.marks.map((m: any, i: number) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{m.subject}</TableCell>
                      <TableCell className="text-right">
                        {m.marks !== null ? m.marks : <span className="text-muted-foreground italic text-sm">Result Not Published</span>}
                      </TableCell>
                      <TableCell className="text-right">{m.totalMarks}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-border">
                <div>
                  <p className="text-sm text-muted-foreground">Total Marks</p>
                  <p className="text-xl font-heading font-bold">{result.total}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Class Rank</p>
                  <p className="text-xl font-heading font-bold text-gradient">#{result.rank}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;
