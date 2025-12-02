const STORAGE_KEY = "saved_recipes";

// Get all saved recipes from localStorage
export function getSavedRecipes() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error("Error reading saved recipes:", error);
    return [];
  }
}

// Save a recipe to localStorage
export function saveRecipe(recipe) {
  try {
    const saved = getSavedRecipes();
    // Check if recipe already exists (by video_id)
    const exists = saved.some((r) => r.video_id === recipe.video_id);
    if (!exists) {
      saved.push(recipe);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    }
  } catch (error) {
    console.error("Error saving recipe:", error);
  }
}

// Remove a recipe from localStorage
export function removeRecipe(videoId) {
  try {
    const saved = getSavedRecipes();
    const filtered = saved.filter((r) => r.video_id !== videoId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Error removing recipe:", error);
  }
}

// Check if a recipe is saved
export function isRecipeSaved(videoId) {
  const saved = getSavedRecipes();
  return saved.some((r) => r.video_id === videoId);
}

// Get a single recipe by video_id (from saved or provided list)
export function getRecipeById(videoId, allRecipes = []) {
  const saved = getSavedRecipes();
  const savedRecipe = saved.find((r) => r.video_id === videoId);
  if (savedRecipe) return savedRecipe;
  
  return allRecipes.find((r) => r.video_id === videoId) || null;
}

