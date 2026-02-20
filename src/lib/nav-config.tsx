import { ReactNode } from "react";
import {
  ClipboardList,
  UserPlus,
  Users,
  LayoutPanelLeft,
  BookOpen,
  UserCheck,
  Trophy,
  CalendarCheck,
  IndianRupee,
  FileText,
  FileCheck2,
  Presentation,
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
    icon: React.createElement(Presentation, { className: "h-4 w-4" }),
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
    label: "Tests",
    href: "/admin/marks",
    icon: React.createElement(FileText, { className: "h-4 w-4" }),
  },
  {
    label: "Rankings",
    href: "/admin/rankings",
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
    icon: React.createElement(FileCheck2, { className: "h-4 w-4" }),
  },
  {
    label: "Slow Learners",
    href: "/admin/slow-learners",
    icon: React.createElement(Users, { className: "h-4 w-4" }),
  },
];

export const studentNavItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/student",
    icon: React.createElement(ClipboardList, { className: "h-4 w-4" }),
  },
  {
    label: "Marks",
    href: "/student/marks",
    icon: React.createElement(BookOpen, { className: "h-4 w-4" }),
  },
  {
    label: "Attendance",
    href: "/student/attendance",
    icon: React.createElement(CalendarCheck, { className: "h-4 w-4" }),
  },
  {
    label: "Notes",
    href: "/student/notes",
    icon: React.createElement(FileText, { className: "h-4 w-4" }),
  },
  {
    label: "Rankings",
    href: "/student/rankings",
    icon: React.createElement(Trophy, { className: "h-4 w-4" }),
  },
  {
    label: "Payments",
    href: "/student/payments",
    icon: React.createElement(IndianRupee, { className: "h-4 w-4" }),
  },
];

export const teacherNavItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/teacher",
    icon: React.createElement(ClipboardList, { className: "h-4 w-4" }),
  },
  {
    label: "Upload Marks",
    href: "/teacher/marks",
    icon: React.createElement(BookOpen, { className: "h-4 w-4" }),
  },
  {
    label: "Upload Notes",
    href: "/teacher/notes",
    icon: React.createElement(FileText, { className: "h-4 w-4" }),
  },
  {
    label: "Rankings",
    href: "/teacher/rankings",
    icon: React.createElement(Trophy, { className: "h-4 w-4" }),
  },
  {
    label: "Slow Learners",
    href: "/teacher/slow-learners",
    icon: React.createElement(Users, { className: "h-4 w-4" }),
  },
];
