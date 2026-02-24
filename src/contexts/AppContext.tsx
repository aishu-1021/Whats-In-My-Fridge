import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

const API_BASE = "http://localhost:5000";

// -------------------------------------------------------
// TYPES
// -------------------------------------------------------

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

export interface BazaarItem {
  id?: number;       // id from database
  name: string;
  bought: boolean;
}

export interface UserProfile {
  username: string;
  handle: string;
  is_vegetarian: boolean;
  is_vegan: boolean;
  is_gluten_free: boolean;
  is_non_vegetarian: boolean;
  spice_level: number;
  cuisine_moods: string[];
}

interface AppState {
  savedRecipes: Recipe[];
  bazaarList: BazaarItem[];
  pantryItems: string[];
  profile: UserProfile;
  dietaryPreferences: string[];
  allergies: string[];
  searchQuery: string;
  dbLoading: boolean;

  // Recipe actions
  toggleSaveRecipe: (recipe: Recipe) => void;
  isRecipeSaved: (id: number) => boolean;

  // Bazaar actions
  addToBazaar: (ingredients: any[]) => void;
  toggleBazaarItem: (item: BazaarItem) => void;
  removeBazaarItem: (item: BazaarItem) => void;
  addBazaarItem: (name: string) => void;

  // Pantry actions
  setPantryItems: (items: string[]) => void;
  savePantryToDB: (items: string[]) => Promise<void>;

  // Profile actions
  saveProfile: (profileData: UserProfile) => Promise<void>;

  // Other
  setDietaryPreferences: (prefs: string[]) => void;
  setAllergies: (allergies: string[]) => void;
  setSearchQuery: (query: string) => void;
}

// -------------------------------------------------------
// DEFAULT PROFILE
// -------------------------------------------------------

const defaultProfile: UserProfile = {
  username: "Chef Foodie",
  handle: "@cheffoodie",
  is_vegetarian: false,
  is_vegan: false,
  is_gluten_free: false,
  is_non_vegetarian: true,
  spice_level: 3,
  cuisine_moods: [],
};

