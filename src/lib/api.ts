import { Recipe } from "@/contexts/AppContext";
const API_BASE = "https://whats-in-my-fridge-3yn4.onrender.com";

export async function searchRecipes(ingredients: string, number = 50, diet = ""): Promise<Recipe[]> {
  const params = new URLSearchParams();
  params.set("ingredients", ingredients);
  params.set("number", String(number));
  if (diet) params.set("diet", diet);

  const res = await fetch(`${API_BASE}/recipes?${params.toString()}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return await res.json();
}

export async function getRecipeDetail(id: number): Promise<Recipe> {
  const res = await fetch(`${API_BASE}/recipes/${id}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return await res.json();
}