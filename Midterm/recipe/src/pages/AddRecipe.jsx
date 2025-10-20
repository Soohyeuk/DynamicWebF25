import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../components/ui/Container";
import Button from "../components/ui/Button";
import Header from "../components/layout/Header";

export default function AddRecipe() {
  const navigate = useNavigate();
  const [videoId, setVideoId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // This is for later
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

              <div className="flex gap-3">
                <Button type="button" onClick={() => navigate("/")} variant="secondary" fullWidth>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" fullWidth>
                  Generate Recipe
                </Button>
              </div>
            </form>
          </div>
        </Container>
      </main>
    </div>
  );
}

