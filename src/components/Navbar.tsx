import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, Menu, X, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import LogoImg from "@/assets/Backgroundless.png";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const [isClassroomDropdownOpen, setIsClassroomDropdownOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#3b2545] text-white backdrop-blur-xl">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <img
            src={LogoImg}
            alt="Vidyastara logo"
            className="h-14 w-14 object-cover"
            loading="lazy"
          />
          <span className="font-heading text-lg font-bold text-white">
            Vidyastara
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          <div className="relative">
            <button
              onClick={() =>
                setIsClassroomDropdownOpen(!isClassroomDropdownOpen)
              }
              className="flex items-center gap-1 text-white hover:text-gray-200 transition-colors"
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
                className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50"
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
            className="text-sm font-medium text-white hover:text-gray-200 transition-colors"
          >
            Announcements
          </a>
          <a
            href="#achievers"
            className="text-sm font-medium text-white hover:text-gray-200 transition-colors"
          >
            Achievers
          </a>
          <Link
            to="/results"
            className="text-sm font-medium text-white hover:text-gray-200 transition-colors"
          >
            Results
          </Link>
          <Button onClick={() => navigate("/login")} size="sm">
            Login
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-[#3b2545] px-4 pb-4 space-y-3">
          <a
            href="#courses"
            className="block text-sm font-medium text-white"
            onClick={() => setMobileOpen(false)}
          >
            Courses
          </a>
          <a
            href="#announcements"
            className="block text-sm font-medium text-white"
            onClick={() => setMobileOpen(false)}
          >
            Announcements
          </a>
          <a
            href="#achievers"
            className="block text-sm font-medium text-white"
            onClick={() => setMobileOpen(false)}
          >
            Achievers
          </a>
          <Link
            to="/results"
            className="block text-sm font-medium text-white"
            onClick={() => setMobileOpen(false)}
          >
            Results
          </Link>
          <Button
            onClick={() => {
              navigate("/login");
              setMobileOpen(false);
            }}
            size="sm"
            className="w-full"
          >
            Login
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
