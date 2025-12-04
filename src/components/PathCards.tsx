import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Wand2, BookOpen, Library, ArrowRight } from "lucide-react";

interface PathCardData {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  color: string;
}

export const PathCards = () => {
  const navigate = useNavigate();

  const paths: PathCardData[] = [
    {
      id: "discover",
      title: "Discover",
      description: "Curated lists of decks and cards",
      icon: <Sparkles className="w-12 h-12" />,
      path: "/discover",
      color: "text-purple-500",
    },
    {
      id: "play",
      title: "Play",
      description: "Find your next deck",
      icon: <Wand2 className="w-12 h-12" />,
      path: "/play",
      color: "text-blue-500",
    },
    {
      id: "browse",
      title: "Browse",
      description: "All decks and cards with filters",
      icon: <Library className="w-12 h-12" />,
      path: "/browse",
      color: "text-orange-500",
    },
    {
      id: "learn",
      title: "Learn",
      description: "Quick guide to playing MTG Commander",
      icon: <BookOpen className="w-12 h-12" />,
      path: "/learn",
      color: "text-green-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {paths.map((path) => (
        <Card
          key={path.id}
          className="group cursor-pointer hover:shadow-card-hover transition-all duration-300 border-2 hover:border-primary/50 hover:scale-105"
          onClick={() => navigate(path.path)}
        >
          <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
            {/* Icon */}
            <div className={`${path.color} group-hover:scale-110 transition-transform duration-300`}>
              {path.icon}
            </div>

            {/* Title */}
            <h3 className="text-2xl font-bold text-foreground">
              {path.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-muted-foreground leading-relaxed min-h-[60px]">
              {path.description}
            </p>

            {/* Arrow hint */}
            <div className="flex items-center gap-2 text-primary font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
