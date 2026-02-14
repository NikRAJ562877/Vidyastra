import { ReactNode, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import LogoImg from "@/assets/Backgroundless.png";

interface NavItem {
  label: string;
  href?: string;
  icon: ReactNode;
  children?: { label: string; href: string; icon: ReactNode }[];
}

type NavChild = NonNullable<NavItem["children"]>[number];

type NavLinkProps = {
  href: string;
  icon: ReactNode;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
};

type NavGroupProps = {
  item: NavItem;
  activePath: string;
  onNav?: () => void;
};

interface Props {
  children: ReactNode;
  title: string;
  navItems: NavItem[];
  userName: string;
  userRole: string;
}

const DashboardLayout = ({
  children,
  title,
  navItems,
  userName,
  userRole,
}: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("auth_user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar text-sidebar-foreground flex flex-col transition-transform duration-300 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center gap-2 p-4 border-b border-sidebar-border h-16">
          <img
            src={LogoImg}
            alt="Vidyastara logo"
            className="h-10 w-10 object-cover"
          />
          <span className="font-heading text-lg font-bold text-white">
            Vidyastara
          </span>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <div key={item.label}>
              {item.children ? (
                <NavGroup
                  item={item}
                  activePath={location.pathname}
                  onNav={() => setSidebarOpen(false)}
                />
              ) : (
                <NavLink
                  href={item.href!}
                  icon={item.icon}
                  label={item.label}
                  isActive={location.pathname === item.href}
                  onClick={() => setSidebarOpen(false)}
                />
              )}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <div className="text-sm mb-3">
            <p className="font-semibold">{userName}</p>
            <p className="text-sidebar-foreground/60 text-xs capitalize">
              {userRole}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="w-full justify-start text-sidebar-foreground/70 hover:text-red-400 hover:bg-red-400/10 transition-colors"
          >
            <LogOut className="h-4 w-4 mr-2" /> Logout
          </Button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 lg:ml-64">
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border px-4 h-14 flex items-center gap-4">
          <button
            className="lg:hidden text-foreground"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="font-heading text-lg font-bold">{title}</h1>
        </header>
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
};

const NavLink = ({
  href,
  icon,
  label,
  isActive,
  onClick,
  className,
}: NavLinkProps) => (
  <Link
    to={href}
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
      isActive
        ? "bg-sidebar-accent text-sidebar-primary"
        : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
      className,
    )}
  >
    {icon}
    {label}
  </Link>
);

const NavGroup = ({ item, activePath, onNav }: NavGroupProps) => {
  const isGroupActive = item.children?.some(
    (child: NavChild) => activePath === child.href,
  );
  const storageKey = `nav_group_expanded_${item.label}`;

  const [isExpanded, setIsExpanded] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved !== null) return saved === "true";
    return false; // Start collapsed on first visit
  });

  useEffect(() => {
    localStorage.setItem(storageKey, isExpanded.toString());
  }, [isExpanded, storageKey]);

  return (
    <div className="space-y-1">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
          isGroupActive && "text-sidebar-primary",
        )}
      >
        <div className="flex items-center gap-3">
          {item.icon}
          {item.label}
        </div>
        <svg
          className={cn(
            "h-4 w-4 transition-transform",
            isExpanded && "rotate-180",
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isExpanded && (
        <div className="pl-9 space-y-1">
          {item.children?.map((child: NavChild) => (
            <Link
              key={child.href}
              to={child.href}
              onClick={onNav}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                activePath === child.href
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground",
              )}
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
