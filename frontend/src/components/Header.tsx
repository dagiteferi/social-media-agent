import { Link, useLocation } from "react-router-dom";
import { BarChart3, Layout } from "lucide-react"; // Removed User icon
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Header = () => {
  const location = useLocation();

  const navItems = [
    { label: "Dashboard", path: "/", icon: Layout },
    { label: "Analytics", path: "/analytics", icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80"> {/* Ensure border-b is visible */}
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary shadow-md transition-transform group-hover:scale-105"> {/* Increased size */}
              <span className="text-xl font-bold text-primary-foreground">E</span> {/* Increased font size */}
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> {/* Increased font size */}
              ESMA
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant="ghost" // Keep ghost variant, but add more styling
                    className={cn(
                      "gap-2 transition-colors text-base px-4 py-2 rounded-md", // Added text-base, px, py, rounded-md
                      isActive
                        ? "bg-primary text-primary-foreground hover:bg-primary/90" // Stronger active state
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon className="h-5 w-5" /> {/* Increased icon size */}
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Removed: Profile Button */}
      </div>
    </header>
  );
};