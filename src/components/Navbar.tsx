import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import LogoImg from "@/assets/LogoFinal.png";

const Navbar = () => {
  const navigate = useNavigate();
  const [isClassroomDropdownOpen, setIsClassroomDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${isScrolled
        ? "bg-white/95 backdrop-blur-md border-slate-200 py-0 shadow-md"
        : "bg-background/50 backdrop-blur-sm border-transparent py-2"
        }`}
    >
      <div className="container mx-auto grid grid-cols-3 items-center h-16 px-4">
        {/* Left: Logo */}
        <div className="flex justify-start">
          <Link to="/" className="flex items-center gap-2">
            <img
              src={LogoImg}
              alt="Vidyastara logo"
              className="h-14 w-14 object-cover"
              loading="lazy"
            />
            <span className="font-heading text-xl font-bold text-slate-900 whitespace-nowrap">
              Vidyastara
            </span>
          </Link>
        </div>

        {/* Center: Navigation Links */}
        <div className="flex justify-center flex-1">
          <div className="flex items-center gap-8">
            <div className="relative">
              <button
                onClick={() =>
                  setIsClassroomDropdownOpen(!isClassroomDropdownOpen)
                }
                className="flex items-center gap-1 font-semibold transition-colors text-slate-700 hover:text-primary whitespace-nowrap"
              >
                Classroom Courses
                <ChevronDown
                  className={`size-4 transition-transform ${isClassroomDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isClassroomDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50"
                >
                  {[
                    "JEE",
                    "NEET",
                    "CET",
                    "Class 1-4",
                    "Class 5-6",
                    "Class 7-8",
                    "Class 9-10",
                  ].map((item) => (
                    <button
                      key={item}
                      onClick={() => {
                        setIsClassroomDropdownOpen(false);
                        navigate(`/enroll/${item}`);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                    >
                      {item}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
            <a
              href="#announcements"
              className="text-sm font-semibold transition-colors text-slate-700 hover:text-primary whitespace-nowrap"
            >
              Announcements
            </a>
            <a
              href="#achievers"
              className="text-sm font-semibold transition-colors text-slate-700 hover:text-primary whitespace-nowrap"
            >
              Achievers
            </a>
            <Link
              to="/results"
              className="text-sm font-semibold transition-colors text-slate-700 hover:text-primary whitespace-nowrap"
            >
              Results
            </Link>
          </div>
        </div>

        {/* Right: Login Button */}
        <div className="flex justify-end">
          <Button onClick={() => navigate("/login")} size="sm">
            Login
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
