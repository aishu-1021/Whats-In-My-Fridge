import { Recipe } from "@/contexts/AppContext";

const API_BASE = "http://localhost:5000";

export async function searchRecipes(ingredients: string, number = 6): Promise<Recipe[]> {
  const res = await fetch(`${API_BASE}/recipes?ingredients=${encodeURIComponent(ingredients)}&number=${number}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return await res.json();
}

export async function getRecipeDetail(id: number): Promise<Recipe> {
  const res = await fetch(`${API_BASE}/recipes/${id}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return await res.json();
}
