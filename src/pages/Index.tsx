import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import { students, marks } from '@/lib/mock-data';
import { Trophy, Star, ArrowRight, Megaphone, GraduationCap } from 'lucide-react';
import heroBg from '@/assets/hero-bg.jpg';

const announcements = [
  { id: 1, title: 'Admissions Open for 2025-26', description: 'Enroll now for the upcoming academic year. Early bird discounts available!', date: 'Feb 10, 2025' },
  { id: 2, title: 'Annual Day Celebration', description: 'Join us for our annual day celebrations on March 15, 2025.', date: 'Feb 8, 2025' },
  { id: 3, title: 'Board Exam Preparation Crash Course', description: 'Special crash course starting Feb 20 for board exam students.', date: 'Feb 5, 2025' },
];

// Calculate top achievers from mock data
const achievers = students
  .map(s => {
    const studentMarks = marks.filter(m => m.studentId === s.id && m.marks !== null);
    const total = studentMarks.reduce((sum, m) => sum + (m.marks || 0), 0);
    const avg = studentMarks.length > 0 ? total / studentMarks.length : 0;
    return { ...s, total, avg, subjectCount: studentMarks.length };
  })
  .sort((a, b) => b.avg - a.avg)
  .slice(0, 3);

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="Students studying" className="w-full h-full object-cover" />
          <div className="absolute inset-0 gradient-hero opacity-85" />
        </div>
        <div className="container mx-auto px-4 relative z-10 pt-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <Badge className="mb-4 gradient-primary text-primary-foreground border-0 px-4 py-1.5 text-sm">
              Admissions Open 2026-27
            </Badge>
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-primary-foreground leading-tight">
              Shape Your Future with <span className="text-secondary">Vidyastara</span>
            </h1>
            <p className="mt-4 text-lg text-primary-foreground/80 max-w-lg">
              Join our premier coaching institute for personalized learning, expert faculty, and proven results.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" variant="secondary" onClick={() => navigate('/enroll')}>
                Explore Courses <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" onClick={() => document.getElementById('achievers')?.scrollIntoView({ behavior: 'smooth' })}>
                <Trophy className="mr-2 h-4 w-4" /> View Achievers
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="gradient-primary py-6">
        <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { label: 'Students Enrolled', value: '500+' },
            { label: 'Expert Teachers', value: '25+' },
            { label: 'Courses', value: '30+' },
            { label: 'Success Rate', value: '95%' },
          ].map(stat => (
            <div key={stat.label}>
              <p className="text-2xl font-heading font-bold text-primary-foreground">{stat.value}</p>
              <p className="text-sm text-primary-foreground/70">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Announcements */}
      <section id="announcements" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-3">
              <Megaphone className="h-3 w-3 mr-1" /> Announcements
            </Badge>
            <h2 className="text-3xl md:text-4xl font-heading font-bold">Latest Updates</h2>
          </div>
          <div className="max-w-2xl mx-auto space-y-4">
            {announcements.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-xl border border-border p-5 shadow-card"
              >
                <div className="flex items-start justify-between">
                  <h3 className="font-heading font-semibold">{a.title}</h3>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">{a.date}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{a.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievers */}
      <section id="achievers" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-3">
              <Trophy className="h-3 w-3 mr-1" /> Achievers
            </Badge>
            <h2 className="text-3xl md:text-4xl font-heading font-bold">Our Top Performers</h2>
            <p className="text-muted-foreground mt-2">Celebrating excellence in academics</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {achievers.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-card rounded-xl border border-border p-6 text-center shadow-card hover:shadow-elevated transition-all relative"
              >
                {i === 0 && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <div className="gradient-primary rounded-full p-2">
                      <Star className="h-4 w-4 text-primary-foreground" />
                    </div>
                  </div>
                )}
                <div className="w-14 h-14 rounded-full gradient-accent flex items-center justify-center mx-auto mt-2">
                  <GraduationCap className="h-6 w-6 text-accent-foreground" />
                </div>
                <h3 className="font-heading font-bold mt-3">{a.name}</h3>
                <p className="text-sm text-muted-foreground">{a.class}</p>
                <div className="mt-3 gradient-primary rounded-lg py-2">
                  <p className="text-sm text-primary-foreground font-semibold">Avg: {a.avg.toFixed(1)}%</p>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Rank #{i + 1}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="gradient-hero py-12 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <GraduationCap className="h-6 w-6" />
            <span className="font-heading text-xl font-bold">Vidyastara Tuition</span>
          </div>
          <p className="text-primary-foreground/60 text-sm">© 2025 Vidyastara Tuition. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
