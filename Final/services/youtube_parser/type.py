from pydantic import BaseModel # type: ignore
from typing import List, Dict

class FetchedTranscriptSnippet(BaseModel):
    text: str 
    start: float
    duration: float

class FetchedTranscript(BaseModel):
    snippets: list[FetchedTranscriptSnippet]
    video_id: str
    language_code: str
    is_generated: bool

class Ingredient(BaseModel):
    name: str
    quantity: str

class InstructionStep(BaseModel):
    step_number: int
    description: str

class Recipe(BaseModel):
    title: str
    video_id: str
    ingredients: List[Ingredient]
    steps: List[InstructionStep]
    servings: str | None = None
    prep_time: str | None = None
    cook_time: str | None = None
    nutritional_info: Dict[str, float] | None = None

