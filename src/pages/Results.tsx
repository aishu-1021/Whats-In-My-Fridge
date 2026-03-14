import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RecipeCard from "@/components/RecipeCard";
import { Button } from "@/components/ui/button";
import { searchRecipes } from "@/lib/api";
import { Recipe } from "@/contexts/AppContext";
import {
  Loader2,
  SearchX,
  SlidersHorizontal,
  ChevronDown,
  Leaf,
  Drumstick,
  Flame,
  CakeSlice,
  Timer,
  UtensilsCrossed,
  Check,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FilterDef {
  label: string;
  icon: React.ReactNode;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const FILTERS: FilterDef[] = [
  { label: "All",            icon: <UtensilsCrossed size={13} strokeWidth={2.5} /> },
  { label: "Vegetarian",     icon: <Leaf            size={13} strokeWidth={2.5} /> },
  { label: "Non-Vegetarian", icon: <Drumstick       size={13} strokeWidth={2.5} /> },
  { label: "Spicy",          icon: <Flame           size={13} strokeWidth={2.5} /> },
  { label: "Sweet",          icon: <CakeSlice       size={13} strokeWidth={2.5} /> },
  { label: "Under 30m",      icon: <Timer           size={13} strokeWidth={2.5} /> },
];

const SORT_OPTIONS = ["Best Match", "Fewest Missing", "Quickest First", "Easiest First"];

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

// ─── Filter logic (unchanged) ─────────────────────────────────────────────────

const applyClientFilter = (recipes: Recipe[], filter: string): Recipe[] => {
  if (filter === "All") return recipes;
  return recipes.filter((recipe) => {
    const title = recipe.title?.toLowerCase() ?? "";
    if (filter === "Vegetarian")     return !NON_VEG_KEYWORDS.some((kw) => title.includes(kw));
    if (filter === "Non-Vegetarian") return  NON_VEG_KEYWORDS.some((kw) => title.includes(kw));
    if (filter === "Spicy")          return  SPICY_KEYWORDS.some((kw) => title.includes(kw));
    if (filter === "Sweet")          return  SWEET_KEYWORDS.some((kw) => title.includes(kw));
    if (filter === "Under 30m") {
      if (typeof (recipe as any).readyInMinutes === "number")
        return (recipe as any).readyInMinutes <= 30;
      return (recipe.missedIngredientCount ?? 0) <= 3;
    }
    return true;
  });
};

// ─── Component ────────────────────────────────────────────────────────────────

const Results = () => {
  const [searchParams] = useSearchParams();
  const navigate      = useNavigate();
  const query         = searchParams.get("q") || "";

  const [recipes,         setRecipes]         = useState<Recipe[]>([]);
  const [loading,         setLoading]         = useState(true);
  const [activeFilter,    setActiveFilter]    = useState("All");
  const [activeSort,      setActiveSort]      = useState("Best Match");
  const [showSortMenu,    setShowSortMenu]    = useState(false);
  const [visibleCount,    setVisibleCount]    = useState(8);
  const [error,           setError]           = useState<string | null>(null);
  const [animatingFilter, setAnimatingFilter] = useState(false);

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
    setAnimatingFilter(true);
    setTimeout(() => setAnimatingFilter(false), 300);
    if (activeFilter === "Vegetarian") fetchRecipes("vegetarian");
    else if (activeFilter === "All")   fetchRecipes();
  }, [activeFilter]);

  const filteredRecipes = applyClientFilter(recipes, activeFilter);

  return (
    <>
      <style>{`
        /* ── Animations ── */
        @keyframes cardPop {
          from { opacity: 0; transform: translateY(18px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-6px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0);    }
        }

        /* ── Card stagger ── */
        .result-card-wrap {
          animation: cardPop 0.38s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }

        /* ── Filter pills ── */
        .res-filter-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-weight: 700;
          font-size: 12.5px;
          padding: 7px 16px;
          border-radius: 6px;
          border: 1.5px solid #D9CDB8;
          background: white;
          cursor: pointer;
          transition: all 0.18s ease;
          white-space: nowrap;
          color: #5A5045;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          font-family: inherit;
        }
        .res-filter-pill:hover {
          border-color: hsl(var(--primary));
          color: hsl(var(--primary));
          background: hsl(var(--primary) / 0.04);
        }
        .res-filter-pill.active {
          background: hsl(var(--primary));
          border-color: hsl(var(--primary));
          color: white;
          box-shadow: 0 2px 12px hsl(var(--primary) / 0.25);
        }
        .res-filter-pill svg {
          flex-shrink: 0;
          opacity: 0.85;
        }

        /* ── Sort trigger ── */
        .res-sort-trigger {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-weight: 700;
          font-size: 12.5px;
          padding: 7px 16px;
          border-radius: 6px;
          border: 1.5px solid #D9CDB8;
          background: white;
          cursor: pointer;
          transition: all 0.18s ease;
          color: #5A5045;
          letter-spacing: 0.5px;
          font-family: inherit;
        }
        .res-sort-trigger:hover,
        .res-sort-trigger.open {
          border-color: hsl(var(--primary));
          color: hsl(var(--primary));
          background: hsl(var(--primary) / 0.04);
        }

        /* ── Sort dropdown ── */
        .res-sort-menu {
          position: absolute;
          top: calc(100% + 6px);
          right: 0;
          background: white;
          border-radius: 10px;
          border: 1.5px solid #EAE0D0;
          box-shadow: 0 8px 28px rgba(0, 0, 0, 0.10);
          overflow: hidden;
          z-index: 100;
          min-width: 185px;
          animation: dropIn 0.18s ease both;
        }
        .res-sort-row {
          padding: 10px 16px;
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
          color: #444;
          transition: background 0.12s;
          display: flex;
          align-items: center;
          gap: 8px;
          letter-spacing: 0.2px;
          font-family: inherit;
        }
        .res-sort-row:not(:last-child) {
          border-bottom: 1px solid #F3EDE2;
        }
        .res-sort-row:hover    { background: #FAF6EE; }
        .res-sort-row.selected { color: hsl(var(--primary)); background: #FFF8F5; font-weight: 700; }
        .res-sort-row .check-icon { color: hsl(var(--primary)); flex-shrink: 0; }

        /* ── Count badge ── */
        .res-count-badge {
          display: inline-flex;
          align-items: center;
          background: hsl(var(--primary) / 0.10);
          color: hsl(var(--primary));
          border: 1.5px solid hsl(var(--primary) / 0.25);
          border-radius: 6px;
          padding: 3px 11px;
          font-size: 12.5px;
          font-weight: 700;
          letter-spacing: 0.4px;
        }

        /* ── Load more ── */
        .res-load-more {
          border: 2px solid hsl(var(--primary));
          color: hsl(var(--primary));
          background: transparent;
          border-radius: 6px;
          padding: 11px 36px;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          letter-spacing: 0.6px;
          text-transform: uppercase;
          transition: all 0.2s ease;
          font-family: inherit;
        }
        .res-load-more:hover {
          background: hsl(var(--primary));
          color: white;
          box-shadow: 0 4px 16px hsl(var(--primary) / 0.28);
        }

        /* ── Grid transitions ── */
        .res-grid {
          transition: opacity 0.22s ease;
        }
        .res-grid.fading { opacity: 0; }

        /* ── Chevron ── */
        .res-chevron {
          transition: transform 0.18s ease;
          flex-shrink: 0;
        }
        .res-chevron.open { transform: rotate(180deg); }

        /* ── Page fade-in ── */
        .res-fade-up {
          animation: fadeUp 0.38s ease both;
        }

        /* ── Empty states ── */
        .res-empty {
          animation: fadeUp 0.35s ease both;
        }

        /* ── Divider between filters and sort ── */
        .res-toolbar {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding-bottom: 24px;
          border-bottom: 1px solid #EAE0D0;
          margin-bottom: 28px;
        }
      `}</style>

      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-1 bg-background py-12">
          <div className="container mx-auto px-4">

            {/* ── Page header ── */}
            <div className="res-fade-up mb-8">
              <div className="flex flex-wrap items-baseline gap-3 mb-1">
                <h1 className="font-display text-4xl md:text-5xl text-primary">
                  STREET FOOD DELIGHTS!
                </h1>
                {!loading && filteredRecipes.length > 0 && (
                  <span className="res-count-badge">
                    {filteredRecipes.length}&nbsp;recipes found
                  </span>
                )}
              </div>
              <p className="text-muted-foreground text-sm mt-1">
                {filteredRecipes.length > 0
                  ? `Showing results for "${query}" · ${filteredRecipes.length} matches`
                  : recipes.length > 0
                  ? `No recipes match the "${activeFilter}" filter. Try a different one!`
                  : "Search for recipes using your ingredients."}
              </p>
            </div>

            {/* ── Toolbar: filters + sort ── */}
            <div className="res-toolbar res-fade-up" style={{ animationDelay: "0.06s" }}>
              {/* Filter pills */}
              <div className="flex flex-wrap gap-2">
                {FILTERS.map(({ label, icon }) => (
                  <button
                    key={label}
                    className={`res-filter-pill ${activeFilter === label ? "active" : ""}`}
                    onClick={() => setActiveFilter(label)}
                  >
                    {icon}
                    {label}
                  </button>
                ))}
              </div>

              {/* Sort dropdown */}
              <div style={{ position: "relative" }}>
                <button
                  className={`res-sort-trigger ${showSortMenu ? "open" : ""}`}
                  onClick={() => setShowSortMenu((v) => !v)}
                >
                  <SlidersHorizontal size={13} strokeWidth={2.5} />
                  {activeSort}
                  <ChevronDown
                    size={13}
                    strokeWidth={2.5}
                    className={`res-chevron ${showSortMenu ? "open" : ""}`}
                  />
                </button>

                {showSortMenu && (
                  <div className="res-sort-menu">
                    {SORT_OPTIONS.map((opt) => (
                      <div
                        key={opt}
                        className={`res-sort-row ${activeSort === opt ? "selected" : ""}`}
                        onClick={() => { setActiveSort(opt); setShowSortMenu(false); }}
                      >
                        {activeSort === opt
                          ? <Check size={12} strokeWidth={3} className="check-icon" />
                          : <span style={{ width: 12, display: "inline-block" }} />
                        }
                        {opt}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ── Loading state ── */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-28 gap-5 res-empty">
                <Loader2
                  className="text-primary animate-spin"
                  style={{ width: 40, height: 40 }}
                />
                <p className="text-muted-foreground font-semibold text-xs tracking-widest uppercase">
                  Finding your recipes&hellip;
                </p>
              </div>

            ) : error ? (
              <div className="text-center py-24 res-empty">
                <SearchX className="w-16 h-16 text-muted-foreground mx-auto mb-5" strokeWidth={1.5} />
                <h2 className="font-display text-3xl text-primary mb-2">KITCHEN TROUBLE!</h2>
                <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">{error}</p>
                <Button variant="outline" onClick={() => navigate("/")}>Try Again</Button>
              </div>

            ) : recipes.length === 0 ? (
              <div className="text-center py-24 res-empty">
                <SearchX className="w-16 h-16 text-muted-foreground mx-auto mb-5" strokeWidth={1.5} />
                <h2 className="font-display text-3xl text-primary mb-2">NOTHING IN THE POT!</h2>
                <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
                  We couldn't find recipes with those ingredients. Try something else!
                </p>
                <div className="flex justify-center gap-3 flex-wrap">
                  <Button variant="outline" onClick={() => navigate("/")}>
                    Try Different Ingredients
                  </Button>
                  <Button
                    onClick={() =>
                      searchRecipes("potato", 50)
                        .then(setRecipes)
                        .catch(() => setError("Couldn't fetch recipes."))
                    }
                  >
                    Browse All Recipes
                  </Button>
                </div>
              </div>

            ) : filteredRecipes.length === 0 ? (
              <div className="text-center py-24 res-empty">
                <SearchX className="w-16 h-16 text-muted-foreground mx-auto mb-5" strokeWidth={1.5} />
                <h2 className="font-display text-3xl text-primary mb-2">NO MATCHES!</h2>
                <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
                  No recipes match the "{activeFilter}" filter. Try a different one!
                </p>
                <Button variant="outline" onClick={() => setActiveFilter("All")}>
                  Clear Filter
                </Button>
              </div>

            ) : (
              <>
                {/* ── Recipe grid ── */}
                <div
                  className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 res-grid ${
                    animatingFilter ? "fading" : ""
                  }`}
                >
                  {filteredRecipes.slice(0, visibleCount).map((recipe, i) => (
                    <div
                      key={recipe.id}
                      className="result-card-wrap"
                      style={{ animationDelay: `${i * 0.05}s` }}
                    >
                      <RecipeCard recipe={recipe} index={i} />
                    </div>
                  ))}
                </div>

                {/* ── Load more ── */}
                {visibleCount < filteredRecipes.length && (
                  <div className="text-center mt-14 res-fade-up">
                    <button
                      className="res-load-more"
                      onClick={() => setVisibleCount((v) => v + 8)}
                    >
                      Load More Recipes
                    </button>
                  </div>
                )}
              </>
            )}

          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Results;