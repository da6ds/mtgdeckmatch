import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { LearnArticle } from "@/data/learn-articles";

interface LearnArticleCardProps {
  article: LearnArticle;
  onClick: () => void;
}

export const LearnArticleCard = ({ article, onClick }: LearnArticleCardProps) => {
  return (
    <Card
      className="group cursor-pointer hover:shadow-card-hover transition-all duration-300 border-2 hover:border-primary/50 h-full"
      onClick={onClick}
    >
      <CardContent className="p-3 flex flex-col h-full space-y-3">
        {/* Icon */}
        <div className="text-2xl group-hover:scale-110 transition-transform duration-300">
          {article.icon}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col space-y-1.5">
          {/* Title */}
          <h3 className="text-base font-bold text-foreground leading-tight">
            {article.title}
          </h3>

          {/* Subtitle */}
          <p className="text-xs text-muted-foreground leading-relaxed flex-1 line-clamp-2">
            {article.subtitle}
          </p>
        </div>

        {/* Read Time Badge */}
        <div className="pt-1.5 border-t border-border/50">
          <Badge variant="secondary" className="text-xs">
            {article.readTime}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
