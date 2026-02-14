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

import Footer from "@/components/Footer";
import CourseShowcase from "@/components/CourseShowcase";
import useCourses from "@/hooks/use-courses";
import InfiniteScrollingScanner from "@/components/InfiniteScrollingScanner";
import ContactForm from "@/components/ContactForm";
import AchieverShowcase from "@/components/AchieverShowcase";

const Index = () => {
  const navigate = useNavigate();
  const { announcements } = useAnnouncements();
  const { achievers } = useAchievers();
  const { courses: allCourses } = useCourses();
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
          <div className="absolute inset-0 bg-[#3b2545]/50" />
        </div>
        <div className="container mx-auto px-4 relative z-10 pt-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <Badge className="mb-4 bg-[#5a3668] text-primary-foreground border-0 px-4 py-1.5 text-sm">
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
      <section className="bg-[#3b2545] py-6">
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

      {/* Popular Courses Showcase */}
      <CourseShowcase
        courses={allCourses}
        onEnroll={(course) => {
          setSelectedCourse(course);
          setEnrollOpen(true);
        }}
      />

      {/* Achievers Showcase */}
      <AchieverShowcase achievers={achievers} />

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

      {/* Infinite Scrolling Scanner */}
      <InfiniteScrollingScanner />

      {/* Contact Form */}
      <ContactForm />

      <Footer />
    </div>
  );
};

export default Index;
