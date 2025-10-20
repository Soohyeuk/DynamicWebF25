import RecipeCard from "./RecipeCard";

export default function RecipeList({ recipes }) {
  if (!recipes?.length) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center text-sm text-gray-500">
        No recipes yet.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {recipes.map((r) => (
        <RecipeCard key={r.video_id} recipe={r} />
      ))}
    </div>
  );
}


