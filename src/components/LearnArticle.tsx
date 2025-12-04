import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BackButton } from "@/components/BackButton";
import { Lightbulb, AlertCircle, ArrowLeft } from "lucide-react";
import type { LearnArticle, ArticleSection } from "@/data/learn-articles";

interface LearnArticleProps {
  article: LearnArticle;
}

const renderSection = (section: ArticleSection, index: number) => {
  switch (section.type) {
    case 'heading':
      if (section.level === 3) {
        return (
          <h3 key={index} className="text-xl font-bold text-foreground mt-8 mb-4">
            {section.content}
          </h3>
        );
      }
      return (
        <h2 key={index} className="text-2xl font-bold text-foreground mt-10 mb-4">
          {section.content}
        </h2>
      );

    case 'paragraph':
      return (
        <p key={index} className="text-base text-foreground leading-relaxed mb-4">
          {section.content}
        </p>
      );

    case 'list':
      return (
        <div key={index} className="mb-4">
          {section.content && (
            <p className="text-base text-foreground leading-relaxed mb-2">
              {section.content}
            </p>
          )}
          <ul className="space-y-2 ml-6">
            {section.items?.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="text-primary mt-1 shrink-0">•</span>
                <span className="text-base text-foreground leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      );

    case 'tip':
      return (
        <div
          key={index}
          className="my-6 p-4 bg-blue-500/10 border-l-4 border-blue-500 rounded-r-lg"
        >
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
            <p className="text-sm text-foreground leading-relaxed">
              {section.content}
            </p>
          </div>
        </div>
      );

    case 'callout':
      return (
        <div
          key={index}
          className="my-6 p-4 bg-primary/10 border-2 border-primary/30 rounded-lg"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
            <p className="text-sm text-foreground leading-relaxed font-medium">
              {section.content}
            </p>
          </div>
        </div>
      );

    default:
      return null;
  }
};

export const LearnArticle = ({ article }: LearnArticleProps) => {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-4">
        {/* Back button */}
        <BackButton fallbackPath="/learn" className="-ml-2" />

        {/* Icon and Title */}
        <div className="space-y-3">
          <div className="text-6xl">{article.icon}</div>
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-3">
              {article.title}
            </h1>
            <p className="text-lg text-muted-foreground">
              {article.subtitle}
            </p>
          </div>
          <Badge variant="secondary">{article.readTime}</Badge>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-border/50" />

      {/* Article Content */}
      <div className="prose prose-lg max-w-none">
        {article.content.map((section, index) => renderSection(section, index))}
      </div>

      {/* Footer */}
      <div className="border-t border-border/50 pt-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
          <Button
            variant="outline"
            onClick={() => navigate('/learn')}
            className="gap-2 w-full sm:w-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Learn Hub
          </Button>
          <Button
            variant="default"
            onClick={() => navigate('/play')}
            className="w-full sm:w-auto"
          >
            Find My Perfect Deck
          </Button>
        </div>
      </div>
    </div>
  );
};
