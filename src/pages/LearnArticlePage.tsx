import { useParams, Navigate } from "react-router-dom";
import { MainNav } from "@/components/MainNav";
import { LearnArticle } from "@/components/LearnArticle";
import { getArticleBySlug } from "@/data/learn-articles";

const LearnArticlePage = () => {
  const { slug } = useParams<{ slug: string }>();

  // Find article by slug
  const article = slug ? getArticleBySlug(slug) : undefined;

  // If article not found, redirect to learn hub
  if (!article) {
    return <Navigate to="/learn" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <MainNav />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <LearnArticle article={article} />
      </div>
    </div>
  );
};

export default LearnArticlePage;
