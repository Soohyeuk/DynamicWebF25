import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Saved from "./pages/Saved";
import AddRecipe from "./pages/AddRecipe";
import RecipeDetail from "./pages/RecipeDetail";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/saved" element={<Saved />} />
        <Route path="/add" element={<AddRecipe />} />
        <Route path="/recipe/:videoId" element={<RecipeDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
