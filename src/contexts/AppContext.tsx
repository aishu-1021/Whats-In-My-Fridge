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
  id?: number;
  name: string;
  bought: boolean;
}

export interface UserProfile {
  username: string;
  handle: string;
  bio?: string;           // ← added
  avatar?: string;        // ← added (base64 data URL or hosted URL)
  is_vegetarian: boolean;
  is_vegan: boolean;
  is_gluten_free: boolean;
  is_non_vegetarian: boolean;
  spice_level: number;
  cuisine_moods: string[];
}

export interface User {
  id: number;
  username: string;
  email: string;
}

interface AppState {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  savedRecipes: Recipe[];
  bazaarList: BazaarItem[];
  pantryItems: string[];
  profile: UserProfile;
  dietaryPreferences: string[];
  allergies: string[];
  searchQuery: string;
  dbLoading: boolean;
  toggleSaveRecipe: (recipe: Recipe) => void;
  isRecipeSaved: (id: number) => boolean;
  addToBazaar: (ingredients: any[]) => void;
  toggleBazaarItem: (item: BazaarItem) => void;
  removeBazaarItem: (item: BazaarItem) => void;
  addBazaarItem: (name: string) => void;
  setPantryItems: (items: string[]) => void;
  savePantryToDB: (items: string[]) => Promise<void>;
  saveProfile: (profileData: UserProfile) => Promise<void>;
  setDietaryPreferences: (prefs: string[]) => void;
  setAllergies: (allergies: string[]) => void;
  setSearchQuery: (query: string) => void;
}

// -------------------------------------------------------
// DEFAULTS
// -------------------------------------------------------

const defaultProfile: UserProfile = {
  username: "Chef Foodie",
  handle: "@cheffoodie",
  bio: "",
  avatar: "",
  is_vegetarian: false,
  is_vegan: false,
  is_gluten_free: false,
  is_non_vegetarian: true,
  spice_level: 3,
  cuisine_moods: [],
};

const AppContext = createContext<AppState | undefined>(undefined);

