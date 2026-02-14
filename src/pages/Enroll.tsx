import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import EnrollmentDialog from "@/components/EnrollmentDialog";
import { Course } from "@/lib/mock-data";
import { BookOpen, Clock, IndianRupee } from "lucide-react";
import useCourses from "@/hooks/use-courses";
import LogoImg from "@/assets/Backgroundless.png";

const Enroll = () => {
  const { classId } = useParams<{ classId?: string }>();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [enrollOpen, setEnrollOpen] = useState(false);
  const { courses } = useCourses();
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);

  useEffect(() => {
    if (courses.length > 0) {
      // Ensure courses are loaded before filtering
      if (classId) {
        setFilteredCourses(courses.filter((c) => c.class === classId));
      } else {
        setFilteredCourses(courses);
      }
    }
  }, [classId]);

  return (
    <div className="min-h-screen bg-background pt-20">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-3">
            <BookOpen className="h-3 w-3 mr-1" />{" "}
            {classId ? `${classId} Courses` : "All Courses"}
          </Badge>
          <h1 className="text-3xl md:text-5xl font-heading font-bold">
            {classId
              ? `Available Courses for ${classId}`
              : "Explore Our Programs"}
          </h1>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Find the perfect course to excel in your academic journey. Our
            programs are designed by experts to provide high-quality education.
          </p>
        </div>

        {filteredCourses.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course, i) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-xl border border-border shadow-card hover:shadow-elevated transition-all group"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant="secondary">{course.class}</Badge>
                    <Badge variant="outline" className="text-xs">
                      {course.batch}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-heading font-bold group-hover:text-primary transition-colors">
                    {course.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {course.description}
                  </p>
                  <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" /> {course.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <IndianRupee className="h-3.5 w-3.5" /> ₹
                      {course.fee.toLocaleString()}
                    </span>
                  </div>
                  <Button
                    className="w-full mt-4"
                    onClick={() => {
                      setSelectedCourse(course);
                      setEnrollOpen(true);
                    }}
                  >
                    Enroll Now
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <img
              src={LogoImg}
              alt="Vidyastara logo"
              className="h-12 w-12 mx-auto mb-4 opacity-20"
            />
            <h3 className="text-xl font-medium text-muted-foreground">
              No courses found for this category yet.
            </h3>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => window.history.back()}
            >
              Go Back
            </Button>
          </div>
        )}
      </div>

      <EnrollmentDialog
        course={selectedCourse}
        open={enrollOpen}
        onClose={() => setEnrollOpen(false)}
      />
    </div>
  );
};

export default Enroll;
