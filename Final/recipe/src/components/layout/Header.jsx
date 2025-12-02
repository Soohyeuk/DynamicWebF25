import { Link, useLocation, useNavigate } from "react-router-dom";
import Container from "../ui/Container";
import Button from "../ui/Button";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";
  const isSaved = location.pathname === "/saved";
  const isAdd = location.pathname === "/add";

  return (
    <header className="border-b bg-purple-50">
      <Container className="py-8 flex items-center justify-between">
        <Link to="/" className="hover:opacity-80 transition-opacity">
          <h1 className="text-3xl font-bold tracking-tight text-purple-800">
            Recipe Keeper
          </h1>
          <p className="mt-1 text-sm text-gray-600">Your personal recipe collection</p>
        </Link>
        <nav className="flex gap-3">
          <Button 
            onClick={() => navigate("/")} 
            variant={isHome ? "primary" : "secondary"}
          >
            Home
          </Button>
          <Button 
            onClick={() => navigate("/saved")} 
            variant={isSaved ? "primary" : "secondary"}
          >
            Saved
          </Button>
          <Button 
            onClick={() => navigate("/add")} 
            variant={isAdd ? "primary" : "secondary"}
          >
            + Add Recipe
          </Button>
        </nav>
      </Container>
    </header>
  );
}


