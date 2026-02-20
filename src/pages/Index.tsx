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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import heroBg from "@/assets/HEROIMAGE.png";
import useAchievers from "@/hooks/use-achievers";

import Footer from "@/components/Footer";
import CourseShowcase from "@/components/CourseShowcase";
import useCourses from "@/hooks/use-courses";
import InfiniteScrollingScanner from "@/components/InfiniteScrollingScanner";
import ContactForm from "@/components/ContactForm";
import AchieverShowcase from "@/components/AchieverShowcase";
import BackgroundDecorator from "@/components/BackgroundDecorator";

const Index = () => {
  const navigate = useNavigate();
  const { announcements } = useAnnouncements();
  const { achievers } = useAchievers();
  const { courses: allCourses } = useCourses();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [enrollOpen, setEnrollOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background relative selection:bg-primary/20">
      <Navbar />
      <BackgroundDecorator />

      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-20 bg-[hsl(226,100%,97%)]">
        <div className="absolute inset-0 z-0">
          <img
            src={heroBg}
            alt="Students studying"
            className="w-full h-full object-cover opacity-60 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/80 via-white/40 to-amber-50/60" />
        </div>
        <div className="container mx-auto px-4 relative z-10 pt-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 px-4 py-1.5 text-sm font-semibold rounded-full animate-fade-in">
              Admissions Open 2026-27
            </Badge>
            <h1 className="text-5xl md:text-7xl font-heading font-extrabold text-slate-900 leading-[1.1] tracking-tight">
              Shape Your Future with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Vidyastara</span>
            </h1>
            <p className="mt-6 text-xl text-slate-600 max-w-lg leading-relaxed">
              Join our premier coaching institute for personalized learning,
              expert faculty, and proven results.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/25 px-10 h-14 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105"
                onClick={() => navigate("/enroll")}
              >
                Explore Courses <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-white/80 backdrop-blur-sm border-slate-200 text-slate-700 hover:bg-white shadow-lg px-8 h-14 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105"
                onClick={() =>
                  document
                    .getElementById("achievers")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                <Trophy className="mr-2 h-5 w-5 text-amber-500" /> View Achievers
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="bg-[hsl(38,100%,96%)] py-16 relative z-10 border-y border-amber-100/50">
        <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "Students Enrolled", value: "500+", color: "text-primary" },
            { label: "Expert Teachers", value: "25+", color: "text-secondary" },
            { label: "Courses", value: "30+", color: "text-accent" },
            { label: "Success Rate", value: "95%", color: "text-green-500" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center p-8 rounded-[2.5rem] bg-slate-50/50 border border-slate-100/50 hover:shadow-2xl hover:bg-white transition-all duration-500 hover:-translate-y-2 group"
            >
              <p className={`text-4xl md:text-5xl font-heading font-extrabold ${stat.color} mb-2 group-hover:scale-110 transition-transform duration-300`}>
                {stat.value}
              </p>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Popular Courses Showcase */}
      <section className="bg-[hsl(226,100%,97%)] py-16 relative z-10">
        <CourseShowcase
          courses={allCourses}
          onEnroll={(course) => {
            setSelectedCourse(course);
            setEnrollOpen(true);
          }}
        />
      </section>

      {/* Achievers Showcase */}
      <section className="bg-[hsl(38,100%,96%)] py-24 relative z-10 border-y border-amber-100/50">
        <AchieverShowcase achievers={achievers} />
      </section>

      {/* Announcements */}
      <section id="announcements" className="py-24 bg-[hsl(226,100%,97%)] relative z-10">
        <div className="container mx-auto px-4 API">
          <div className="text-center mb-16">
            <Badge
              variant="outline"
              className="mb-3 px-4 py-1 border-primary/20 bg-primary/5 text-primary"
            >
              <Megaphone className="h-3 w-3 mr-2" /> Latest Updates
            </Badge>
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-slate-900">
              Campus <span className="text-primary italic">Buzz</span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Stay updated with everything happening at Vidyastara. From exam
              schedules to cultural events, don't miss a beat.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {announcements.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <Megaphone className="h-5 w-5" />
                  </div>
                  <Badge
                    variant="secondary"
                    className="font-medium text-[10px] uppercase tracking-wider"
                  >
                    {a.date}
                  </Badge>
                </div>

                <h3 className="font-heading font-bold text-lg mb-2 text-slate-900 group-hover:text-primary transition-colors line-clamp-2">
                  {a.title}
                </h3>
                <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed">
                  {a.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Infinite Scrolling Scanner */}
      <InfiniteScrollingScanner />

      {/* Contact Form */}
      <ContactForm />

      <Footer />
    </div>
  );
};

export default Index;
