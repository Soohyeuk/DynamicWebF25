const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000";

export async function fetchRecipes() {
  const res = await fetch(`${API_BASE_URL}/recipes`);
  if (!res.ok) {
    throw new Error(`Failed to fetch recipes: ${res.statusText}`);
  }
  return res.json();
}

export async function fetchRecipeByVideoId(videoId) {
  const res = await fetch(`${API_BASE_URL}/recipes/video/${videoId}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch recipe: ${res.statusText}`);
  }
  return res.json();
}

export async function generateRecipeFromVideo(videoId, language = "en") {
  const res = await fetch(`${API_BASE_URL}/scrape_video_id`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: videoId, language }),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    const detail = errorBody?.detail || res.statusText;
    throw new Error(`Failed to generate recipe: ${detail}`);
  }

  return res.json();
}

export { API_BASE_URL };


