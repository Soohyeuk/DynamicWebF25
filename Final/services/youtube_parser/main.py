"""
FastAPI server for YouTube video parsing and recipe generation.
"""

"""
To-do: 
 - i need to upload recipes to the db and log generation when scraping using channel handle and query. 
"""


import fastapi  # type: ignore
from fastapi import HTTPException, Header  # type: ignore
from fastapi.middleware.cors import CORSMiddleware  # type: ignore
from .yt_scrape import YouTubeScraper
from .recipe_gen import RecipeGenerator
from .types import ScrapeRequest, QueryRequest, VideoRequest
from dotenv import load_dotenv  # type: ignore
import os
from contextlib import asynccontextmanager
from typing import List, Dict, Any, Optional
import sqlite3

try:
    # Supabase is optional now – only required if not using SQLite
    from supabase import create_client, Client  # type: ignore
except ImportError:  # pragma: no cover - optional dependency for local dev
    create_client = None  # type: ignore
    Client = object  # type: ignore

yt_api_key: Optional[str] = None
openai_api_key: Optional[str] = None
supabase: Optional["Client"] = None

# database backend config
db_backend: str = "supabase"  # or "sqlite"
sqlite_conn: Optional[sqlite3.Connection] = None


def _init_sqlite(db_path: str) -> sqlite3.Connection:
    """
    Initialize a local SQLite database with the minimal schema
    needed for this service.
    """
    conn = sqlite3.connect(db_path, check_same_thread=False)
    conn.execute("PRAGMA foreign_keys = ON;")

    # Recipes table
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS recipes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            video_id TEXT NOT NULL,
            servings TEXT,
            prep_time TEXT,
            cook_time TEXT,
            calories REAL,
            protein REAL,
            carbs REAL,
            fat REAL
        );
        """
    )

    # Ingredients table
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS ingredients (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            recipe_id INTEGER,
            name TEXT,
            quantity TEXT,
            FOREIGN KEY (recipe_id) REFERENCES recipes (id) ON DELETE CASCADE
        );
        """
    )

    # Steps table
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS steps (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            recipe_id INTEGER,
            step_number INTEGER,
            description TEXT,
            FOREIGN KEY (recipe_id) REFERENCES recipes (id) ON DELETE CASCADE
        );
        """
    )

    # Recipe generations table
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS recipe_generations (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """
    )

    conn.commit()
    return conn


def _store_recipe_sqlite(user_id: str, recipe_data: Dict[str, Any]) -> None:
    """
    Store recipe, ingredients, steps and generation log into SQLite.
    """
    if sqlite_conn is None:
        raise RuntimeError("SQLite connection is not initialized")

    cur = sqlite_conn.cursor()

    recipe_insert_data = (
        recipe_data["title"],
        recipe_data["video_id"],
        recipe_data.get("servings"),
        recipe_data.get("prep_time"),
        recipe_data.get("cook_time"),
        recipe_data["nutritional_info"].get("calories"),
        recipe_data["nutritional_info"].get("protein"),
        recipe_data["nutritional_info"].get("carbs"),
        recipe_data["nutritional_info"].get("fat"),
    )

    cur.execute(
        """
        INSERT INTO recipes (
            title, video_id, servings, prep_time, cook_time,
            calories, protein, carbs, fat
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
        """,
        recipe_insert_data,
    )
    recipe_id = cur.lastrowid

    ingredients_rows = [
        (recipe_id, ing["name"], ing["quantity"])
        for ing in recipe_data["ingredients"]
    ]
    cur.executemany(
        "INSERT INTO ingredients (recipe_id, name, quantity) VALUES (?, ?, ?);",
        ingredients_rows,
    )

    steps_rows = [
        (recipe_id, step["step_number"], step["description"])
        for step in recipe_data["steps"]
    ]
    cur.executemany(
        "INSERT INTO steps (recipe_id, step_number, description) VALUES (?, ?, ?);",
        steps_rows,
    )

    # simple text UUID – doesn't need to match Postgres gen_random_uuid()
    import uuid

    cur.execute(
        "INSERT INTO recipe_generations (id, user_id) VALUES (?, ?);",
        (str(uuid.uuid4()), user_id),
    )

    sqlite_conn.commit()


