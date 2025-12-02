import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../components/ui/Container";
import Button from "../components/ui/Button";
import Header from "../components/layout/Header";
import RecipeList from "../components/recipes/RecipeList";
import { getSavedRecipes, removeRecipe } from "../lib/storage";
import { AiOutlineHeart } from "react-icons/ai";

export default function Saved() {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setSavedRecipes(getSavedRecipes());
  }, []);

  const handleUnsave = (videoId) => {
    removeRecipe(videoId);
    setSavedRecipes(getSavedRecipes());
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900">
      <Header />
      
      <main>
        <Container className="py-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Saved Recipes</h2>
            <p className="text-gray-600">Your personal collection of favorite recipes</p>
          </div>

          {savedRecipes.length === 0 ? (
            <div className="rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
              <AiOutlineHeart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No saved recipes yet</h3>
              <p className="text-gray-600 mb-6">Start saving recipes from the home page to see them here</p>
              <Button onClick={() => navigate("/")}>
                Browse Recipes
              </Button>
            </div>
          ) : (
            <RecipeList recipes={savedRecipes} onUnsave={handleUnsave} />
          )}
        </Container>
      </main>
    </div>
  );
}

