import { Course } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Calendar, Globe } from "lucide-react";
import { motion } from "framer-motion";
import LogoImg from "@/assets/LogoFinal.png"; // Updated

interface CourseCardProps {
  course: Course;
  onEnroll: (course: Course) => void;
}

const CourseCard = ({ course, onEnroll }: CourseCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-card rounded-3xl border border-border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full group"
    >
      {/* Header with Tag */}
      <div className="p-6 pb-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-primary/10 text-primary p-1.5 rounded-lg">
            <img src={LogoImg} className="h-4 w-4" />
          </div>
          <Badge
            variant="secondary"
            className="bg-primary/5 text-primary border-none font-medium px-3 py-1"
          >
            {course.tag || "Online Course"}
          </Badge>
        </div>

        <h3 className="text-xl font-heading font-bold mb-1 group-hover:text-primary transition-colors">
          {course.name}
        </h3>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
          <span className="font-medium text-foreground">
            Class: {course.class.replace("Class ", "")}
          </span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
          <span>Duration: {course.duration}</span>
        </div>
      </div>

      {/* Info Grid */}
      <div className="px-6 py-4 grid grid-cols-2 gap-y-4 border-y border-border/50 bg-muted/20">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">
            Language
          </p>
          <div className="flex items-center gap-1.5 text-sm font-medium">
            <Globe className="h-3.5 w-3.5 text-primary/60" />
            {course.language || "English"}
          </div>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">
            Started from
          </p>
          <div className="flex items-center gap-1.5 text-sm font-medium">
            <Calendar className="h-3.5 w-3.5 text-primary/60" />
            {course.startDate || "TBA"}
          </div>
        </div>
      </div>

      <div className="p-6 mt-auto">
        <Button
          className="w-full rounded-xl py-6 font-bold text-base shadow-sm hover:shadow-primary/25 transition-all"
          onClick={() => onEnroll(course)}
        >
          Enrol now
        </Button>
      </div>

      {/* Achiever Footer */}
      {course.achiever && (
        <div className="px-6 py-4 bg-muted/30 border-t border-border/50 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center overflow-hidden shrink-0">
            {course.achiever.imageUrl ? (
              <img
                src={course.achiever.imageUrl}
                alt={course.achiever.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="bg-primary/5 w-full h-full flex items-center justify-center">
                <span className="text-primary font-bold text-xs">
                  {course.achiever.name.charAt(0)}
                </span>
              </div>
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm truncate">
                {course.achiever.name}
              </span>
              <Badge
                variant="success"
                className="bg-success/10 text-success border-none text-[10px] px-1.5 py-0 h-4"
              >
                {course.achiever.rank}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground truncate">
              Chose this course | {course.achiever.achievement}
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default CourseCard;
