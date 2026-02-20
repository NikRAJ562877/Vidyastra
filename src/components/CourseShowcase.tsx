import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Course } from "@/lib/mock-data";
import CourseCard from "./CourseCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface CourseShowcaseProps {
  courses: Course[];
  onEnroll: (course: Course) => void;
}

const CourseShowcase = ({ courses, onEnroll }: CourseShowcaseProps) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("JEE");

  const categories = ["JEE", "NEET", "CET"];

  const filteredCourses = courses.filter(
    (c) => c.class === activeTab && c.showOnLandingPage === true,
  );

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-6xl font-heading font-extrabold mb-6 text-slate-900 leading-tight">
              Courses chosen by{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">our champions</span>
            </h2>
            <p className="text-slate-500 text-xl leading-relaxed">
              Explore our most popular programs designed to help you ace
              competitive exams with expert guidance.
            </p>
          </div>
          <Button
            size="lg"
            variant="outline"
            className="rounded-full px-10 h-14 border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-primary transition-all duration-300 shadow-md group font-bold"
            onClick={() => navigate("/enroll")}
          >
            View all Courses{" "}
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        <Tabs
          defaultValue="JEE"
          className="w-full"
          onValueChange={setActiveTab}
        >
          <TabsList className="bg-slate-100/50 p-2 rounded-[2rem] mb-12 h-auto flex-wrap justify-start inline-flex border border-slate-200/50 backdrop-blur-sm">
            {categories.map((cat) => (
              <TabsTrigger
                key={cat}
                value={cat}
                className="rounded-[1.5rem] px-10 py-4 text-lg font-bold data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-xl transition-all duration-300"
              >
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>

          <AnimatePresence mode="wait">
            <TabsContent value={activeTab} className="mt-0 outline-none">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8"
              >
                {filteredCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    onEnroll={onEnroll}
                  />
                ))}
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </div>
    </section>
  );
};

export default CourseShowcase;
