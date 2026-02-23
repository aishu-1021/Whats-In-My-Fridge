import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Recipe {
  id: number;
  title: string;
  image: string;
  usedIngredientCount: number;
  missedIngredientCount: number;
  missedIngredients: string[];
  readyInMinutes?: number;
  servings?: number;
  instructions?: string;
  sourceUrl?: string;
  extendedIngredients?: { name: string; amount: number; unit: string }[];
}

interface AppState {
  savedRecipes: Recipe[];
  bazaarList: { name: string; bought: boolean }[];
  pantryItems: string[];
  dietaryPreferences: string[];
  allergies: string[];
  spiceLevel: number;
  cuisineMoods: string[];
  searchQuery: string;
  toggleSaveRecipe: (recipe: Recipe) => void;
  isRecipeSaved: (id: number) => boolean;
  addToBazaar: (ingredients: string[]) => void;
  toggleBazaarItem: (name: string) => void;
  removeBazaarItem: (name: string) => void;
  addBazaarItem: (name: string) => void;
  setPantryItems: (items: string[]) => void;
  setDietaryPreferences: (prefs: string[]) => void;
  setAllergies: (allergies: string[]) => void;
  setSpiceLevel: (level: number) => void;
  setCuisineMoods: (moods: string[]) => void;
  setSearchQuery: (query: string) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [bazaarList, setBazaarList] = useState<{ name: string; bought: boolean }[]>([]);
  const [pantryItems, setPantryItems] = useState<string[]>([]);
  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>([]);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [spiceLevel, setSpiceLevel] = useState(3);
  const [cuisineMoods, setCuisineMoods] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleSaveRecipe = (recipe: Recipe) => {
    setSavedRecipes((prev) =>
      prev.find((r) => r.id === recipe.id)
        ? prev.filter((r) => r.id !== recipe.id)
        : [...prev, recipe]
    );
  };

  const isRecipeSaved = (id: number) => savedRecipes.some((r) => r.id === id);

  const addToBazaar = (ingredients: string[]) => {
    setBazaarList((prev) => {
      const existing = prev.map((i) => i.name.toLowerCase());
      const newItems = ingredients
        .filter((i) => !existing.includes(i.toLowerCase()))
        .map((name) => ({ name, bought: false }));
      return [...prev, ...newItems];
    });
  };

  const toggleBazaarItem = (name: string) => {
    setBazaarList((prev) =>
      prev.map((i) => (i.name === name ? { ...i, bought: !i.bought } : i))
    );
  };

  const removeBazaarItem = (name: string) => {
    setBazaarList((prev) => prev.filter((i) => i.name !== name));
  };

  const addBazaarItem = (name: string) => {
    if (name.trim() && !bazaarList.find((i) => i.name.toLowerCase() === name.toLowerCase())) {
      setBazaarList((prev) => [...prev, { name: name.trim(), bought: false }]);
    }
  };

  return (
    <AppContext.Provider
      value={{
        savedRecipes, bazaarList, pantryItems, dietaryPreferences, allergies,
        spiceLevel, cuisineMoods, searchQuery,
        toggleSaveRecipe, isRecipeSaved, addToBazaar, toggleBazaarItem,
        removeBazaarItem, addBazaarItem, setPantryItems, setDietaryPreferences,
        setAllergies, setSpiceLevel, setCuisineMoods, setSearchQuery,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
