import { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useApp } from "@/contexts/AppContext";
import { Check, Plus } from "lucide-react";

const defaultStaples = [
  "Oil", "Turmeric", "Garlic", "Cumin", "Rice", "Lentils", "Onions",
  "Potatoes", "Ginger", "Chili Powder", "Salt", "Mustard Seeds", "Coriander",
];

const Pantry = () => {
  const { pantryItems, savePantryToDB } = useApp();
  const [selected, setSelected] = useState<string[]>([]);
  const [customItem, setCustomItem] = useState("");
  const [allItems, setAllItems] = useState(defaultStaples);

  //Sync with database when pantryItems loads
  useEffect(() => {
      if (pantryItems.length > 0) {
          setSelected(pantryItems);
          //Add any custom items from DB that aren't in defaultStaples
          const customFromDB = pantryItems.filter(
              (item) => !defaultStaples.map((s) => s.toLowerCase()).includes(item.toLowerCase())
          );
      if (customFromDB.length > 0) {
          setAllItems((prev) => [
              ...prev,
              ...customFromDB.map((i) => i.charAt(0).toUpperCase() + i.slice(1))
          ]);
      }
      }
  }, [pantryItems]);
  const navigate = useNavigate();

  const toggleItem = (item: string) => {
    setSelected((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const addCustom = () => {
    if (customItem.trim() && !allItems.includes(customItem.trim())) {
      setAllItems((prev) => [...prev, customItem.trim()]);
      setSelected((prev) => [...prev, customItem.trim()]);
      setCustomItem("");
    }
  };

  const handleSave = async () => {
    await savePantryToDB(selected);
    navigate("/preferences");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-background py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Progress */}
          <div className="mb-8">
            <p className="font-bold text-sm text-muted-foreground mb-2">STEP 1 OF 2 — PANTRY SETUP</p>
            <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full w-1/2 transition-all" />
            </div>
          </div>

          <h1 className="font-display text-4xl md:text-5xl text-primary mb-2">YOUR PANTRY STAPLES</h1>
          <p className="text-muted-foreground mb-8">Tell us what you always have at home — we'll never ask again.</p>

          <div className="flex flex-wrap gap-3 mb-8">
            {allItems.map((item) => {
              const isSelected = selected.includes(item);
              return (
                <button
                  key={item}
                  onClick={() => toggleItem(item)}
                  className={`flex items-center gap-2 font-bold text-sm px-5 py-3 rounded-full border-2 transition-all ${
                    isSelected
                      ? "bg-secondary text-secondary-foreground border-secondary"
                      : "bg-card text-foreground border-border hover:border-primary"
                  }`}
                >
                  {isSelected ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  {item}
                </button>
              );
            })}
          </div>

          <div className="flex gap-3 mb-10">
            <input
              type="text"
              value={customItem}
              onChange={(e) => setCustomItem(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCustom()}
              placeholder="Add custom ingredient..."
              className="flex-1 h-12 px-5 rounded-full border-2 border-border bg-card focus:outline-none focus:border-primary transition-colors"
            />
            <Button onClick={addCustom}>ADD +</Button>
          </div>

          <Button variant="hero" className="w-full" onClick={handleSave}>
            SAVE MY PANTRY →
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Pantry;
