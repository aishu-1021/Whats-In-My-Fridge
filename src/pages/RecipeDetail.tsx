import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { getRecipeDetail } from "@/lib/api";
import { useApp, Recipe } from "@/contexts/AppContext";
import { Heart, ArrowLeft, Clock, Users, Loader2, ExternalLink } from "lucide-react";

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toggleSaveRecipe, isRecipeSaved, addToBazaar } = useApp();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      setLoading(true);
      setError(null);
      getRecipeDetail(Number(id))
        .then((data) => {
          setRecipe(data);
        })
        .catch(() => {
          setError("Couldn't load this recipe. Please try again later.");
          setRecipe(null);
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <p className="text-muted-foreground">{error || "Recipe not found."}</p>
          <Button variant="outline" onClick={() => navigate(-1)}>← Go Back</Button>
        </div>
      </div>
    );
  }

  const saved = isRecipeSaved(recipe.id);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-background py-8">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link to="/results" className="hover:text-primary">Search Results</Link>
            <span>/</span>
            <span>Recipe Details</span>
          </div>

          <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-primary font-bold text-sm mb-6 hover:underline">
            <ArrowLeft className="w-4 h-4" /> Back to Results
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left column */}
            <div>
              <div className="relative rounded-2xl overflow-hidden shadow-lg">
                <img src={recipe.image} alt={recipe.title} className="w-full aspect-video object-cover" />
                <button
                  onClick={() => toggleSaveRecipe(recipe)}
                  className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm rounded-full p-3 hover:bg-background transition-colors"
                >
                  <Heart className={`w-6 h-6 ${saved ? "fill-primary text-primary" : "text-foreground"}`} />
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mt-6">
                <div className="bg-card border-2 border-border rounded-2xl p-4 text-center">
                  <Clock className="w-5 h-5 mx-auto text-primary mb-1" />
                  <p className="font-bold text-sm">PREP</p>
                  <p className="text-muted-foreground text-sm">15 min</p>
                </div>
                <div className="bg-card border-2 border-border rounded-2xl p-4 text-center">
                  <Clock className="w-5 h-5 mx-auto text-saffron mb-1" />
                  <p className="font-bold text-sm">COOK</p>
                  <p className="text-muted-foreground text-sm">{recipe.readyInMinutes} min</p>
                </div>
                <div className="bg-card border-2 border-border rounded-2xl p-4 text-center">
                  <Users className="w-5 h-5 mx-auto text-accent mb-1" />
                  <p className="font-bold text-sm">SERVES</p>
                  <p className="text-muted-foreground text-sm">{recipe.servings}</p>
                </div>
              </div>

              {/* Difficulty */}
              <div className="mt-6 bg-card border-2 border-border rounded-2xl p-4">
                <p className="font-bold text-sm mb-2">DIFFICULTY</p>
                <div className="flex gap-1">
                  {["Easy", "Medium", "Hard"].map((level, i) => (
                    <div key={level} className={`flex-1 h-3 rounded-full ${i < 2 ? "bg-saffron" : "bg-border"}`} />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-1">Medium</p>
              </div>

              {/* Nutrition */}
              <div className="mt-6 bg-card border-2 border-border rounded-2xl p-4">
                <p className="font-bold text-sm mb-3">NUTRITION PER SERVING</p>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="font-display text-2xl text-primary">245</p>
                    <p className="text-xs text-muted-foreground">Calories</p>
                  </div>
                  <div>
                    <p className="font-display text-2xl text-accent">12g</p>
                    <p className="text-xs text-muted-foreground">Protein</p>
                  </div>
                  <div>
                    <p className="font-display text-2xl text-saffron">32g</p>
                    <p className="text-xs text-muted-foreground">Carbs</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column */}
            <div>
              <h1 className="font-display text-4xl md:text-5xl text-primary mb-4">{recipe.title.toUpperCase()}</h1>
              <p className="text-muted-foreground leading-relaxed mb-8">
                A classic Indian street food favorite that's bursting with flavors and textures. Perfect for a quick snack or a hearty meal with family and friends.
              </p>

              {/* Ingredients */}
              <div className="mb-8">
                <h2 className="font-display text-2xl text-primary mb-4">INGREDIENTS</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {recipe.extendedIngredients?.map((ing, i) => (
                    <label key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                      <input type="checkbox" className="w-5 h-5 rounded accent-primary" />
                      <span className="text-sm">
                        {ing.amount} {ing.unit} {ing.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              <div className="mb-8">
                <h2 className="font-display text-2xl text-primary mb-4">INSTRUCTIONS</h2>
                {recipe.instructions ? (
                  <div
                    className="prose prose-sm max-w-none [&_li]:mb-3 [&_b]:text-foreground text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: recipe.instructions }}
                  />
                ) : (
                  <p className="text-muted-foreground">No instructions available.</p>
                )}
              </div>

              {recipe.sourceUrl && (
                <a href={recipe.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary font-bold hover:underline mb-6">
                  View Original Source Recipe <ExternalLink className="w-4 h-4" />
                </a>
              )}

              {recipe.missedIngredients && recipe.missedIngredients.length > 0 && (
                <div className="mt-6">
                  <Button
                    variant="hero"
                    className="w-full"
                    onClick={() => {
                      addToBazaar(recipe.missedIngredients);
                      navigate("/bazaar");
                    }}
                  >
                    ADD MISSING TO BAZAAR →
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RecipeDetail;