def _fetch_all_recipes_sqlite() -> List[Dict[str, Any]]:
    """
    Return all recipes with their ingredients and steps from SQLite,
    shaped like the frontend's dummyRecipes.
    """
    if sqlite_conn is None:
        raise RuntimeError("SQLite connection is not initialized")

    cur = sqlite_conn.cursor()
    cur.execute(
        """
        SELECT
            id, title, video_id, servings, prep_time, cook_time,
            calories, protein, carbs, fat
        FROM recipes
        ORDER BY id DESC;
        """
    )
    recipes_rows = cur.fetchall()

    # Fetch ingredients and steps in bulk
    cur.execute(
        "SELECT id, recipe_id, name, quantity FROM ingredients ORDER BY id ASC;"
    )
    ingredients_rows = cur.fetchall()
    cur.execute(
        """
        SELECT id, recipe_id, step_number, description
        FROM steps
        ORDER BY step_number ASC, id ASC;
        """
    )
    steps_rows = cur.fetchall()

    ingredients_by_recipe: Dict[int, List[Dict[str, Any]]] = {}
    for row in ingredients_rows:
        ing = {
            "id": row[0],
            "recipe_id": row[1],
            "name": row[2],
            "quantity": row[3],
        }
        ingredients_by_recipe.setdefault(row[1], []).append(ing)

    steps_by_recipe: Dict[int, List[Dict[str, Any]]] = {}
    for row in steps_rows:
        step = {
            "id": row[0],
            "recipe_id": row[1],
            "step_number": row[2],
            "description": row[3],
        }
        steps_by_recipe.setdefault(row[1], []).append(step)

    recipes: List[Dict[str, Any]] = []
    for row in recipes_rows:
        rid = row[0]
        recipes.append(
            {
                "id": rid,
                "title": row[1],
                "video_id": row[2],
                "servings": row[3],
                "prep_time": row[4],
                "cook_time": row[5],
                "calories": row[6],
                "protein": row[7],
                "carbs": row[8],
                "fat": row[9],
                "ingredients": ingredients_by_recipe.get(rid, []),
                "steps": steps_by_recipe.get(rid, []),
            }
        )

    return recipes


def _fetch_recipe_by_video_sqlite(video_id: str) -> Optional[Dict[str, Any]]:
    """
    Return a single recipe with ingredients and steps, looked up by video_id.
    """
    if sqlite_conn is None:
        raise RuntimeError("SQLite connection is not initialized")

    cur = sqlite_conn.cursor()
    cur.execute(
        """
        SELECT
            id, title, video_id, servings, prep_time, cook_time,
            calories, protein, carbs, fat
        FROM recipes
        WHERE video_id = ?;
        """,
        (video_id,),
    )
    row = cur.fetchone()
    if row is None:
        return None

    rid = row[0]

    cur.execute(
        "SELECT id, recipe_id, name, quantity FROM ingredients WHERE recipe_id = ? ORDER BY id ASC;",
        (rid,),
    )
    ingredients_rows = cur.fetchall()
    cur.execute(
        """
        SELECT id, recipe_id, step_number, description
        FROM steps
        WHERE recipe_id = ?
        ORDER BY step_number ASC, id ASC;
        """,
        (rid,),
    )
    steps_rows = cur.fetchall()

    ingredients = [
        {
            "id": r[0],
            "recipe_id": r[1],
            "name": r[2],
            "quantity": r[3],
        }
        for r in ingredients_rows
    ]
    steps = [
        {
            "id": r[0],
            "recipe_id": r[1],
            "step_number": r[2],
            "description": r[3],
        }
        for r in steps_rows
    ]

    return {
        "id": rid,
        "title": row[1],
        "video_id": row[2],
        "servings": row[3],
        "prep_time": row[4],
        "cook_time": row[5],
        "calories": row[6],
        "protein": row[7],
        "carbs": row[8],
        "fat": row[9],
        "ingredients": ingredients,
        "steps": steps,
    }

