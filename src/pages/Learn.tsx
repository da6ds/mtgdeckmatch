import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { MainNav } from "@/components/MainNav";
import { LearnArticleCard } from "@/components/LearnArticleCard";
import { BookOpen } from "lucide-react";
import { getArticlesByCategory } from "@/data/learn-articles";

const Learn = () => {
  const navigate = useNavigate();

  // Get articles by category
  const gettingStartedArticles = getArticlesByCategory('getting-started');
  const understandingDecksArticles = getArticlesByCategory('understanding-decks');
  const specialTopicsArticles = getArticlesByCategory('special-topics');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <MainNav />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Learn Magic
            </h1>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know to get started with Commander
            </p>
          </div>

          {/* Getting Started Section */}
          <div className="space-y-3">
            <div>
              <h2 className="text-lg font-bold text-foreground mb-1.5">
                Getting Started
              </h2>
              <p className="text-muted-foreground">
                New to Magic? Start here to learn the basics
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {gettingStartedArticles.map((article) => (
                <LearnArticleCard
                  key={article.id}
                  article={article}
                  onClick={() => navigate(`/learn/${article.slug}`)}
                />
              ))}
            </div>
          </div>

          {/* Understanding Decks Section */}
          <div className="space-y-3">
            <div>
              <h2 className="text-lg font-bold text-foreground mb-1.5">
                Understanding Decks
              </h2>
              <p className="text-muted-foreground">
                Learn about precons, deck construction, and customization
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {understandingDecksArticles.map((article) => (
                <LearnArticleCard
                  key={article.id}
                  article={article}
                  onClick={() => navigate(`/learn/${article.slug}`)}
                />
              ))}
            </div>
          </div>

          {/* Special Topics Section */}
          <div className="space-y-3">
            <div>
              <h2 className="text-lg font-bold text-foreground mb-1.5">
                Special Topics
              </h2>
              <p className="text-muted-foreground">
                Crossover cards and quick reference materials
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Special Topics Articles */}
              {specialTopicsArticles.map((article) => (
                <LearnArticleCard
                  key={article.id}
                  article={article}
                  onClick={() => navigate(`/learn/${article.slug}`)}
                />
              ))}

              {/* Glossary Card */}
              <Card
                className="group cursor-pointer hover:shadow-card-hover transition-all duration-300 border-2 hover:border-primary/50 h-full bg-gradient-to-br from-primary/5 to-primary/10"
                onClick={() => navigate('/learn/glossary')}
              >
                <CardContent className="p-3 flex flex-col h-full space-y-3">
                  {/* Icon */}
                  <div className="text-2xl group-hover:scale-110 transition-transform duration-300">
                    📖
                  </div>

                  {/* Content */}
                  <div className="flex-1 flex flex-col space-y-1.5">
                    {/* Title */}
                    <h3 className="text-base font-bold text-foreground leading-tight">
                      Glossary
                    </h3>

                    {/* Subtitle */}
                    <p className="text-xs text-muted-foreground leading-relaxed flex-1 line-clamp-2">
                      Quick reference for Magic terms and Commander jargon
                    </p>
                  </div>

                  {/* Badge */}
                  <div className="pt-1.5 border-t border-border/50">
                    <span className="text-xs font-semibold text-primary">
                      35+ Terms
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Learn;
