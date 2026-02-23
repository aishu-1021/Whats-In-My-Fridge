import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useApp } from "@/contexts/AppContext";
import { X } from "lucide-react";

const dietOptions = [
  { key: "non-veg", icon: "🍗", title: "NON-VEG", sub: "Bring on the chicken tikka" },
  { key: "vegetarian", icon: "🥬", title: "VEGETARIAN", sub: "Plants have power" },
  { key: "vegan", icon: "🌱", title: "VEGAN", sub: "100% plant-based" },
  { key: "gluten-free", icon: "🌾", title: "GLUTEN-FREE", sub: "No wheat, no problem" },
  { key: "dairy-free", icon: "🥛", title: "DAIRY-FREE", sub: "Skip the dairy" },
];

const Preferences = () => {
  const { dietaryPreferences, setDietaryPreferences, allergies, setAllergies } = useApp();
  const [selected, setSelected] = useState<string[]>(dietaryPreferences);
  const [allergyInput, setAllergyInput] = useState("");
  const [localAllergies, setLocalAllergies] = useState<string[]>(allergies);
  const navigate = useNavigate();

  const toggleDiet = (key: string) => {
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const addAllergy = () => {
    if (allergyInput.trim() && !localAllergies.includes(allergyInput.trim())) {
      setLocalAllergies((prev) => [...prev, allergyInput.trim()]);
      setAllergyInput("");
    }
  };

  const removeAllergy = (a: string) => {
    setLocalAllergies((prev) => prev.filter((x) => x !== a));
  };

  const handleFinish = () => {
    setDietaryPreferences(selected);
    setAllergies(localAllergies);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-background py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Progress */}
          <div className="mb-8">
            <p className="font-bold text-sm text-muted-foreground mb-2">STEP 2 OF 2 — DIETARY PREFERENCES</p>
            <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full w-full transition-all" />
            </div>
          </div>

          <h1 className="font-display text-4xl md:text-5xl text-primary mb-2">YOUR FOOD RULES</h1>
          <p className="text-muted-foreground mb-8">Tell us what you love (and what you don't).</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-10">
            {dietOptions.map((opt) => {
              const isActive = selected.includes(opt.key);
              return (
                <button
                  key={opt.key}
                  onClick={() => toggleDiet(opt.key)}
                  className={`flex flex-col items-center p-4 rounded-2xl border-3 transition-all text-center ${
                    isActive
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card hover:border-primary/50"
                  }`}
                  style={{ borderWidth: "3px" }}
                >
                  <span className="text-3xl mb-2">{opt.icon}</span>
                  <span className="font-bold text-xs">{opt.title}</span>
                  <span className="text-xs text-muted-foreground mt-1">{opt.sub}</span>
                </button>
              );
            })}
          </div>

          {/* Allergies */}
          <div className="mb-10">
            <h3 className="font-bold text-sm mb-3">DO YOU HAVE ANY SPECIFIC ALLERGIES?</h3>
            <div className="flex gap-3 mb-4">
              <input
                type="text"
                value={allergyInput}
                onChange={(e) => setAllergyInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addAllergy()}
                placeholder="e.g. Tree Nuts"
                className="flex-1 h-12 px-5 rounded-full border-2 border-border bg-card focus:outline-none focus:border-primary transition-colors"
              />
              <Button onClick={addAllergy}>ADD</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {localAllergies.map((a) => (
                <span key={a} className="flex items-center gap-1 bg-primary/10 text-primary font-bold text-sm px-4 py-2 rounded-full">
                  {a}
                  <button onClick={() => removeAllergy(a)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <Button variant="hero" className="w-full mb-3" onClick={handleFinish}>
            FINISH SETUP →
          </Button>
          <button onClick={() => navigate("/")} className="block mx-auto text-sm text-muted-foreground hover:text-primary">
            Skip for now
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Preferences;
