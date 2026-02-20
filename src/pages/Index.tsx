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
      <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-[#2563eb] border-0">
        <div className="absolute inset-0">
          <img
            src={heroBg}
            alt="Students studying"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#2563eb]/20" />
        </div>
        <div className="container mx-auto px-4 relative z-10 pt-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <Badge className="mb-4 bg-white/20 text-white border-0 px-4 py-1.5 text-sm backdrop-blur-sm">
              Admissions Open 2026-27
            </Badge>
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-white leading-tight">
              Shape Your Future with{" "}
              <span className="text-yellow-300">Vidyastara</span>
            </h1>
            <p className="mt-4 text-lg text-blue-50 max-w-lg">
              Join our premier coaching institute for personalized learning,
              expert faculty, and proven results.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50"
                onClick={() => navigate("/enroll")}
              >
                Explore Courses <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white/10"
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
      <section className="bg-[#2563eb] py-9 border-0">
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
      <section
        id="announcements"
        className="py-20 bg-gradient-to-b from-slate-50 to-white"
      >
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