// -------------------------------------------------------
// PROVIDER
// -------------------------------------------------------

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    try { return JSON.parse(localStorage.getItem("user") || "null"); } catch { return null; }
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));

  const [savedRecipes,        setSavedRecipes]        = useState<Recipe[]>([]);
  const [bazaarList,          setBazaarList]           = useState<BazaarItem[]>([]);
  const [pantryItems,         setPantryItems]          = useState<string[]>([]);
  const [profile,             setProfile]              = useState<UserProfile>(defaultProfile);
  const [dietaryPreferences,  setDietaryPreferences]   = useState<string[]>([]);
  const [allergies,           setAllergies]            = useState<string[]>([]);
  const [searchQuery,         setSearchQuery]          = useState("");
  const [dbLoading,           setDbLoading]            = useState(false);

  const isLoggedIn = !!user && !!token;

  const authHeaders = (tok: string) => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${tok}`,
  });

  // -------------------------------------------------------
  // LOAD USER DATA
  // -------------------------------------------------------

  const loadUserData = async (tok: string) => {
    setDbLoading(true);
    try {
      const [pantryRes, profileRes, savedRes, bazaarRes] = await Promise.all([
        fetch(`${API_BASE}/pantry`,   { headers: authHeaders(tok) }),
        fetch(`${API_BASE}/profile`,  { headers: authHeaders(tok) }),
        fetch(`${API_BASE}/saved`,    { headers: authHeaders(tok) }),
        fetch(`${API_BASE}/bazaar`,   { headers: authHeaders(tok) }),
      ]);

      if (pantryRes.ok)  setPantryItems(await pantryRes.json());
      if (profileRes.ok) setProfile(await profileRes.json());
      if (savedRes.ok)   setSavedRecipes(await savedRes.json());
      if (bazaarRes.ok) {
        const bazaarData = await bazaarRes.json();
        setBazaarList(bazaarData.map((item: any) => ({
          id: item.id,
          name: item.ingredient,
          bought: item.is_bought,
        })));
      }
    } catch (err) {
      console.error("Failed to load user data:", err);
    } finally {
      setDbLoading(false);
    }
  };

  useEffect(() => {
    if (token && user) loadUserData(token);
  }, []);

  const clearUserData = () => {
    setSavedRecipes([]);
    setBazaarList([]);
    setPantryItems([]);
    setProfile(defaultProfile);
  };

  // -------------------------------------------------------
  // AUTH
  // -------------------------------------------------------

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed");
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    await loadUserData(data.token);
  };

  const register = async (username: string, email: string, password: string) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Registration failed");
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    clearUserData();
  };

  // -------------------------------------------------------
  // SAVED RECIPES
  // -------------------------------------------------------

  const toggleSaveRecipe = async (recipe: Recipe) => {
    if (!token) return;
    const alreadySaved = savedRecipes.some((r) => r.id === recipe.id);
    if (alreadySaved) {
      try { await fetch(`${API_BASE}/saved/${recipe.id}`, { method: "DELETE", headers: authHeaders(token) }); }
      catch (err) { console.error(err); }
      setSavedRecipes((prev) => prev.filter((r) => r.id !== recipe.id));
    } else {
      try { await fetch(`${API_BASE}/saved`, { method: "POST", headers: authHeaders(token), body: JSON.stringify(recipe) }); }
      catch (err) { console.error(err); }
      setSavedRecipes((prev) => [...prev, recipe]);
    }
  };

  const isRecipeSaved = (id: number) => savedRecipes.some((r) => r.id === id);

  // -------------------------------------------------------
  // BAZAAR
  // -------------------------------------------------------

  const addToBazaar = async (ingredients: any[]) => {
    if (!token) return;
    try {
      await fetch(`${API_BASE}/bazaar`, {
        method: "POST",
        headers: authHeaders(token),
        body: JSON.stringify({ ingredients }),
      });
      const res = await fetch(`${API_BASE}/bazaar`, { headers: authHeaders(token) });
      const data = await res.json();
      setBazaarList(data.map((item: any) => ({ id: item.id, name: item.ingredient, bought: item.is_bought })));
    } catch (err) {
      const newItems = ingredients
        .map((i) => ({ name: typeof i === "string" ? i : i.name, bought: false }))
        .filter((i) => !bazaarList.find((b) => b.name.toLowerCase() === i.name.toLowerCase()));
      setBazaarList((prev) => [...prev, ...newItems]);
    }
  };

  const toggleBazaarItem = async (item: BazaarItem) => {
    if (item.id && token) {
      try { await fetch(`${API_BASE}/bazaar/${item.id}`, { method: "PATCH", headers: authHeaders(token) }); }
      catch (err) { console.error(err); }
    }
    setBazaarList((prev) => prev.map((i) => (i.name === item.name ? { ...i, bought: !i.bought } : i)));
  };

  const removeBazaarItem = async (item: BazaarItem) => {
    if (item.id && token) {
      try { await fetch(`${API_BASE}/bazaar/${item.id}`, { method: "DELETE", headers: authHeaders(token) }); }
      catch (err) { console.error(err); }
    }
    setBazaarList((prev) => prev.filter((i) => i.name !== item.name));
  };

  const addBazaarItem = async (name: string) => {
    if (!name.trim() || !token) return;
    if (bazaarList.find((i) => i.name.toLowerCase() === name.toLowerCase())) return;
    try {
      await fetch(`${API_BASE}/bazaar`, {
        method: "POST",
        headers: authHeaders(token),
        body: JSON.stringify({ ingredients: [name.trim()] }),
      });
      const res = await fetch(`${API_BASE}/bazaar`, { headers: authHeaders(token) });
      const data = await res.json();
      setBazaarList(data.map((item: any) => ({ id: item.id, name: item.ingredient, bought: item.is_bought })));
    } catch (err) {
      setBazaarList((prev) => [...prev, { name: name.trim(), bought: false }]);
    }
  };

  // -------------------------------------------------------
  // PANTRY
  // -------------------------------------------------------

  const savePantryToDB = async (items: string[]) => {
    setPantryItems(items);
    if (!token) return;
    try {
      await fetch(`${API_BASE}/pantry`, {
        method: "POST",
        headers: authHeaders(token),
        body: JSON.stringify({ ingredients: items }),
      });
    } catch (err) { console.error(err); }
  };

  // -------------------------------------------------------
  // PROFILE
  // -------------------------------------------------------

  const saveProfile = async (profileData: UserProfile) => {
    setProfile(profileData);
    if (!token) return;
    try {
      await fetch(`${API_BASE}/profile`, {
        method: "POST",
        headers: authHeaders(token),
        body: JSON.stringify(profileData),
      });
    } catch (err) { console.error(err); }
  };

  // -------------------------------------------------------
  // CONTEXT VALUE
  // -------------------------------------------------------

  return (
    <AppContext.Provider value={{
      user, token, isLoggedIn, login, register, logout,
      savedRecipes, bazaarList, pantryItems, profile,
      dietaryPreferences, allergies, searchQuery, dbLoading,
      toggleSaveRecipe, isRecipeSaved,
      addToBazaar, toggleBazaarItem, removeBazaarItem, addBazaarItem,
      setPantryItems, savePantryToDB,
      saveProfile,
      setDietaryPreferences, setAllergies, setSearchQuery,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};