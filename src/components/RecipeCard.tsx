import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useApp, Recipe } from "@/contexts/AppContext";

const cardColors = [
  "bg-primary",
  "bg-saffron",
  "bg-accent",
  "bg-navy",
];

interface RecipeCardProps {
  recipe: Recipe;
  index: number;
}

const RecipeCard = ({ recipe, index }: RecipeCardProps) => {
  const { toggleSaveRecipe, isRecipeSaved } = useApp();
  const colorClass = cardColors[index % cardColors.length];
  const saved = isRecipeSaved(recipe.id);

  return (
    <div className={`${colorClass} rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 relative group`}>
      <button
        onClick={(e) => { e.preventDefault(); toggleSaveRecipe(recipe); }}
        className="absolute top-3 right-3 z-10 bg-background/30 backdrop-blur-sm rounded-full p-2 hover:bg-background/50 transition-colors"
      >
        <Heart className={`w-5 h-5 ${saved ? "fill-primary-foreground text-primary-foreground" : "text-primary-foreground"}`} />
      </button>

      <Link to={`/recipe/${recipe.id}`}>
        <div className="aspect-video overflow-hidden">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
        <div className="p-4">
          <h3 className="font-display text-lg text-primary-foreground leading-tight mb-3">
            {recipe.title.toUpperCase()}
          </h3>
          <div className="flex gap-2">
            <span className="bg-accent/80 text-accent-foreground text-xs font-bold px-3 py-1 rounded-full">
              ✅ Have: {recipe.usedIngredientCount}
            </span>
            <span className="bg-primary/80 text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
              ❌ Missing: {recipe.missedIngredientCount}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default RecipeCard;
