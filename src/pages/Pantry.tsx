import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useApp } from "@/contexts/AppContext";
import { Check, Plus, X, Search, ChefHat } from "lucide-react";

const defaultStaples = [
  "Oil", "Turmeric", "Garlic", "Cumin", "Rice", "Lentils", "Onions",
  "Potatoes", "Ginger", "Chili Powder", "Salt", "Mustard Seeds", "Coriander",
  "Ghee", "Tomatoes", "Green Chilies", "Curry Leaves", "Cardamom", "Cinnamon",
];

// ── Category grouping for better organisation ──────────────────────────────
const CATEGORIES: { label: string; items: string[] }[] = [
  {
    label: "Spices & Masalas",
    items: ["Turmeric", "Cumin", "Chili Powder", "Mustard Seeds", "Coriander", "Cardamom", "Cinnamon", "Curry Leaves"],
  },
  {
    label: "Vegetables",
    items: ["Onions", "Potatoes", "Tomatoes", "Garlic", "Ginger", "Green Chilies"],
  },
  {
    label: "Pantry Basics",
    items: ["Oil", "Ghee", "Rice", "Lentils", "Salt"],
  },
];

const Pantry = () => {
  const { pantryItems, savePantryToDB } = useApp();
  const navigate = useNavigate();

  const [selected,   setSelected]   = useState<string[]>([]);
  const [customItem, setCustomItem] = useState("");
  const [allItems,   setAllItems]   = useState(defaultStaples);
  const [search,     setSearch]     = useState("");
  const [saved,      setSaved]      = useState(false);
  const [justAdded,  setJustAdded]  = useState<string | null>(null);

  // Sync with DB on load
  useEffect(() => {
    if (pantryItems.length > 0) {
      setSelected(pantryItems);
      const customFromDB = pantryItems.filter(
        (item) => !defaultStaples.map((s) => s.toLowerCase()).includes(item.toLowerCase())
      );
      if (customFromDB.length > 0) {
        setAllItems((prev) => [
          ...prev,
          ...customFromDB.map((i) => i.charAt(0).toUpperCase() + i.slice(1)),
        ]);
      }
    }
  }, [pantryItems]);

  const toggleItem = (item: string) => {
    setSelected((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const addCustom = () => {
    const trimmed = customItem.trim();
    if (!trimmed) return;
    const alreadyExists = allItems.some(
      (i) => i.toLowerCase() === trimmed.toLowerCase()
    );
    if (!alreadyExists) {
      const formatted = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
      setAllItems((prev) => [...prev, formatted]);
      setSelected((prev) => [...prev, formatted]);
      setJustAdded(formatted);
      setTimeout(() => setJustAdded(null), 1200);
    } else {
      // If it exists but isn't selected, select it
      setSelected((prev) =>
        prev.includes(trimmed) ? prev : [...prev, trimmed]
      );
    }
    setCustomItem("");
  };

  const removeCustom = (item: string) => {
    if (defaultStaples.includes(item)) return; // can't remove defaults, only deselect
    setAllItems((prev) => prev.filter((i) => i !== item));
    setSelected((prev) => prev.filter((i) => i !== item));
  };

  const clearAll = () => setSelected([]);
  const selectAll = () => setSelected(allItems);

  const handleSave = async () => {
    await savePantryToDB(selected);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      navigate("/preferences");
    }, 900);
  };

  // Filter items by search
  const filteredItems = search.trim()
    ? allItems.filter((i) => i.toLowerCase().includes(search.toLowerCase()))
    : null;

  // Custom items not in defaultStaples
  const customItems = allItems.filter((i) => !defaultStaples.includes(i));

  return (
    <>
      <style>{`
        /* ── Pill spring animation on select ── */
        @keyframes pillPop {
          0%   { transform: scale(1); }
          40%  { transform: scale(1.12); }
          100% { transform: scale(1); }
        }
        .pill-selected { animation: pillPop 0.22s cubic-bezier(0.34,1.56,0.64,1); }

        /* ── Just-added badge ── */
        @keyframes badgePop {
          from { opacity:0; transform:translateY(6px) scale(0.85); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }
        .badge-pop { animation: badgePop 0.25s ease both; }

        /* ── Save button success ── */
        @keyframes checkIn {
          from { opacity:0; transform:scale(0.5); }
          to   { opacity:1; transform:scale(1); }
        }
        .save-success { animation: checkIn 0.25s cubic-bezier(0.34,1.56,0.64,1); }

        /* ── Pill base styles ── */
        .pantry-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-weight: 700;
          font-size: 13px;
          padding: 8px 16px;
          border-radius: 999px;
          border: 2px solid;
          cursor: pointer;
          transition: transform 0.15s ease, box-shadow 0.15s ease,
                      background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
          position: relative;
          white-space: nowrap;
          font-family: inherit;
        }
        .pantry-pill:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
        .pantry-pill.unselected {
          background: white;
          border-color: #E0D6C2;
          color: #444;
        }
        .pantry-pill.unselected:hover { border-color: hsl(var(--primary)); color: hsl(var(--primary)); }
        .pantry-pill.is-selected {
          background: hsl(var(--secondary));
          border-color: hsl(var(--secondary));
          color: hsl(var(--secondary-foreground));
          box-shadow: 0 2px 8px hsl(var(--secondary) / 0.25);
        }

        /* ── Search input ── */
        .pantry-search:focus {
          border-color: hsl(var(--primary)) !important;
          box-shadow: 0 0 0 3px hsl(var(--primary) / 0.12);
        }

        /* ── Category label ── */
        .cat-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.7px;
          text-transform: uppercase;
          color: #999;
          margin-bottom: 10px;
          margin-top: 20px;
        }
      `}</style>

      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 bg-background py-12">
          <div className="container mx-auto px-4 max-w-2xl">

            {/* Progress bar */}
            <div className="mb-8">
              <p className="font-bold text-sm text-muted-foreground mb-2 tracking-widest uppercase">
                Step 1 of 2 — Pantry Setup
              </p>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full w-1/2 transition-all duration-500" />
              </div>
            </div>

            {/* Header */}
            <h1 className="font-display text-4xl md:text-5xl text-primary mb-2">
              YOUR PANTRY STAPLES
            </h1>
            <p className="text-muted-foreground mb-6">
              Tell us what you always have at home — we'll never ask again.
            </p>

            {/* Counter + quick actions row */}
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <div
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-sm"
                  style={{ background: "hsl(var(--primary) / 0.1)", color: "hsl(var(--primary))" }}
                >
                  <ChefHat size={13} strokeWidth={2.5} />
                  {selected.length} selected
                </div>
                {selected.length > 0 && (
                  <button
                    onClick={clearAll}
                    className="text-xs font-semibold text-muted-foreground hover:text-destructive transition-colors"
                  >
                    Clear all
                  </button>
                )}
              </div>
              <button
                onClick={selectAll}
                className="text-xs font-bold tracking-wide"
                style={{ color: "hsl(var(--primary))" }}
              >
                Select all
              </button>
            </div>

            {/* Search bar */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search ingredients..."
                className="pantry-search w-full h-11 pl-10 pr-4 rounded-full border-2 border-border bg-card focus:outline-none transition-all text-sm font-medium"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* ── Search results mode ── */}
            {filteredItems ? (
              <div>
                <p className="cat-label">Search results</p>
                <div className="flex flex-wrap gap-3 mb-8">
                  {filteredItems.length === 0 ? (
                    <p className="text-muted-foreground text-sm">
                      No match — add it as a custom ingredient below.
                    </p>
                  ) : (
                    filteredItems.map((item) => {
                      const isSelected = selected.includes(item);
                      const isCustom = !defaultStaples.includes(item);
                      return (
                        <div key={item} className="relative">
                          <button
                            onClick={() => toggleItem(item)}
                            className={`pantry-pill ${isSelected ? "is-selected pill-selected" : "unselected"}`}
                          >
                            {isSelected
                              ? <Check size={13} strokeWidth={3} />
                              : <Plus size={13} strokeWidth={3} />
                            }
                            {item}
                          </button>
                          {isCustom && isSelected && (
                            <button
                              onClick={() => removeCustom(item)}
                              title="Remove custom ingredient"
                              style={{
                                position: "absolute", top: -6, right: -6,
                                width: 18, height: 18, borderRadius: "50%",
                                background: "#D32F2F", border: "2px solid white",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                cursor: "pointer", color: "white",
                              }}
                            >
                              <X size={9} strokeWidth={3} />
                            </button>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            ) : (
              /* ── Categorised mode ── */
              <div className="mb-8">
                {CATEGORIES.map((cat) => (
                  <div key={cat.label}>
                    <p className="cat-label">{cat.label}</p>
                    <div className="flex flex-wrap gap-3 mb-2">
                      {cat.items.map((item) => {
                        const isSelected = selected.includes(item);
                        return (
                          <button
                            key={item}
                            onClick={() => toggleItem(item)}
                            className={`pantry-pill ${isSelected ? "is-selected pill-selected" : "unselected"}`}
                          >
                            {isSelected
                              ? <Check size={13} strokeWidth={3} />
                              : <Plus size={13} strokeWidth={3} />
                            }
                            {item}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {/* Custom items section */}
                {customItems.length > 0 && (
                  <div>
                    <p className="cat-label">Your Custom Items</p>
                    <div className="flex flex-wrap gap-3 mb-2">
                      {customItems.map((item) => {
                        const isSelected = selected.includes(item);
                        return (
                          <div key={item} className="relative">
                            <button
                              onClick={() => toggleItem(item)}
                              className={`pantry-pill ${isSelected ? "is-selected" : "unselected"}`}
                            >
                              {isSelected
                                ? <Check size={13} strokeWidth={3} />
                                : <Plus size={13} strokeWidth={3} />
                              }
                              {item}
                            </button>
                            {/* Remove button on custom items */}
                            <button
                              onClick={() => removeCustom(item)}
                              title="Remove"
                              style={{
                                position: "absolute", top: -6, right: -6,
                                width: 18, height: 18, borderRadius: "50%",
                                background: "#aaa", border: "2px solid white",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                cursor: "pointer", color: "white",
                              }}
                            >
                              <X size={9} strokeWidth={3} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Add custom ingredient */}
            <div className="flex gap-3 mb-3">
              <input
                type="text"
                value={customItem}
                onChange={(e) => setCustomItem(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCustom()}
                placeholder="Add custom ingredient..."
                className="flex-1 h-12 px-5 rounded-full border-2 border-border bg-card focus:outline-none focus:border-primary transition-colors text-sm font-medium"
              />
              <Button onClick={addCustom} className="rounded-full px-5">
                <Plus size={16} strokeWidth={2.5} className="mr-1" /> ADD
              </Button>
            </div>

            {/* Just-added confirmation */}
            {justAdded && (
              <p className="badge-pop text-sm font-semibold mb-4" style={{ color: "hsl(var(--primary))" }}>
                ✓ "{justAdded}" added to your pantry
              </p>
            )}

            {/* Save button */}
            <Button
              variant="hero"
              className="w-full mt-6 h-14 text-base"
              onClick={handleSave}
              disabled={saved}
            >
              {saved ? (
                <span className="save-success flex items-center gap-2">
                  <Check size={18} strokeWidth={3} /> Pantry Saved!
                </span>
              ) : (
                "SAVE MY PANTRY →"
              )}
            </Button>

          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};
export default Pantry;