@asynccontextmanager
async def lifespan(app: fastapi.FastAPI):
    """
    Lifespan context manager for FastAPI application.
    Handles startup and shutdown events.
    Initializes API keys and database backend (Supabase or SQLite).
    """
    load_dotenv()
    global yt_api_key, openai_api_key, supabase, db_backend, sqlite_conn
    yt_api_key = os.getenv("YOUTUBE_API_KEY")
    openai_api_key = os.getenv("OPENAI_API_KEY")

    # Decide backend: SQLite for fast local spin-up, Supabase otherwise
    use_sqlite = os.getenv("USE_SQLITE", "").lower() in ("1", "true", "yes")
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_KEY")

    if not yt_api_key:
        raise ValueError("YOUTUBE_API_KEY environment variable not set")
    if not openai_api_key:
        raise ValueError("OPENAI_API_KEY environment variable not set")

    if use_sqlite or not (supabase_url and supabase_key and create_client):
        # Fallback to SQLite when requested or when Supabase is not configured
        db_backend = "sqlite"
        db_path = os.getenv("SQLITE_DB_PATH", "recipes.db")
        sqlite_conn = _init_sqlite(db_path)
    else:
        db_backend = "supabase"
        supabase = create_client(supabase_url, supabase_key)  # type: ignore

    yield  

