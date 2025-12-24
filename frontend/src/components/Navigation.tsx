import { Link, useLocation } from "react-router-dom";

const Navigation = () => {
  const location = useLocation();

  const links = [
    { path: "/", label: "Dashboard" },
    { path: "/log", label: "Log" },
    { path: "/weekly", label: "Weekly" },
    { path: "/systems", label: "Systems" },
  ];

  return (
    <nav className="border-b border-border bg-card">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <span className="text-foreground font-mono text-sm font-bold tracking-wider">
            DISCIPLINE_OS
          </span>
          <div className="flex gap-1">
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
    </nav>
  );
};

export default Navigation;