// -------------------------------------------------------
// CONTEXT
// -------------------------------------------------------

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [bazaarList, setBazaarList] = useState<BazaarItem[]>([]);
  const [pantryItems, setPantryItems] = useState<string[]>([]);
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>([]);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dbLoading, setDbLoading] = useState(true);

  // -------------------------------------------------------
  // LOAD ALL DATA FROM DATABASE ON APP START
  // -------------------------------------------------------

  useEffect(() => {
    const loadAllData = async () => {
      try {
        // Load all four data sources in parallel
        const [pantryRes, profileRes, savedRes, bazaarRes] = await Promise.all([
          fetch(`${API_BASE}/pantry`),
          fetch(`${API_BASE}/profile`),
          fetch(`${API_BASE}/saved`),
          fetch(`${API_BASE}/bazaar`),
        ]);

        if (pantryRes.ok) {
          const pantryData = await pantryRes.json();
          setPantryItems(pantryData);
        }

        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setProfile(profileData);
        }

        if (savedRes.ok) {
          const savedData = await savedRes.json();
          setSavedRecipes(savedData);
        }

        if (bazaarRes.ok) {
          const bazaarData = await bazaarRes.json();
          // Map database format to app format
          setBazaarList(bazaarData.map((item: any) => ({
            id: item.id,
            name: item.ingredient,
            bought: item.is_bought,
          })));
        }
      } catch (err) {
        console.error("Could not connect to database:", err);
        // App still works with empty state if DB is unavailable
      } finally {
        setDbLoading(false);
      }
    };

    loadAllData();
  }, []);

  // -------------------------------------------------------
  // SAVED RECIPES — synced with database
  // -------------------------------------------------------

  const toggleSaveRecipe = async (recipe: Recipe) => {
    const alreadySaved = savedRecipes.some((r) => r.id === recipe.id);

    if (alreadySaved) {
      // Remove from DB
      try {
        await fetch(`${API_BASE}/saved/${recipe.id}`, { method: "DELETE" });
      } catch (err) {
        console.error("Failed to unsave recipe:", err);
      }
      setSavedRecipes((prev) => prev.filter((r) => r.id !== recipe.id));
    } else {
      // Save to DB
      try {
        await fetch(`${API_BASE}/saved`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(recipe),
        });
      } catch (err) {
        console.error("Failed to save recipe:", err);
      }
      setSavedRecipes((prev) => [...prev, recipe]);
    }
  };

  const isRecipeSaved = (id: number) => savedRecipes.some((r) => r.id === id);

  // -------------------------------------------------------
  // BAZAAR LIST — synced with database
  // -------------------------------------------------------

  const addToBazaar = async (ingredients: any[]) => {
    try {
      await fetch(`${API_BASE}/bazaar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients }),
      });
      // Reload bazaar from DB to get fresh IDs
      const res = await fetch(`${API_BASE}/bazaar`);
      const data = await res.json();
      setBazaarList(data.map((item: any) => ({
        id: item.id,
        name: item.ingredient,
        bought: item.is_bought,
      })));
    } catch (err) {
      console.error("Failed to add to bazaar:", err);
      // Fallback: add to local state only
      const newItems = ingredients
        .map((i) => ({ name: typeof i === "string" ? i : i.name, bought: false }))
        .filter((i) => !bazaarList.find((b) => b.name.toLowerCase() === i.name.toLowerCase()));
      setBazaarList((prev) => [...prev, ...newItems]);
    }
  };

  const toggleBazaarItem = async (item: BazaarItem) => {
    if (item.id) {
      try {
        await fetch(`${API_BASE}/bazaar/${item.id}`, { method: "PATCH" });
      } catch (err) {
        console.error("Failed to toggle bazaar item:", err);
      }
    }
    setBazaarList((prev) =>
      prev.map((i) => (i.name === item.name ? { ...i, bought: !i.bought } : i))
    );
  };

  const removeBazaarItem = async (item: BazaarItem) => {
    if (item.id) {
      try {
        await fetch(`${API_BASE}/bazaar/${item.id}`, { method: "DELETE" });
      } catch (err) {
        console.error("Failed to remove bazaar item:", err);
      }
    }
    setBazaarList((prev) => prev.filter((i) => i.name !== item.name));
  };

  const addBazaarItem = async (name: string) => {
    if (!name.trim()) return;
    if (bazaarList.find((i) => i.name.toLowerCase() === name.toLowerCase())) return;

    try {
      await fetch(`${API_BASE}/bazaar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients: [name.trim()] }),
      });
      const res = await fetch(`${API_BASE}/bazaar`);
      const data = await res.json();
      setBazaarList(data.map((item: any) => ({
        id: item.id,
        name: item.ingredient,
        bought: item.is_bought,
      })));
    } catch (err) {
      console.error("Failed to add bazaar item:", err);
      setBazaarList((prev) => [...prev, { name: name.trim(), bought: false }]);
    }
  };

  // -------------------------------------------------------
  // PANTRY — synced with database
  // -------------------------------------------------------

  const savePantryToDB = async (items: string[]) => {
    setPantryItems(items);
    try {
      await fetch(`${API_BASE}/pantry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients: items }),
      });
    } catch (err) {
      console.error("Failed to save pantry:", err);
    }
  };

  // -------------------------------------------------------
  // PROFILE — synced with database
  // -------------------------------------------------------

  const saveProfile = async (profileData: UserProfile) => {
    setProfile(profileData);
    try {
      await fetch(`${API_BASE}/profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });
    } catch (err) {
      console.error("Failed to save profile:", err);
    }
  };

  // -------------------------------------------------------
  // PROVIDER
  // -------------------------------------------------------

  return (
    <AppContext.Provider
      value={{
        savedRecipes, bazaarList, pantryItems, profile,
        dietaryPreferences, allergies, searchQuery, dbLoading,
        toggleSaveRecipe, isRecipeSaved,
        addToBazaar, toggleBazaarItem, removeBazaarItem, addBazaarItem,
        setPantryItems, savePantryToDB,
        saveProfile,
        setDietaryPreferences, setAllergies, setSearchQuery,
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