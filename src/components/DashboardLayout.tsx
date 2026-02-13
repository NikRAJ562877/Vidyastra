import { ReactNode, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GraduationCap, LogOut, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
}

interface Props {
  children: ReactNode;
  title: string;
  navItems: NavItem[];
  userName: string;
  userRole: string;
}

const DashboardLayout = ({ children, title, navItems, userName, userRole }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('auth_user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar text-sidebar-foreground flex flex-col transition-transform duration-300 lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center gap-2 p-4 border-b border-sidebar-border">
          <div className="gradient-primary rounded-lg p-2">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-heading text-base font-bold">Vidyastara</span>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map(item => (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                location.pathname === item.href
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <div className="text-sm mb-3">
            <p className="font-semibold">{userName}</p>
            <p className="text-sidebar-foreground/60 text-xs capitalize">{userRole}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground">
            <LogOut className="h-4 w-4 mr-2" /> Logout
          </Button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-foreground/20 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1 lg:ml-64">
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border px-4 h-14 flex items-center gap-4">
          <button className="lg:hidden text-foreground" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="font-heading text-lg font-bold">{title}</h1>
        </header>
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
