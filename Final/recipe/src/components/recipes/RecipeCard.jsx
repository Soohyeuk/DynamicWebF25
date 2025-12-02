import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Badge from "../ui/Badge";
import { saveRecipe, removeRecipe, isRecipeSaved } from "../../lib/storage";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

export default function RecipeCard({ recipe }) {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isRecipeSaved(recipe.video_id));
  }, [recipe.video_id]);

  const handleToggleSave = (e) => {
    e.stopPropagation();
    if (saved) {
      removeRecipe(recipe.video_id);
      setSaved(false);
    } else {
      saveRecipe(recipe);
      setSaved(true);
    }
  };

  const handleClick = () => {
    navigate(`/recipe/${recipe.video_id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="group relative rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-lg hover:scale-[1.02] hover:border-indigo-200 cursor-pointer"
    >
      <div className="absolute top-3 right-3">
        <button
          onClick={handleToggleSave}
          className={`rounded-full p-2 transition-colors ${
            saved
              ? "bg-red-50 text-red-500 hover:bg-red-100"
              : "text-gray-400 hover:bg-gray-100 hover:text-red-500"
          }`}
        >
          {saved ? <AiFillHeart className="w-5 h-5" /> : <AiOutlineHeart className="w-5 h-5" />}
        </button>
      </div>
      <div className="mb-3 pr-8 text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition-colors">
        {recipe.title}
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        {recipe.servings && <Badge color="green">Serves {recipe.servings}</Badge>}
        {recipe.prep_time && <Badge color="gray">Prep {recipe.prep_time}</Badge>}
        {recipe.cook_time && <Badge color="amber">Cook {recipe.cook_time}</Badge>}
      </div>
      <div className="border-t pt-3 text-xs text-gray-500 line-clamp-2">
        <span className="font-medium text-gray-700">Ingredients: </span>
        {recipe.ingredients.slice(0, 4).map((i) => i.name).join(", ")}
        {recipe.ingredients.length > 4 ? "…" : ""}
      </div>
      {recipe.calories && (
        <div className="mt-3 flex gap-3 text-xs text-gray-500">
          <span>{recipe.calories} cal</span>
          <span>•</span>
          <span>{recipe.protein}g protein</span>
        </div>
      )}
    </div>
  );
}


