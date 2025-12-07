import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, Wand2, BookOpen, Menu, X, Heart, Home } from "lucide-react";
import { useState, useEffect } from "react";
import { useSavedDecks } from "@/contexts/SavedDecksContext";
import { SavedDecksDrawer } from "@/components/SavedDecksDrawer";

export const MainNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [savedDrawerOpen, setSavedDrawerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { savedDeckIds } = useSavedDecks();

  // Track scroll for shadow effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      label: "LEARN",
      path: "/learn",
      icon: <BookOpen className="w-4 h-4" />,
      description: "New to Magic?",
    },
  ];

  const isActive = (path: string) => location.pathname === path;
  const savedCount = savedDeckIds.length;

  return (
    <>
      <nav className={`border-b border-border/50 bg-background/95 backdrop-blur-sm sticky top-0 z-50 transition-shadow ${isScrolled ? 'shadow-md' : ''}`}>
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
              Discovering Magic
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

            {/* Saved Decks Button - Desktop */}
            <button
              onClick={() => setSavedDrawerOpen(true)}
              className="relative p-2 rounded-lg hover:bg-muted transition-colors ml-2"
              aria-label="Saved decks"
            >
              <Heart className={`w-5 h-5 ${savedCount > 0 ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
              {savedCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                  {savedCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile: Saved Decks + Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            {/* Saved Decks Button - Mobile */}
            <button
              onClick={() => setSavedDrawerOpen(true)}
              className="relative p-2"
              aria-label="Saved decks"
            >
              <Heart className={`w-5 h-5 ${savedCount > 0 ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
              {savedCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs w-4 h-4 rounded-full flex items-center justify-center font-medium">
                  {savedCount}
                </span>
              )}
            </button>

            {/* Hamburger Menu Button */}
            <button
              className="p-2 rounded-md hover:bg-accent transition-colors"
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
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-border/50 mt-2 pt-4 space-y-2">
            {/* HOME link - Mobile only */}
            <button
              onClick={() => {
                navigate("/");
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                location.pathname === "/"
                  ? "bg-primary/10 text-primary font-semibold border-l-4 border-primary"
                  : "hover:bg-accent"
              }`}
            >
              <Home className="w-5 h-5" />
              <div className="text-left">
                <div className="font-semibold">HOME</div>
                <div className="text-sm opacity-80">Back to start</div>
              </div>
            </button>

            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? "bg-primary/10 text-primary font-semibold border-l-4 border-primary"
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

    {/* Saved Decks Drawer */}
    <SavedDecksDrawer isOpen={savedDrawerOpen} onOpenChange={setSavedDrawerOpen} />
    </>
  );
};
