import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Container from "../components/ui/Container";
import Header from "../components/layout/Header";
import Badge from "../components/ui/Badge";
import { getRecipeById, saveRecipe, removeRecipe, isRecipeSaved } from "../lib/storage";
import { dummyRecipes } from "../data/dummyRecipes";

export default function RecipeDetail() {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Find recipe by video_id
    const found = getRecipeById(videoId, dummyRecipes);
    if (found) {
      setRecipe(found);
      setSaved(isRecipeSaved(videoId));
    }
  }, [videoId]);

  const handleToggleSave = () => {
    if (saved) {
      removeRecipe(videoId);
      setSaved(false);
    } else {
      saveRecipe(recipe);
      setSaved(true);
    }
  };

  if (!recipe) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900">
        <Header />
        <Container className="py-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Recipe not found</h2>
          <button
            onClick={() => navigate("/")}
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            ← Back to recipes
          </button>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900">
      <Header />
      
      <main>
        <Container className="py-12">
          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="mb-6 inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          {/* Recipe header */}
          <div className="bg-white rounded-xl shadow-sm border p-8 mb-6">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-4xl font-bold text-gray-900">{recipe.title}</h1>
              <button
                onClick={handleToggleSave}
                className={`rounded-full p-3 transition-colors ${
                  saved
                    ? "bg-red-50 text-red-500 hover:bg-red-100"
                    : "bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-red-500"
                }`}
              >
                <svg className="w-6 h-6" fill={saved ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            {/* Meta info */}
            <div className="flex flex-wrap gap-3 mb-6">
              {recipe.servings && <Badge color="green">Serves {recipe.servings}</Badge>}
              {recipe.prep_time && <Badge color="gray">Prep {recipe.prep_time}</Badge>}
              {recipe.cook_time && <Badge color="amber">Cook {recipe.cook_time}</Badge>}
            </div>

            {/* Nutrition info */}
            {recipe.calories && (
              <div className="border-t pt-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Nutritional Information</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-gray-900">{recipe.calories}</div>
                    <div className="text-xs text-gray-600">Calories</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-gray-900">{recipe.protein}g</div>
                    <div className="text-xs text-gray-600">Protein</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-gray-900">{recipe.carbs}g</div>
                    <div className="text-xs text-gray-600">Carbs</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-gray-900">{recipe.fat}g</div>
                    <div className="text-xs text-gray-600">Fat</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Ingredients */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Ingredients</h2>
              <ul className="space-y-3">
                {recipe.ingredients.map((ingredient) => (
                  <li key={ingredient.id} className="flex items-start">
                    <svg className="w-5 h-5 text-indigo-600 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <span className="font-medium text-gray-900">{ingredient.name}</span>
                      <span className="text-gray-600"> — {ingredient.quantity}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Steps */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Instructions</h2>
              <ol className="space-y-4">
                {recipe.steps.map((step) => (
                  <li key={step.id} className="flex items-start">
                    <span className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm mr-4">
                      {step.step_number}
                    </span>
                    <p className="text-gray-700 pt-1">{step.description}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Video link */}
          {recipe.video_id && (
            <div className="mt-6 bg-indigo-50 rounded-xl p-6 text-center">
              <p className="text-sm text-gray-600 mb-3">Watch the original video on YouTube</p>
              <a
                href={`https://www.youtube.com/watch?v=${recipe.video_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-lg bg-red-600 px-6 py-3 text-sm font-medium text-white hover:bg-red-700 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                Watch on YouTube
              </a>
            </div>
          )}
        </Container>
      </main>
    </div>
  );
}

