import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Achiever } from "@/hooks/use-achievers";
import LogoImg from "@/assets/Backgroundless.png";

interface AchieverShowcaseProps {
  achievers: Achiever[];
}

const AchieverCard = ({ achiever }: { achiever: Achiever }) => (
  <div className="min-w-[280px] md:min-w-[320px] bg-white rounded-[2rem] border border-slate-100 p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-500 relative overflow-hidden group/card mx-4 hover:-translate-y-2">
    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-accent opacity-0 group-hover/card:opacity-100 transition-opacity" />

    {achiever.rank <= 3 && (
      <div className="absolute top-4 right-4 animate-float">
        <div className="gradient-primary rounded-full p-2 shadow-primary">
          <Star className="h-4 w-4 text-primary-foreground" />
        </div>
      </div>
    )}

    <div className="w-28 h-28 rounded-full bg-gradient-to-br from-indigo-50 to-amber-50 flex items-center justify-center mx-auto mb-6 p-1 border-4 border-white shadow-xl group-hover/card:scale-105 transition-transform duration-500">
      {achiever.imageUrl ? (
        <img
          src={achiever.imageUrl}
          alt={achiever.name}
          className="w-full h-full object-cover rounded-full"
        />
      ) : (
        <img
          src={LogoImg}
          alt="Vidyastara logo"
          className="h-10 w-10 object-cover opacity-40"
        />
      )}
    </div>

    <h3 className="font-heading text-2xl font-extrabold mb-1 text-slate-900">{achiever.name}</h3>
    <p className="text-slate-500 font-medium mb-4">{achiever.class}</p>

    <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl py-3 px-4 border border-primary/5">
      <p className="text-sm text-primary font-bold flex items-center justify-center gap-2">
        Average Score: {achiever.avg.toFixed(1)}%
      </p>
    </div>

    <div className="mt-4 inline-flex items-center justify-center w-10 h-10 rounded-full bg-muted font-heading font-bold text-sm">
      #{achiever.rank}
    </div>
  </div>
);

const MarqueeRow = ({
  achievers,
  speed = 40,
}: {
  achievers: Achiever[];
  speed?: number;
}) => {
  // Triple the items to ensure seamless scroll even for small lists
  const duplicatedAchievers = [...achievers, ...achievers, ...achievers];

  return (
    <div className="group flex overflow-hidden py-4 select-none">
      <style>
        {`
          @keyframes achiever-marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-33.33%); }
          }
          .achiever-marquee-animate {
            animation: achiever-marquee ${speed}s linear infinite;
          }
          .group:hover .achiever-marquee-animate {
            animation-play-state: paused;
          }
        `}
      </style>
      <div className="flex achiever-marquee-animate">
        {duplicatedAchievers.map((achiever, idx) => (
          <AchieverCard key={`${achiever.id}-${idx}`} achiever={achiever} />
        ))}
      </div>
    </div>
  );
};

const CATEGORIES = [
  { id: "ALL", label: "All Stars", subs: [] },
  {
    id: "COMPETITIVE",
    label: "Competitive Exams",
    subs: [
      { id: "NEET", label: "NEET" },
      { id: "JEE", label: "JEE" },
      { id: "KCET", label: "KCET" },
    ],
  },
  {
    id: "BOARD",
    label: "Board Exams",
    subs: [
      { id: "CLASS_10", label: "Class 10" },
      { id: "CLASS_12", label: "Class 12" },
    ],
  },
  {
    id: "SCHOOL",
    label: "Foundation",
    subs: [
      { id: "CLASS_9", label: "Class 9" },
      { id: "CLASS_8", label: "Class 8" },
    ],
  },
];

const AchieverShowcase = ({ achievers }: AchieverShowcaseProps) => {
  const [activeParent, setActiveParent] = useState<string>("ALL");
  const [activeSub, setActiveSub] = useState<string | null>(null);

  const filteredAchievers = useMemo(() => {
    if (activeParent === "ALL") return achievers;

    const parentCategory = CATEGORIES.find((c) => c.id === activeParent);
    if (!parentCategory) return achievers;

    // If a specific sub-category is selected, filter by it
    if (activeSub) {
      return achievers.filter((a) => a.category === activeSub);
    }

    // Otherwise, filter by all sub-categories of the parent
    const subIds = parentCategory.subs.map((s) => s.id);
    return achievers.filter((a) => subIds.includes(a.category));
  }, [achievers, activeParent, activeSub]);

  const handleParentChange = (parentId: string) => {
    setActiveParent(parentId);
    setActiveSub(null); // Reset sub-category when parent changes
  };

  const currentSubs = CATEGORIES.find((c) => c.id === activeParent)?.subs || [];

  return (
    <section
      id="achievers"
      className="py-24 bg-white relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 px-6 py-2 text-sm font-bold rounded-full">
            Meet our stars ✨
          </Badge>
          <h2 className="text-4xl md:text-6xl font-heading font-extrabold mb-8 text-slate-900 tracking-tight">
            Our Top <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Performers</span>
          </h2>

          {/* Parent Category Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleParentChange(cat.id)}
                className={`px-8 py-3.5 rounded-full font-bold transition-all duration-300 ${activeParent === cat.id
                    ? "bg-primary text-white shadow-xl shadow-primary/25 scale-105"
                    : "bg-slate-50 border border-slate-200 text-slate-600 hover:bg-white hover:shadow-md"
                  }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Sub Categories (Animated) */}
          <AnimatePresence mode="wait">
            {currentSubs.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-wrap justify-center gap-2 mb-10"
              >
                <button
                  onClick={() => setActiveSub(null)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${activeSub === null
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-transparent text-muted-foreground hover:bg-muted"
                    }`}
                >
                  All {CATEGORIES.find((c) => c.id === activeParent)?.label}
                </button>
                {currentSubs.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => setActiveSub(sub.id)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${activeSub === sub.id
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-transparent text-muted-foreground hover:bg-muted"
                      }`}
                  >
                    {sub.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Auto-scrolling Marquee */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeParent}-${activeSub}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
          >
            {filteredAchievers.length > 0 ? (
              <MarqueeRow
                achievers={filteredAchievers}
                speed={activeParent === "ALL" ? 40 : 25}
              />
            ) : (
              <div className="text-center py-20 bg-card rounded-2xl border border-dashed border-border mx-auto max-w-4xl">
                <p className="text-muted-foreground">
                  Stay tuned! Results for this category will be updated soon.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default AchieverShowcase;
