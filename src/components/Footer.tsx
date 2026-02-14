import { Facebook, Twitter, Instagram, Youtube, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";
import LogoImg from "@/assets/Backgroundless.png";

const Footer = () => {
  const footerSections = [
    {
      title: "About",
      links: [
        { label: "About us", href: "#" },
        { label: "Blog", href: "#" },
        { label: "News", href: "#" },
        { label: "MyExam EduBlogs", href: "#" },
        { label: "Privacy policy", href: "#" },
        { label: "Public notice", href: "#" },
        { label: "Careers", href: "#" },
        { label: "Dhoni Inspires NEET Aspirants", href: "#" },
        { label: "Dhoni Inspires JEE Aspirants", href: "#" },
      ],
    },
    {
      title: "Help & Support",
      links: [
        { label: "Refund policy", href: "#" },
        { label: "Transfer policy", href: "#" },
        { label: "Terms & Conditions", href: "#" },
        { label: "Contact us", href: "#" },
      ],
    },
    {
      title: "Popular goals",
      links: [
        { label: "NEET Coaching", href: "/enroll/NEET" },
        { label: "JEE Coaching", href: "/enroll/JEE" },
        { label: "6th to 10th", href: "/enroll/Class 6-10" },
      ],
    },
    {
      title: "Courses",
      links: [
        { label: "Classroom Courses", href: "/enroll" },
        { label: "Online Courses", href: "/enroll" },
        { label: "Distance Learning", href: "/enroll" },
        { label: "Online Test Series", href: "#" },
        { label: "International Olympiads Online Course", href: "#" },
        { label: "NEET Test Series", href: "#" },
        { label: "JEE Test Series", href: "#" },
        { label: "JEE Main Test Series", href: "#" },
      ],
    },
    {
      title: "Centers",
      links: [
        { label: "Kota", href: "#" },
        { label: "Bangalore", href: "#" },
        { label: "Indore", href: "#" },
        { label: "Delhi", href: "#" },
        { label: "More centres", href: "#" },
      ],
    },
    {
      title: "Exam Information",
      links: [
        { label: "JEE Main", href: "#" },
        { label: "JEE Advanced", href: "#" },
        { label: "NEET UG", href: "#" },
        { label: "CBSE", href: "#" },
        { label: "NIOS", href: "#" },
        { label: "NCERT Solutions", href: "#" },
        { label: "Olympiad", href: "#" },
        { label: "NEET Previous Year Papers", href: "#" },
        { label: "NEET Sample Papers", href: "#" },
        { label: "JEE Main 2026 Percentile Predictor", href: "#" },
        { label: "JEE Main 2026 Session 1 Solutions", href: "#" },
      ],
    },
  ];

  return (
    <footer className="bg-slate-50 pt-16 pb-8 border-t border-slate-200">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-heading font-bold text-slate-900 mb-4 text-sm uppercase tracking-wider">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-slate-600 hover:text-primary transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <img
              src={LogoImg}
              alt="Vidyastara logo"
              className="h-10 w-10 object-cover"
            />
            <span className="font-heading text-xl font-bold text-slate-900">
              Vidyastara
            </span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-slate-400 hover:text-primary transition-colors"
            >
              <Facebook className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="text-slate-400 hover:text-primary transition-colors"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="text-slate-400 hover:text-primary transition-colors"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="text-slate-400 hover:text-primary transition-colors"
            >
              <Youtube className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="text-slate-400 hover:text-primary transition-colors"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </div>

          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Vidyastara Tuition. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
