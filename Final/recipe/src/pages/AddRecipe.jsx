import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../components/ui/Container";
import Button from "../components/ui/Button";
import Header from "../components/layout/Header";
import { generateRecipeFromVideo } from "../lib/api";
import { useRecipes } from "../context/RecipesContext";

export default function AddRecipe() {
  const navigate = useNavigate();
  const { reload } = useRecipes();
  const [videoId, setVideoId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Previously this was a placeholder.
    // We now call the backend to generate and store the recipe from YouTube.
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        await generateRecipeFromVideo(videoId, "en");
        // Reload recipes so the new one appears on Home
        await reload();
        // After generation, navigate to the detail page for this video
        navigate(`/recipe/${videoId}`);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to generate recipe");
      } finally {
        setLoading(false);
      }
    };
    void run();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900">
      <Header />
      
      <main>
        <Container className="py-12">
          <div className="max-w-2xl mx-auto">
            <div className="mb-8 text-center">
              <h2 className="text-4xl font-bold text-gray-900 mb-3">
                Add New Recipe
              </h2>
              <p className="text-gray-600">
                Enter a YouTube video ID to generate a recipe
              </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border p-8">
              <div className="mb-6">
                <label htmlFor="video-id" className="block text-sm font-medium text-gray-900 mb-2">
                  YouTube Video ID
                </label>
                <input
                  id="video-id"
                  type="text"
                  value={videoId}
                  onChange={(e) => setVideoId(e.target.value)}
                  placeholder="e.g., dQw4w9WgXcQ"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all"
                  required
                />
              </div>

              {error && (
                <p className="text-sm text-red-500 mb-4">
                  {error}
                </p>
              )}

              <div className="flex gap-3">
                <Button type="button" onClick={() => navigate("/")} variant="secondary" fullWidth>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" fullWidth>
                  {loading ? "Generating..." : "Generate Recipe"}
                </Button>
              </div>
            </form>
          </div>
        </Container>
      </main>
    </div>
  );
}

