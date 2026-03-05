import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RecipeCard from "@/components/RecipeCard";
import { Button } from "@/components/ui/button";
import { searchRecipes } from "@/lib/api";
import { Recipe } from "@/contexts/AppContext";
import { Loader2, SearchX } from "lucide-react";

const filters = ["All", "Vegetarian", "Non-Vegetarian", "Spicy", "Sweet", "Under 30m"];

const NON_VEG_KEYWORDS = [
  "chicken", "beef", "pork", "lamb", "fish", "shrimp", "mutton", "turkey",
  "bacon", "sausage", "prawn", "crab", "lobster", "tuna", "salmon",
  "egg", "eggs", "omelette", "frittata", "meat", "steak", "mince", "keema", "ham",
  "deviled", "scotch", "scrambled", "poached",
];

const SPICY_KEYWORDS = [
  "spicy", "masala", "curry", "chili", "chilli", "tandoori", "jalapeño",
  "sriracha", "hot sauce", "vindaloo", "arrabiata", "pepper",
];

const SWEET_KEYWORDS = [
  "sweet", "halwa", "kheer", "cake", "dessert", "pudding", "chocolate",
  "cookie", "brownie", "mithai", "ladoo", "gulab", "payasam", "candy", "ice cream",
];

const applyClientFilter = (recipes: Recipe[], filter: string): Recipe[] => {
  // Vegetarian results already come filtered from the API + we do one more
  // client-side pass to catch any egg-based dishes the API missed
  if (filter === "All") return recipes;

  return recipes.filter((recipe) => {
    const title = recipe.title?.toLowerCase() ?? "";

    if (filter === "Vegetarian") {
      return !NON_VEG_KEYWORDS.some((kw) => title.includes(kw));
    }
    if (filter === "Non-Vegetarian") return NON_VEG_KEYWORDS.some((kw) => title.includes(kw));
    if (filter === "Spicy") return SPICY_KEYWORDS.some((kw) => title.includes(kw));
    if (filter === "Sweet") return SWEET_KEYWORDS.some((kw) => title.includes(kw));
    if (filter === "Under 30m") {
      if (typeof (recipe as any).readyInMinutes === "number") return (recipe as any).readyInMinutes <= 30;
      return (recipe.missedIngredientCount ?? 0) <= 3;
    }
    return true;
  });
};

const Results = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [visibleCount, setVisibleCount] = useState(8);
  const [error, setError] = useState<string | null>(null);

  const fetchRecipes = (diet = "") => {
    if (!query) { setLoading(false); return; }
    setLoading(true);
    setError(null);
    searchRecipes(query, 50, diet)
      .then((data) => setRecipes(data))
      .catch(() => {
        setError("Oops! Couldn't reach the kitchen. Please check your connection and try again.");
        setRecipes([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchRecipes(); }, [query]);

  useEffect(() => {
    setVisibleCount(8);
    if (activeFilter === "Vegetarian") {
      fetchRecipes("vegetarian");
    } else if (activeFilter === "All") {
      fetchRecipes();
    }
    // Non-Veg, Spicy, Sweet, Under 30m — client-side only, no re-fetch
  }, [activeFilter]);

  const filteredRecipes = applyClientFilter(recipes, activeFilter);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-background py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-4xl md:text-5xl text-primary mb-2">STREET FOOD DELIGHTS!</h1>
          <p className="text-muted-foreground mb-8">
            {filteredRecipes.length > 0
              ? `We found ${filteredRecipes.length} recipes based on your fridge inventory. Time to get spicy!`
              : recipes.length > 0
              ? `No recipes match the "${activeFilter}" filter. Try a different one!`
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
          ) : error ? (
            <div className="text-center py-20">
              <SearchX className="w-20 h-20 text-muted-foreground mx-auto mb-4" />
              <h2 className="font-display text-3xl text-primary mb-2">KITCHEN TROUBLE!</h2>
              <p className="text-muted-foreground mb-6">{error}</p>
              <Button variant="outline" onClick={() => navigate("/")}>TRY AGAIN</Button>
            </div>
          ) : recipes.length === 0 ? (
            <div className="text-center py-20">
              <SearchX className="w-20 h-20 text-muted-foreground mx-auto mb-4" />
              <h2 className="font-display text-3xl text-primary mb-2">NOTHING IN THE POT!</h2>
              <p className="text-muted-foreground mb-6">Looks like we couldn't find recipes with those ingredients.</p>
              <div className="flex justify-center gap-3">
                <Button variant="outline" onClick={() => navigate("/")}>TRY DIFFERENT INGREDIENTS</Button>
                <Button onClick={() => searchRecipes("potato", 50).then(setRecipes).catch(() => setError("Couldn't fetch recipes."))}>
                  BROWSE ALL RECIPES
                </Button>
              </div>
            </div>
          ) : filteredRecipes.length === 0 ? (
            <div className="text-center py-20">
              <SearchX className="w-20 h-20 text-muted-foreground mx-auto mb-4" />
              <h2 className="font-display text-3xl text-primary mb-2">NO MATCHES!</h2>
              <p className="text-muted-foreground mb-6">No recipes match the "{activeFilter}" filter. Try a different one!</p>
              <Button variant="outline" onClick={() => setActiveFilter("All")}>CLEAR FILTER</Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredRecipes.slice(0, visibleCount).map((recipe, i) => (
                  <RecipeCard key={recipe.id} recipe={recipe} index={i} />
                ))}
              </div>
              {visibleCount < filteredRecipes.length && (
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