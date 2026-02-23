import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useApp } from "@/contexts/AppContext";
import { User, ThumbsUp } from "lucide-react";

const cuisineOptions = ["North Indian", "South Indian", "Street Food", "Indo-Chinese", "Healthy Fits", "Desserts"];

const Profile = () => {
  const { savedRecipes, pantryItems, spiceLevel, setSpiceLevel, cuisineMoods, setCuisineMoods, dietaryPreferences, setDietaryPreferences } = useApp();
  const [showModal, setShowModal] = useState(false);

  const [vegToggle, setVegToggle] = useState(dietaryPreferences.includes("vegetarian"));
  const [nonVegToggle, setNonVegToggle] = useState(dietaryPreferences.includes("non-veg"));
  const [veganToggle, setVeganToggle] = useState(dietaryPreferences.includes("vegan"));
  const [gfToggle, setGfToggle] = useState(dietaryPreferences.includes("gluten-free"));

  const toggleCuisine = (mood: string) => {
    const updated = cuisineMoods.includes(mood)
      ? cuisineMoods.filter((m: string) => m !== mood)
      : [...cuisineMoods, mood];
    setCuisineMoods(updated);
  };

  const handleSave = () => {
    const prefs: string[] = [];
    if (vegToggle) prefs.push("vegetarian");
    if (nonVegToggle) prefs.push("non-veg");
    if (veganToggle) prefs.push("vegan");
    if (gfToggle) prefs.push("gluten-free");
    setDietaryPreferences(prefs);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-background py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Avatar */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <User className="w-12 h-12 text-primary" />
            </div>
            <h2 className="font-display text-2xl">Chef Foodie</h2>
            <p className="text-muted-foreground text-sm">@cheffoodie</p>
            <button className="text-primary font-bold text-sm mt-1 hover:underline">EDIT PROFILE</button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-card border-2 border-border rounded-2xl p-4 text-center">
              <p className="font-display text-3xl text-primary">{savedRecipes.length}</p>
              <p className="text-xs text-muted-foreground font-bold">Recipes Tried</p>
            </div>
            <div className="bg-card border-2 border-border rounded-2xl p-4 text-center">
              <p className="font-display text-3xl text-primary">{pantryItems.length}</p>
              <p className="text-xs text-muted-foreground font-bold">Ingredients Saved</p>
            </div>
            <div className="bg-card border-2 border-border rounded-2xl p-4 text-center">
              <p className="font-display text-3xl text-primary">{savedRecipes.length}</p>
              <p className="text-xs text-muted-foreground font-bold">Bookmarked</p>
            </div>
          </div>

          {/* Taste Preferences */}
          <div className="bg-card border-2 border-border rounded-2xl p-6 mb-6">
            <h3 className="font-display text-xl text-primary mb-4">TASTE PREFERENCES</h3>
            {[
              { label: "Vegetarian", value: vegToggle, set: setVegToggle },
              { label: "Non-Vegetarian", value: nonVegToggle, set: setNonVegToggle },
              { label: "Vegan", value: veganToggle, set: setVeganToggle },
              { label: "Gluten-Free", value: gfToggle, set: setGfToggle },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <span className="font-bold text-sm">{item.label}</span>
                <button
                  onClick={() => item.set(!item.value)}
                  className={`w-12 h-7 rounded-full transition-colors ${item.value ? "bg-accent" : "bg-muted"}`}
                >
                  <div className={`w-5 h-5 bg-card rounded-full shadow transition-transform ${item.value ? "translate-x-6" : "translate-x-1"}`} />
                </button>
              </div>
            ))}
          </div>

          {/* Spice Level */}
          <div className="bg-card border-2 border-border rounded-2xl p-6 mb-6">
            <h3 className="font-display text-xl text-primary mb-4">SPICE LEVEL</h3>
            <div className="flex items-center gap-3">
              <span className="text-sm">🧊 Mild</span>
              <input
                type="range"
                min={1}
                max={5}
                value={spiceLevel}
                onChange={(e) => setSpiceLevel(Number(e.target.value))}
                className="flex-1 accent-primary"
              />
              <span className="text-sm">🌋 Volcano</span>
            </div>
          </div>

          {/* Cuisine Mood */}
          <div className="bg-card border-2 border-border rounded-2xl p-6 mb-8">
            <h3 className="font-display text-xl text-primary mb-4">CUISINE MOOD</h3>
            <div className="flex flex-wrap gap-2">
              {cuisineOptions.map((mood) => (
                <button
                  key={mood}
                  onClick={() => toggleCuisine(mood)}
                  className={`font-bold text-sm px-4 py-2 rounded-full border-2 transition-colors ${
                    cuisineMoods.includes(mood)
                      ? "bg-secondary text-secondary-foreground border-secondary"
                      : "border-border hover:border-primary"
                  }`}
                >
                  {mood}
                </button>
              ))}
            </div>
          </div>

          <Button variant="hero" className="w-full" onClick={handleSave}>
            SAVE CHANGES →
          </Button>
        </div>
      </main>
      <Footer />

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm">
          <div className="bg-card rounded-2xl p-10 text-center max-w-sm mx-4 shadow-2xl">
            <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
              <ThumbsUp className="w-10 h-10 text-accent" />
            </div>
            <h2 className="font-display text-3xl text-primary mb-2">SHABASH!</h2>
            <p className="text-muted-foreground mb-6">Your profile is updated and ready to cook!</p>
            <Button variant="hero" onClick={() => setShowModal(false)}>BACK TO KITCHEN →</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
