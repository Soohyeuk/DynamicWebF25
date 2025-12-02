import { useMemo, useState } from "react";
import Container from "../components/ui/Container";
import Header from "../components/layout/Header";
import SearchBar from "../components/recipes/SearchBar";
import RecipeList from "../components/recipes/RecipeList";
// import { dummyRecipes } from "../data/dummyRecipes";
import { useRecipes } from "../context/RecipesContext";

export default function Home() {
  const [query, setQuery] = useState("");
  const { recipes, loading, error } = useRecipes();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return recipes;
    return recipes.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.ingredients.some((i) => i.name.toLowerCase().includes(q))
    );
  }, [query, recipes]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900">
      <Header />
      
      {/* Hero Section */}
      <section className="border-b bg-white">
        <Container className="py-12 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            Discover Delicious Recipes
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Search through our collection of analyzed YouTube recipes using AI. Save your favorites and cook something amazing today.
          </p>
          <SearchBar onSearch={setQuery} />
        </Container>
      </section>

      <main>
        <Container className="py-12">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">
              {query ? `Search Results (${filtered.length})` : `All Recipes (${filtered.length})`}
            </h3>
          </div>
          {loading ? (
            <p className="text-gray-600">Loading recipes...</p>
          ) : error ? (
            <p className="text-red-500 text-sm">{error}</p>
          ) : (
            <RecipeList recipes={filtered} />
          )}
        </Container>
      </main>
    </div>
  );
}
