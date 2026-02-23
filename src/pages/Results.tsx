import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RecipeCard from "@/components/RecipeCard";
import { Button } from "@/components/ui/button";
import { searchRecipes } from "@/lib/api";
import { Recipe } from "@/contexts/AppContext";
import { Loader2, SearchX } from "lucide-react";

const filters = ["All", "Vegetarian", "Spicy", "Sweet", "Under 30m"];

const Results = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [visibleCount, setVisibleCount] = useState(8);

  useEffect(() => {
    if (query) {
      setLoading(true);
      searchRecipes(query, 12).then((data) => {
        setRecipes(data);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [query]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-background py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-4xl md:text-5xl text-primary mb-2">STREET FOOD DELIGHTS!</h1>
          <p className="text-muted-foreground mb-8">
            {recipes.length > 0
              ? `We found ${recipes.length} recipes based on your fridge inventory. Time to get spicy!`
              : "Search for recipes using your ingredients."}
          </p>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`font-bold text-sm px-5 py-2 rounded-full border-2 transition-colors ${
                  activeFilter === f
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-foreground hover:border-primary"
                }`}
              >
                {f.toUpperCase()}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
          ) : recipes.length === 0 ? (
            <div className="text-center py-20">
              <SearchX className="w-20 h-20 text-muted-foreground mx-auto mb-4" />
              <h2 className="font-display text-3xl text-primary mb-2">NOTHING IN THE POT!</h2>
              <p className="text-muted-foreground mb-6">Looks like we couldn't find recipes with those ingredients.</p>
              <div className="flex justify-center gap-3">
                <Button variant="outline" onClick={() => navigate("/")}>TRY DIFFERENT INGREDIENTS</Button>
                <Button onClick={() => { searchRecipes("potato", 12).then(setRecipes); }}>BROWSE ALL RECIPES</Button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {recipes.slice(0, visibleCount).map((recipe, i) => (
                  <RecipeCard key={recipe.id} recipe={recipe} index={i} />
                ))}
              </div>
              {visibleCount < recipes.length && (
                <div className="text-center mt-10">
                  <Button variant="outline" size="lg" onClick={() => setVisibleCount((v) => v + 8)}>
                    LOAD MORE TASTY STUFF
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Results;