app = fastapi.FastAPI(
    title="ChefPanda YouTube Parser",
    description="Service for scraping and parsing YouTube cooking videos",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS so the React frontend (localhost:3000) can call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/scrape_channel")
async def scrape_channel(request: ScrapeRequest) -> List[Dict[str, Any]]:
    """
    Scrape recipes from a YouTube channel.
    
    Args:
        request: ScrapeRequest containing:
            - handle: YouTube channel handle (e.g. '@yooxicman')
            - language: Language code (default: 'en')
            - quantity: Number of videos to scrape (default: 200)
            
    Returns:
        List[Dict[str, Any]]: List of recipe dictionaries
    """
    try:
        scraper = YouTubeScraper(yt_api_key, request.language, request.quantity)
        channel_id = scraper.get_channel_id_by_handle(request.handle)
        result = scraper.process_videos(type="channel_id", arg=channel_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")

    try:
        recipes = []
        recipe_gen = RecipeGenerator(openai_api_key) 
        
        # Process videos in batches to avoid timeouts
        batch_size = 1  # Process one video at a time to ensure reliability
        for i in range(0, len(result), batch_size):
            batch = result[i:i + batch_size]
            for video in batch:
                try:
                    recipe = recipe_gen.generate_recipe(str(video))
                    recipes.append(recipe.model_dump())
                except Exception as e:
                    print(f"Error processing video {i}: {str(e)}")
                    continue
                
        if not recipes:
            raise HTTPException(status_code=404, detail="No recipes could be generated from the videos")
            
        return recipes
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing recipes: {str(e)}")

@app.post("/scrape_query")
async def scrape_query(request: QueryRequest) -> List[Dict[str, Any]]:
    """
    Search and scrape recipes based on a query.
    
    Args:
        request: QueryRequest containing:
            - query: Search query string
            - language: Language code (default: 'en')
            - quantity: Number of videos to scrape (default: 50)
            
    Returns:
        List[Dict[str, Any]]: List of recipe dictionaries
    """
    try:
        scraper = YouTubeScraper(yt_api_key, request.language, request.quantity)
        result = scraper.process_videos(type="query", arg=request.query)
        if not result:
            raise HTTPException(status_code=404, detail="No videos found for query")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")

    try:
        recipes = []
        recipe_gen = RecipeGenerator(openai_api_key)
        
        # Process videos in batches to avoid timeouts
        batch_size = 1  # Process one video at a time to ensure reliability
        for i in range(0, len(result), batch_size):
            batch = result[i:i + batch_size]
            for video in batch:
                try:
                    recipe = recipe_gen.generate_recipe(str(video))
                    recipes.append(recipe.model_dump())
                except Exception as e:
                    print(f"Error processing video {i}: {str(e)}")
                    continue
                
        if not recipes:
            raise HTTPException(status_code=404, detail="No recipes could be generated from the videos")
            
        return recipes
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing recipes: {str(e)}")

@app.post("/scrape_video_id")
async def scrape_video_id(request: VideoRequest, authorization: str = Header(None)) -> Dict[str, Any]:
    if not authorization or not authorization.startswith("Bearer "):
        # For local SQLite mode we don't strictly need auth, but keep this for compatibility
        if db_backend == "sqlite":
            # Use a fixed local user id to keep logic simple
            user_id = os.getenv(
                "LOCAL_USER_ID",
                "local-user",
            )
        else:
            raise HTTPException(status_code=401, detail="Missing or invalid authorization token")
    else:
        user_id = None  # will be set below when needed

    try:
        scraper = YouTubeScraper(yt_api_key, request.language)
        results = scraper.process_videos(type="id", arg=request.id)

        if not results:
            raise HTTPException(status_code=404, detail="Video not found or no transcript available")

        # 🔹 Generate recipe
        recipe_gen = RecipeGenerator(openai_api_key)
        recipe = recipe_gen.generate_recipe(str(results[0]))
        recipe_data = recipe.model_dump()

        # 🔹 Persist to the configured backend
        if db_backend == "sqlite":
            if user_id is None:
                # If we reached here with a bearer token in SQLite mode, still derive a stable user id
                token = authorization.split(" ")[1] if authorization else ""
                user_id = os.getenv("LOCAL_USER_ID", token or "local-user")
            _store_recipe_sqlite(user_id, recipe_data)
        else:
            if supabase is None or create_client is None:
                raise RuntimeError("Supabase client is not initialized")

            token = authorization.split(" ")[1]
            user = supabase.auth.get_user(token)
            user_id = user.user.id

            user_supabase = create_client(
                os.getenv("SUPABASE_URL"),
                os.getenv("SUPABASE_KEY"),
            )
            user_supabase.auth.set_session(token, "")

            # 🔹 Insert into recipes table
            recipe_insert_data = {
                "title": recipe_data["title"],
                "video_id": recipe_data["video_id"],
                "servings": recipe_data.get("servings"),
                "prep_time": recipe_data.get("prep_time"),
                "cook_time": recipe_data.get("cook_time"),
                "calories": recipe_data["nutritional_info"].get("calories"),
                "protein": recipe_data["nutritional_info"].get("protein"),
                "carbs": recipe_data["nutritional_info"].get("carbs"),
                "fat": recipe_data["nutritional_info"].get("fat"),
            }
            recipe_response = user_supabase.table("recipes").insert(recipe_insert_data).execute()
            recipe_id = recipe_response.data[0]["id"]

            # 🔹 Insert ingredients
            ingredients_data = [
                {
                    "recipe_id": recipe_id,
                    "name": ing["name"],
                    "quantity": ing["quantity"],
                }
                for ing in recipe_data["ingredients"]
            ]
            user_supabase.table("ingredients").insert(ingredients_data).execute()

            # 🔹 Insert steps
            steps_data = [
                {
                    "recipe_id": recipe_id,
                    "step_number": step["step_number"],
                    "description": step["description"],
                }
                for step in recipe_data["steps"]
            ]
            user_supabase.table("steps").insert(steps_data).execute()

            # 🔹 Log generation last
            user_supabase.table("recipe_generations").insert(
                {
                    "user_id": user_id,
                }
            ).execute()

        return recipe_data

    except HTTPException:
        raise
    except Exception as e:
        if 'Invalid JWT' in str(e):
            raise HTTPException(status_code=401, detail="Invalid authentication token")
        raise HTTPException(status_code=500, detail=f"Error processing video: {str(e)}")


@app.get("/recipes")
async def list_recipes() -> List[Dict[str, Any]]:
    """
    List all recipes stored in the backend.

    Currently implemented for SQLite only.
    """
    try:
        if db_backend != "sqlite":
            raise HTTPException(status_code=501, detail="Recipe listing not implemented for this backend")
        return _fetch_all_recipes_sqlite()
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching recipes: {str(e)}")


@app.get("/recipes/video/{video_id}")
async def get_recipe_by_video(video_id: str) -> Dict[str, Any]:
    """
    Get a single recipe by its YouTube video_id.
    """
    try:
        if db_backend != "sqlite":
            raise HTTPException(status_code=501, detail="Recipe lookup not implemented for this backend")
        recipe = _fetch_recipe_by_video_sqlite(video_id)
        if recipe is None:
            raise HTTPException(status_code=404, detail="Recipe not found")
        return recipe
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching recipe: {str(e)}")


@app.get("/status")
async def get_status() -> Dict[str, Any]:
    """
    Get service health status and API key validity.
    
    Returns:
        Dict[str, Any]: Status information including:
            - service: Overall service status
            - youtube_api: YouTube API key status
            - openai_api: OpenAI API key status
    """
    try:
        # Basic validation of API keys
        yt_status = "valid" if yt_api_key and len(yt_api_key) > 20 else "invalid"
        openai_status = "valid" if openai_api_key and len(openai_api_key) > 20 else "invalid"
        
        return {
            "service": "healthy",
            "youtube_api": yt_status,
            "openai_api": openai_status,
            "version": app.version
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error checking status: {str(e)}")

@app.get("/limits")
async def get_rate_limits() -> Dict[str, Any]:
    """
    Get current rate limits and quota information.
    
    Returns:
        Dict[str, Any]: Rate limit information for APIs
    """
    try:
        # You would typically implement actual quota checking here
        # This is a placeholder implementation
        return {
            "youtube_api": {
                "daily_quota": 10000,
                "quota_remaining": 9000,
                "reset_time": "midnight PT"
            },
            "openai_api": {
                "requests_per_min": 60,
                "tokens_per_min": 40000,
                "reset_period": "per minute"
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error checking rate limits: {str(e)}")

@app.get("/recipe/format")
async def get_recipe_format() -> Dict[str, Any]:
    """
    Get the schema/format of recipe responses.
    
    Returns:
        Dict[str, Any]: Recipe format specification
    """
    return {
        "format_version": "1.0",
        "recipe_schema": {
            "title": "string",
            "description": "string",
            "ingredients": ["string"],
            "instructions": ["string"],
            "metadata": {
                "video_id": "string",
                "channel": "string",
                "language": "string",
                "duration": "string",
                "timestamp": "string"
            }
        }
    }

@app.get("/videos/status")
async def get_videos_status(video_ids: str) -> Dict[str, Any]:
    """
    Check processing status for multiple videos.
    
    Args:
        video_ids: Comma-separated list of video IDs
        
    Returns:
        Dict[str, Any]: Status information for each video
    """
    try:
        ids = video_ids.split(",")
        statuses = {}
        
        for vid_id in ids:
            # You would typically check a database or cache for actual status
            # This is a placeholder implementation
            statuses[vid_id] = {
                "status": "completed",  # or "processing", "failed", etc.
                "progress": 100,  # percentage
                "error": None
            }
            
        return {"video_statuses": statuses}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error checking video status: {str(e)}")

