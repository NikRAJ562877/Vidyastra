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
  <div className="min-w-[280px] md:min-w-[320px] bg-card rounded-2xl border border-border p-8 text-center shadow-card hover:shadow-elevated transition-all relative overflow-hidden group/card mx-3">
    <div className="absolute top-0 left-0 w-full h-1 gradient-primary opacity-0 group-hover/card:opacity-100 transition-opacity" />

    {achiever.rank <= 3 && (
      <div className="absolute top-4 right-4 animate-float">
        <div className="gradient-primary rounded-full p-2 shadow-primary">
          <Star className="h-4 w-4 text-primary-foreground" />
        </div>
      </div>
    )}

    <div className="w-24 h-24 rounded-full gradient-accent flex items-center justify-center mx-auto mb-6 p-1 border-4 border-background shadow-lg">
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

    <h3 className="font-heading text-xl font-bold mb-1">{achiever.name}</h3>
    <p className="text-muted-foreground mb-4">{achiever.class}</p>

    <div className="gradient-primary rounded-xl py-3 px-4 shadow-primary">
      <p className="text-sm text-primary-foreground font-bold flex items-center justify-center gap-2">
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

const AchieverShowcase = ({ achievers }: AchieverShowcaseProps) => {
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const tabs = ["ALL", "NEET", "JEE", "CLASSES 6-10"];

  const filteredAchievers = useMemo(() => {
    if (activeTab === "ALL") return achievers;
    return achievers.filter((a) => a.category === activeTab);
  }, [achievers, activeTab]);

  return (
    <section
      id="achievers"
      className="py-24 bg-muted/20 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <Badge className="mb-4 gradient-primary text-primary-foreground border-0 px-4 py-1.5 text-sm">
            Meet our stars ✨
          </Badge>
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-8">
            Our Top Performers
          </h2>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-3 rounded-xl font-bold transition-all ${
                  activeTab === tab
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105"
                    : "bg-background border border-border text-muted-foreground hover:bg-muted"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Auto-scrolling Marquee */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
          >
            {filteredAchievers.length > 0 ? (
              <MarqueeRow
                achievers={filteredAchievers}
                speed={activeTab === "ALL" ? 40 : 25}
              />
            ) : (
              <div className="text-center py-20 bg-card rounded-2xl border border-dashed border-border">
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
