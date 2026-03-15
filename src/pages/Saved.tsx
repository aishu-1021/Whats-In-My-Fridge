import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RecipeCard from "@/components/RecipeCard";
import { Button } from "@/components/ui/button";
import { useApp } from "@/contexts/AppContext";

const filterTabs = ["ALL", "BREAKFAST", "SNACKS", "MAIN COURSE", "DESSERTS"];

// ── Illustrated empty-state SVG ──────────────────────────────────────────────
const EmptyFridgeIllustration = () => (
  <svg viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg"
    className="w-48 h-48 mx-auto mb-6">
    {/* fridge body */}
    <rect x="40" y="10" width="120" height="195" rx="14" fill="#f5f0e8" stroke="#e0d8cc" strokeWidth="2.5"/>
    {/* freezer compartment */}
    <rect x="40" y="10" width="120" height="65" rx="14" fill="#fde8e8" stroke="#e0d8cc" strokeWidth="2.5"/>
    <rect x="40" y="60" width="120" height="15" fill="#e0d8cc"/>
    {/* freezer handle */}
    <rect x="88" y="28" width="24" height="6" rx="3" fill="#c0392b" opacity="0.7"/>
    {/* fridge handle */}
    <rect x="88" y="108" width="24" height="6" rx="3" fill="#c0392b" opacity="0.7"/>
    {/* freezer hinge */}
    <circle cx="52" cy="31" r="3" fill="#c0b89a"/>
    <circle cx="52" cy="55" r="3" fill="#c0b89a"/>
    {/* fridge hinge */}
    <circle cx="52" cy="82" r="3" fill="#c0b89a"/>
    <circle cx="52" cy="190" r="3" fill="#c0b89a"/>
    {/* empty shelf lines */}
    <line x1="55" y1="145" x2="145" y2="145" stroke="#e0d8cc" strokeWidth="1.5" strokeDasharray="4 3"/>
    <line x1="55" y1="168" x2="145" y2="168" stroke="#e0d8cc" strokeWidth="1.5" strokeDasharray="4 3"/>
    {/* sad face on fridge */}
    <circle cx="100" cy="115" r="18" fill="#fde8e8" stroke="#e8c0c0" strokeWidth="1.5"/>
    <circle cx="94" cy="111" r="2" fill="#c0392b" opacity="0.6"/>
    <circle cx="106" cy="111" r="2" fill="#c0392b" opacity="0.6"/>
    {/* sad mouth */}
    <path d="M93 121 Q100 116 107 121" stroke="#c0392b" strokeWidth="1.8"
      strokeLinecap="round" fill="none" opacity="0.6"/>
    {/* floating sparkles */}
    <text x="148" y="95" fontSize="13" opacity="0.5">✦</text>
    <text x="38"  y="108" fontSize="10" opacity="0.4">✦</text>
    <text x="152" y="130" fontSize="8"  opacity="0.3">✦</text>
  </svg>
);

const Saved = () => {
  const { savedRecipes } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("ALL");

  const filtered =
    activeTab === "ALL"
      ? savedRecipes
      : savedRecipes.filter(
          (r) => r.category?.toUpperCase() === activeTab
        );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-background py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-4xl md:text-5xl text-primary mb-2">
            YOUR SAVED TREATS
          </h1>

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

          {/* ── Empty state ──────────────────────────────────────────────── */}
          {savedRecipes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              {/* decorative pill */}
              <span className="inline-block bg-primary/10 text-primary text-xs font-bold
                tracking-widest uppercase px-4 py-1.5 rounded-full mb-6">
                Your fridge is bare
              </span>

              <EmptyFridgeIllustration />

              <h2 className="font-display text-3xl md:text-4xl text-primary mb-3 text-center">
                NOTHING SAVED YET!
              </h2>
              <p className="text-muted-foreground text-center max-w-xs mb-8 leading-relaxed">
                Go explore recipes, hit the little heart icon, and they'll
                show up right here waiting for you.
              </p>

              {/* CTA */}
              <Button
                variant="hero"
                className="px-8 h-12 text-sm"
                onClick={() => navigate("/")}
              >
                GO EXPLORE RECIPES →
              </Button>

              {/* subtle bottom hint */}
              <p className="text-xs text-muted-foreground mt-6 opacity-60">
                Tip: tap ♡ on any recipe card to save it here
              </p>
            </div>

          ) : filtered.length === 0 ? (
            /* ── No results for selected filter tab ───────────────────── */
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <span className="text-5xl mb-4">🍽️</span>
              <h2 className="font-display text-2xl text-primary mb-2 text-center">
                NO {activeTab} SAVED YET
              </h2>
              <p className="text-muted-foreground text-center max-w-xs mb-6">
                You haven't saved any {activeTab.toLowerCase()} recipes.
                Try a different category or save some new ones!
              </p>
              <button
                onClick={() => setActiveTab("ALL")}
                className="text-primary font-bold text-sm underline underline-offset-4"
              >
                Show all saved recipes
              </button>
            </div>

          ) : (
            /* ── Recipe grid ───────────────────────────────────────────── */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filtered.map((recipe, i) => (
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