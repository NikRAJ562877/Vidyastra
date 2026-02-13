import { useNavigate } from "react-router-dom";
import { useState } from "react";
import useAnnouncements from "@/hooks/use-announcements";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import EnrollmentDialog from "@/components/EnrollmentDialog";
import { courses, students, marks, Course } from "@/lib/mock-data";
import {
  BookOpen,
  Clock,
  IndianRupee,
  Trophy,
  Star,
  ArrowRight,
  Megaphone,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import useAchievers from "@/hooks/use-achievers";

// Calculate top achievers from mock data
const achievers = students
  .map((s) => {
    const studentMarks = marks.filter(
      (m) => m.studentId === s.id && m.marks !== null,
    );
    const total = studentMarks.reduce((sum, m) => sum + (m.marks || 0), 0);
    const avg = studentMarks.length > 0 ? total / studentMarks.length : 0;
    return { ...s, total, avg, subjectCount: studentMarks.length };
  })
  .sort((a, b) => b.avg - a.avg)
  .slice(0, 3);

const Index = () => {
  const navigate = useNavigate();
  const { announcements } = useAnnouncements();
  const { achievers } = useAchievers();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [enrollOpen, setEnrollOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroBg}
            alt="Students studying"
            className="w-full h-full object-cover"
          />
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
              Shape Your Future with{" "}
              <span className="text-secondary">Vidyastara</span>
            </h1>
            <p className="mt-4 text-lg text-primary-foreground/80 max-w-lg">
              Join our premier coaching institute for personalized learning,
              expert faculty, and proven results.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate("/enroll")}
              >
                Explore Courses <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-white text-secondary hover:bg-secondary hover:text-white border-none shadow-sm"
                onClick={() =>
                  document
                    .getElementById("achievers")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
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
            { label: "Students Enrolled", value: "500+" },
            { label: "Expert Teachers", value: "25+" },
            { label: "Courses", value: "30+" },
            { label: "Success Rate", value: "95%" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-2xl font-heading font-bold text-primary-foreground">
                {stat.value}
              </p>
              <p className="text-sm text-primary-foreground/70">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Achievers Slideshow */}
      <section id="achievers" className="py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-3">
              <Trophy className="h-3 w-3 mr-1" /> Achievers
            </Badge>
            <h2 className="text-3xl md:text-4xl font-heading font-bold">
              Our Top Performers
            </h2>
            <p className="text-muted-foreground mt-2">
              Celebrating excellence in academics
            </p>
          </div>

          <div className="relative max-w-5xl mx-auto group">
            <div className="flex gap-6 overflow-x-auto pb-8 snap-x no-scrollbar scroll-smooth">
              {achievers.map((a, i) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="min-w-[280px] md:min-w-[320px] snap-center bg-card rounded-2xl border border-border p-8 text-center shadow-card hover:shadow-elevated transition-all relative overflow-hidden group/card"
                >
                  <div className="absolute top-0 left-0 w-full h-1 gradient-primary opacity-0 group-hover/card:opacity-100 transition-opacity" />

                  {a.rank <= 3 && (
                    <div className="absolute top-4 right-4 animate-float">
                      <div className="gradient-primary rounded-full p-2 shadow-primary">
                        <Star className="h-4 w-4 text-primary-foreground" />
                      </div>
                    </div>
                  )}

                  <div className="w-24 h-24 rounded-full gradient-accent flex items-center justify-center mx-auto mb-6 p-1 border-4 border-background shadow-lg">
                    {a.imageUrl ? (
                      <img
                        src={a.imageUrl}
                        alt={a.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <GraduationCap className="h-10 w-10 text-accent-foreground" />
                    )}
                  </div>

                  <h3 className="font-heading text-xl font-bold mb-1">
                    {a.name}
                  </h3>
                  <p className="text-muted-foreground mb-4">{a.class}</p>

                  <div className="gradient-primary rounded-xl py-3 px-4 shadow-primary">
                    <p className="text-sm text-primary-foreground font-bold flex items-center justify-center gap-2">
                      Average Score: {a.avg.toFixed(1)}%
                    </p>
                  </div>

                  <div className="mt-4 inline-flex items-center justify-center w-10 h-10 rounded-full bg-muted font-heading font-bold text-sm">
                    #{a.rank}
                  </div>
                </motion.div>
              ))}
            </div>

            <button
              onClick={() =>
                document
                  .querySelector(".snap-x")
                  ?.scrollBy({ left: -320, behavior: "smooth" })
              }
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 p-2 rounded-full bg-background border border-border shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={() =>
                document
                  .querySelector(".snap-x")
                  ?.scrollBy({ left: 320, behavior: "smooth" })
              }
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 p-2 rounded-full bg-background border border-border shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>
      </section>

      {/* Announcements */}
      <section id="announcements" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-3">
              <Megaphone className="h-3 w-3 mr-1" /> Announcements
            </Badge>
            <h2 className="text-3xl md:text-4xl font-heading font-bold">
              Latest Updates
            </h2>
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
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                    {a.date}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {a.description}
                </p>
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
            <span className="font-heading text-xl font-bold">
              Vidyastara Tuition
            </span>
          </div>
          <p className="text-primary-foreground/60 text-sm">
            © 2025 Vidyastara Tuition. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
