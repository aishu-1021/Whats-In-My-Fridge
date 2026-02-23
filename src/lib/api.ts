import { Recipe } from "@/contexts/AppContext";

const API_BASE = "http://localhost:5000";

// Mock data for when the API is unavailable
const mockRecipes: Recipe[] = [
  { id: 1, title: "Aloo Tikki Chaat", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop", usedIngredientCount: 3, missedIngredientCount: 2, missedIngredients: ["Tamarind Chutney", "Yogurt"] },
  { id: 2, title: "Paneer Butter Masala", image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop", usedIngredientCount: 4, missedIngredientCount: 1, missedIngredients: ["Cream"] },
  { id: 3, title: "Masala Dosa", image: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&h=300&fit=crop", usedIngredientCount: 2, missedIngredientCount: 3, missedIngredients: ["Urad Dal", "Fenugreek Seeds", "Coconut Chutney"] },
  { id: 4, title: "Pav Bhaji", image: "https://images.unsplash.com/photo-1606491956689-2ea866880049?w=400&h=300&fit=crop", usedIngredientCount: 5, missedIngredientCount: 1, missedIngredients: ["Pav Bread"] },
  { id: 5, title: "Chole Bhature", image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=400&h=300&fit=crop", usedIngredientCount: 3, missedIngredientCount: 2, missedIngredients: ["Bhature Flour", "Amchur Powder"] },
  { id: 6, title: "Vada Pav", image: "https://images.unsplash.com/photo-1606491956689-2ea866880049?w=400&h=300&fit=crop", usedIngredientCount: 4, missedIngredientCount: 2, missedIngredients: ["Pav Bread", "Dry Garlic Chutney"] },
  { id: 7, title: "Samosa Chaat", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop", usedIngredientCount: 2, missedIngredientCount: 3, missedIngredients: ["Samosa Shells", "Green Chutney", "Sev"] },
  { id: 8, title: "Butter Chicken", image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop", usedIngredientCount: 5, missedIngredientCount: 1, missedIngredients: ["Kasuri Methi"] },
];

export async function searchRecipes(ingredients: string, number = 8): Promise<Recipe[]> {
  try {
    const res = await fetch(`${API_BASE}/recipes?ingredients=${encodeURIComponent(ingredients)}&number=${number}`);
    if (!res.ok) throw new Error("API error");
    return await res.json();
  } catch {
    // Return mock data filtered loosely by ingredients
    const query = ingredients.toLowerCase();
    return mockRecipes.filter((r) =>
      r.title.toLowerCase().includes(query) || query.split(",").some((q) => q.trim().length > 0)
    );
  }
}

export async function getRecipeDetail(id: number): Promise<Recipe | null> {
  try {
    const res = await fetch(`${API_BASE}/recipes/${id}`);
    if (!res.ok) throw new Error("API error");
    return await res.json();
  } catch {
    const recipe = mockRecipes.find((r) => r.id === id);
    if (!recipe) return null;
    return {
      ...recipe,
      readyInMinutes: 30,
      servings: 4,
      instructions: "<ol><li><b>Prep the ingredients</b> — Wash and chop all vegetables. Gather your spices.</li><li><b>Heat the oil</b> — In a large kadai or wok, heat oil over medium-high flame until shimmering.</li><li><b>Add the aromatics</b> — Toss in cumin seeds, mustard seeds, and curry leaves. Let them splutter for 30 seconds.</li><li><b>Cook the base</b> — Add onions and sauté until golden brown. Add ginger-garlic paste and cook for 2 minutes.</li><li><b>Add spices</b> — Stir in turmeric, red chili powder, coriander powder, and garam masala. Cook for 1 minute.</li><li><b>Combine and simmer</b> — Add the main ingredients and mix well. Cover and cook on low heat for 15 minutes.</li><li><b>Finish and serve</b> — Garnish with fresh coriander leaves and a squeeze of lemon. Serve hot with rice or roti.</li></ol>",
      sourceUrl: "https://example.com/recipe",
      extendedIngredients: [
        { name: "Potatoes", amount: 3, unit: "medium" },
        { name: "Onions", amount: 2, unit: "large" },
        { name: "Tomatoes", amount: 2, unit: "medium" },
        { name: "Green Chilies", amount: 3, unit: "pcs" },
        { name: "Ginger", amount: 1, unit: "inch" },
        { name: "Garlic", amount: 4, unit: "cloves" },
        { name: "Cumin Seeds", amount: 1, unit: "tsp" },
        { name: "Turmeric", amount: 0.5, unit: "tsp" },
        { name: "Red Chili Powder", amount: 1, unit: "tsp" },
        { name: "Garam Masala", amount: 1, unit: "tsp" },
        { name: "Coriander Leaves", amount: 1, unit: "bunch" },
        { name: "Oil", amount: 2, unit: "tbsp" },
      ],
    };
  }
}
