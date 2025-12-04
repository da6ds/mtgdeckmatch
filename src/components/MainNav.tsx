import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, Wand2, BookOpen, Library, Menu, X } from "lucide-react";
import { useState } from "react";

export const MainNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    {
      label: "DISCOVER",
      path: "/discover",
      icon: <Sparkles className="w-4 h-4" />,
      description: "Browse by theme",
    },
    {
      label: "PLAY",
      path: "/play",
      icon: <Wand2 className="w-4 h-4" />,
      description: "Find your deck",
    },
    {
      label: "BROWSE",
      path: "/browse",
      icon: <Library className="w-4 h-4" />,
      description: "All decks",
    },
    {
      label: "LEARN",
      path: "/learn",
      icon: <BookOpen className="w-4 h-4" />,
      description: "New to Magic?",
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="border-b border-border/50 bg-background/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Site Name */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold text-foreground hidden sm:inline">
              Discovering Magic: The Gathering
            </span>
            <span className="text-xl font-bold text-foreground sm:hidden">
              MTG
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant={isActive(item.path) ? "default" : "ghost"}
                onClick={() => navigate(item.path)}
                className="flex items-center gap-2"
              >
                {item.icon}
                <span className="font-semibold">{item.label}</span>
              </Button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-accent transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-border/50 mt-2 pt-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent"
                }`}
              >
                {item.icon}
                <div className="text-left">
                  <div className="font-semibold">{item.label}</div>
                  <div className="text-sm opacity-80">{item.description}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};
