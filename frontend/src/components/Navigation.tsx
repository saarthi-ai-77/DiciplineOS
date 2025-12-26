import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Plus, BarChart2, Cpu } from "lucide-react";

const Navigation = () => {
  const location = useLocation();

  const links = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/log", label: "Log", icon: Plus },
    { path: "/weekly", label: "Weekly", icon: BarChart2 },
    { path: "/systems", label: "Systems", icon: Cpu },
  ];

  return (
    <>
      {/* Top Header - Always visible for branding */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <span className="text-foreground font-mono text-sm font-black tracking-tighter">
              DISCIPLINE<span className="text-accent">OS</span>
            </span>

            {/* Desktop Links - Hidden on mobile */}
            <div className="hidden md:flex gap-1">
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 text-xs font-mono uppercase tracking-wider transition-colors ${location.pathname === link.path
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Bottom Navigation - Mobile Only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border flex justify-around items-center h-16 px-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors ${isActive ? "text-accent" : "text-muted-foreground"
                }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "animate-in zoom-in-75 duration-300" : ""}`} />
              <span className="text-[10px] font-mono uppercase tracking-tighter">
                {link.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Spacer for bottom nav on mobile */}
      <div className="md:hidden h-16" />
    </>
  );
};

export default Navigation;
