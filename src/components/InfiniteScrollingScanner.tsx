import { motion } from "framer-motion";
import {
  BookOpen,
  MessageSquare,
  Video,
  FileText,
  Trophy,
  Clock,
  Target,
  Lightbulb,
  Brain,
  History,
  PenTool,
  Users,
  Compass,
  Zap,
  CheckCircle2,
} from "lucide-react";

interface MarqueeItem {
  icon: any;
  label: string;
  color: string;
}

const items1: MarqueeItem[] = [
  { icon: Target, label: "Mock Tests", color: "text-orange-500" },
  { icon: Brain, label: "Flashcards", color: "text-pink-500" },
  { icon: Compass, label: "Career Guidance", color: "text-amber-500" },
  { icon: Video, label: "Live Classes", color: "text-blue-500" },
  {
    icon: MessageSquare,
    label: "24x7 Doubt Solving",
    color: "text-emerald-500",
  },
];

const items2: MarqueeItem[] = [
  { icon: BookOpen, label: "Improvement Book", color: "text-cyan-500" },
  { icon: History, label: "PYQ Practice", color: "text-teal-500" },
  { icon: Zap, label: "Meditation Session", color: "text-purple-500" },
  { icon: FileText, label: "Revision Notes", color: "text-rose-500" },
  { icon: Target, label: "PYQ Tests", color: "text-orange-600" },
  { icon: Users, label: "Mentorship", color: "text-blue-600" },
];

const items3: MarqueeItem[] = [
  { icon: PenTool, label: "Subjective Tests", color: "text-indigo-500" },
  { icon: CheckCircle2, label: "Topic-wise Tests", color: "text-green-500" },
  { icon: Lightbulb, label: "Important Q's", color: "text-yellow-500" },
  { icon: Clock, label: "Regular Homework", color: "text-slate-500" },
  { icon: Video, label: "Topic-wise Videos", color: "text-sky-500" },
];

const MarqueeRow = ({
  items,
  direction = "left",
  speed = 60,
}: {
  items: MarqueeItem[];
  direction?: "left" | "right";
  speed?: number;
}) => {
  const duplicatedItems = [
    ...items,
    ...items,
    ...items,
    ...items,
    ...items,
    ...items,
  ];

  return (
    <div className="group flex overflow-hidden py-3 select-none">
      <style>
        {`
          @keyframes marquee-left {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @keyframes marquee-right {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(0); }
          }
          .marquee-animate-left {
            animation: marquee-left ${speed}s linear infinite;
          }
          .marquee-animate-right {
            animation: marquee-right ${speed}s linear infinite;
          }
          .group:hover .marquee-animate-left,
          .group:hover .marquee-animate-right {
            animation-play-state: paused;
          }
        `}
      </style>
      <div
        className={`flex gap-4 pr-4 whitespace-nowrap ${
          direction === "left"
            ? "marquee-animate-left"
            : "marquee-animate-right"
        }`}
      >
        {duplicatedItems.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 bg-card border border-border px-6 py-3 rounded-full shadow-sm hover:shadow-md transition-shadow cursor-default"
          >
            <div className={`${item.color} bg-current/10 p-1.5 rounded-lg`}>
              <item.icon className="h-4 w-4" />
            </div>
            <span className="font-heading font-medium text-foreground">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const InfiniteScrollingScanner = () => {
  return (
    <section className="py-20 bg-muted/30 overflow-hidden">
      <div className="container mx-auto px-4 mb-12 text-center">
        <h2 className="text-3xl md:text-4xl font-heading font-bold">
          Everything you need to{" "}
          <span className="text-primary italic">Succeed</span>
        </h2>
      </div>

      <div className="space-y-4">
        <MarqueeRow items={items1} direction="left" speed={50} />
        <MarqueeRow items={items2} direction="right" speed={60} />
        <MarqueeRow items={items3} direction="left" speed={55} />
      </div>
    </section>
  );
};

export default InfiniteScrollingScanner;
