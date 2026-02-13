import { ReactNode } from "react";
import {
  ClipboardList,
  UserPlus,
  Users,
  GraduationCap,
  LayoutPanelLeft,
  BookOpen,
  UserCheck,
  Trophy,
  CalendarCheck,
  IndianRupee,
  FileText,
} from "lucide-react";
import React from "react";

export interface NavItem {
  label: string;
  href?: string;
  icon: ReactNode;
  children?: { label: string; href: string; icon: ReactNode }[];
}

export const adminNavItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: React.createElement(ClipboardList, { className: "h-4 w-4" }),
  },
  {
    label: "Enrollments",
    href: "/admin/enrollments",
    icon: React.createElement(UserPlus, { className: "h-4 w-4" }),
  },
  {
    label: "Students",
    href: "/admin/students",
    icon: React.createElement(Users, { className: "h-4 w-4" }),
  },
  {
    label: "Teachers",
    href: "/admin/teachers",
    icon: React.createElement(GraduationCap, { className: "h-4 w-4" }),
  },
  {
    label: "Attendance",
    href: "/admin/attendance",
    icon: React.createElement(CalendarCheck, { className: "h-4 w-4" }),
  },
  {
    label: "Landing Page",
    icon: React.createElement(LayoutPanelLeft, { className: "h-4 w-4" }),
    children: [
      {
        label: "Courses",
        href: "/admin/courses",
        icon: React.createElement(BookOpen, { className: "h-4 w-4" }),
      },
      {
        label: "Announcements",
        href: "/admin/announcements",
        icon: React.createElement(Users, { className: "h-4 w-4" }),
      },
      {
        label: "Achievers",
        href: "/admin/achievers",
        icon: React.createElement(UserCheck, { className: "h-4 w-4" }),
      },
    ],
  },
  {
    label: "Marks & Ranking",
    href: "/admin/marks",
    icon: React.createElement(Trophy, { className: "h-4 w-4" }),
  },
  {
    label: "Payments",
    href: "/admin/payments",
    icon: React.createElement(IndianRupee, { className: "h-4 w-4" }),
  },
  {
    label: "Notes",
    href: "/admin/notes",
    icon: React.createElement(FileText, { className: "h-4 w-4" }),
  },
];
