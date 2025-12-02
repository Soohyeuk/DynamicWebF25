import { createContext, useContext, useEffect, useState } from "react";
import { fetchRecipes, fetchRecipeByVideoId } from "../lib/api";

const RecipesContext = createContext(null);

export function RecipesProvider({ children }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadRecipes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRecipes();
      setRecipes(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load recipes from server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadRecipes();
  }, []);

  const getRecipeByVideoId = async (videoId) => {
    // Try to find in current state first
    const existing = recipes.find((r) => r.video_id === videoId);
    if (existing) return existing;
    // Fallback to API (e.g., when navigating directly to a new recipe)
    const data = await fetchRecipeByVideoId(videoId);
    // Optionally merge into state so it appears on Home next time
    setRecipes((prev) => {
      const exists = prev.some((r) => r.video_id === data.video_id);
      return exists ? prev : [data, ...prev];
    });
    return data;
  };

  const value = {
    recipes,
    loading,
    error,
    reload: loadRecipes,
    getRecipeByVideoId,
  };

  return (
    <RecipesContext.Provider value={value}>{children}</RecipesContext.Provider>
  );
}

export function useRecipes() {
  const ctx = useContext(RecipesContext);
  if (!ctx) {
    throw new Error("useRecipes must be used within a RecipesProvider");
  }
  return ctx;
}


