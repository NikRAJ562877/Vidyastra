import { useMemo } from 'react';
import useEnrollments from './use-enrollments';
import useStudents from './use-students';
import { Enrollment, Student, PaymentRecord } from '@/lib/mock-data';

export interface Transaction {
  id: string;
  date: string;
  studentName: string;
  amount: number;
  type: 'full' | 'installment';
  mode: string;
  status: 'paid' | 'partial' | 'pending';
  source: 'enrollment' | 'student';
  relatedId: string; // enrollment id or student id
  courseName: string;
  receiptId?: string;
}

export default function usePayments() {
  const { enrollments } = useEnrollments();
  const { students } = useStudents();

  const transactions = useMemo(() => {
    const list: Transaction[] = [];

    // 1. Add Enrollment Transactions (Online/Offline initial payments)
    enrollments.forEach(e => {
      // Only include if some payment was recorded
      if (e.amountPaid && e.amountPaid > 0) {
        list.push({
          id: `enr-${e.id}`,
          date: e.date,
          studentName: e.name,
          amount: e.amountPaid,
          type: e.paymentType || 'full',
          mode: e.mode === 'online' ? 'Online' : 'Offline',
          status: e.paymentStatus || 'pending',
          source: 'enrollment',
          relatedId: e.id,
          courseName: e.class,
          receiptId: e.transactionId
        });
      }
    });

    // 2. Add Student Payment History (Manual offline records)
    students.forEach(s => {
      if (s.paymentHistory && s.paymentHistory.length > 0) {
        s.paymentHistory.forEach(p => {
          list.push({
            id: p.id,
            date: p.date,
            studentName: s.name,
            amount: p.amount,
            type: p.type,
            mode: p.mode,
            status: s.paymentStatus === 'paid' ? 'paid' : 'partial',
            source: 'student',
            relatedId: s.id,
            courseName: s.class,
            receiptId: p.receiptId
          });
        });
      }
    });

    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [enrollments, students]);

  const stats = useMemo(() => {
    const totalCollected = transactions.reduce((sum, t) => sum + t.amount, 0);
    
    // Calculate pending from students
    const studentPending = students.reduce((sum, s) => {
      const paid = s.paymentHistory?.reduce((pSum, p) => pSum + p.amount, 0) || 0;
      const fee = s.totalFee || 0;
      return sum + Math.max(0, fee - paid);
    }, 0);

    // Calculate pending from enrollments
    const enrollmentPending = enrollments.reduce((sum, e) => {
       const paid = e.amountPaid || 0;
       const fee = e.totalFee || 0;
       return sum + Math.max(0, fee - paid);
    }, 0);
    
    const totalExpected = students.reduce((sum, s) => sum + (s.totalFee || 0), 0) + 
                         enrollments.reduce((sum, e) => sum + (e.totalFee || 0), 0);
    
    return {
      totalCollected,
      totalExpected,
      totalPending: studentPending + enrollmentPending,
      transactionCount: transactions.length
    };
  }, [transactions, students, enrollments]);

  return { transactions, stats };
}
