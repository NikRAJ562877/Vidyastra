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
    <section className="py-24 bg-background relative overflow-hidden border-0">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4">
              Courses chosen by{" "}
              <span className="text-primary italic">our champions</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Explore our most popular programs designed to help you ace
              competitive exams with expert guidance.
            </p>
          </div>
          <Button
            variant="outline"
            className="rounded-full px-8 py-6 border-primary text-primary hover:bg-primary hover:text-white transition-all group"
            onClick={() => navigate("/enroll")}
          >
            View all Courses{" "}
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        <Tabs
          defaultValue="JEE"
          className="w-full"
          onValueChange={setActiveTab}
        >
          <TabsList className="bg-muted/50 p-1.5 rounded-2xl mb-12 h-auto flex-wrap justify-start inline-flex">
            {categories.map((cat) => (
              <TabsTrigger
                key={cat}
                value={cat}
                className="rounded-xl px-8 py-3 text-base font-bold data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-lg transition-all"
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
