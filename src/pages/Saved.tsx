import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RecipeCard from "@/components/RecipeCard";
import { Button } from "@/components/ui/button";
import { useApp } from "@/contexts/AppContext";
import { UtensilsCrossed } from "lucide-react";

const filterTabs = ["ALL", "BREAKFAST", "SNACKS", "MAIN COURSE", "DESSERTS"];

const Saved = () => {
  const { savedRecipes } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("ALL");

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-background py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-4xl md:text-5xl text-primary mb-2">YOUR SAVED TREATS</h1>

          {/* Filter tabs */}
          <div className="flex flex-wrap items-center gap-2 my-8">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`font-bold text-sm px-5 py-2 rounded-full border-2 transition-colors ${
                  activeTab === tab
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-foreground hover:border-primary"
                }`}
              >
                {tab}
              </button>
            ))}
            <button
              onClick={() => setActiveTab("ALL")}
              className="text-primary font-bold text-sm hover:underline ml-2"
            >
              CLEAR ALL
            </button>
          </div>

          {savedRecipes.length === 0 ? (
            <div className="text-center py-20">
              <UtensilsCrossed className="w-20 h-20 text-muted-foreground mx-auto mb-4" />
              <h2 className="font-display text-3xl text-primary mb-2">YOUR PLATE IS EMPTY!</h2>
              <p className="text-muted-foreground mb-6">Save some recipes to fill your plate.</p>
              <Button onClick={() => navigate("/")}>FIND RECIPES →</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {savedRecipes.map((recipe, i) => (
                <RecipeCard key={recipe.id} recipe={recipe} index={i} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Saved;
