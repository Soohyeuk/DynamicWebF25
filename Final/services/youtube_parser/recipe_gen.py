"""
Recipe generation and parsing functionality.
"""

from .type import Ingredient, InstructionStep, Recipe
import openai # type: ignore
from typing import List, Optional, Dict
from pathlib import Path
import json

class RecipeGenerator:  
    def __init__(self, api_key: str): 
        self.api_key = api_key
        self.openai = openai.OpenAI(api_key=self.api_key)
        self._load_prompts()
        self.recipe: Optional[Recipe] = None 

    def _load_prompts(self):
        """Load prompt templates from text files"""
        prompts_dir = Path(__file__).parent / "prompts"
        
        with open(prompts_dir / "recipe_system.txt", "r") as f:
            self.system_prompt = f.read().strip()
            
        with open(prompts_dir / "recipe_extraction.txt", "r") as f:
            self.extraction_prompt_template = f.read().strip()

    def generate_recipe(self, transcript_data: str) -> Recipe:
        """
        Generate a complete recipe from a video transcript using OpenAI.
        
        Args:
            transcript_data (str): The video transcript dictionary as a string
            
        Returns:
            Recipe: A Recipe object containing title, video_id, ingredients, and steps
            
        Raises:
            RuntimeError: If recipe generation fails
            ValueError: If transcript is empty or whitespace
        """
        if not transcript_data or transcript_data.isspace():
            raise ValueError("Transcript cannot be empty or whitespace")
            
        # Parse the transcript string back into a dictionary
        try:
            transcript_dict = eval(transcript_data)
            video_id = transcript_dict.get('video_id')
            if not video_id:
                raise ValueError("Transcript data missing video_id")
            transcript_text = transcript_dict.get('snippets', '')
        except Exception as e:
            raise ValueError(f"Invalid transcript data format: {str(e)}")
            
        prompt = self.extraction_prompt_template.format(transcript=transcript_text)
        
        try:
            response = self.openai.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": self.system_prompt},
                    {"role": "user", "content": prompt}
                ],
                response_format={"type": "json_object"},
                temperature=0.7  # Balanced between creativity and accuracy
            )
            content = response.choices[0].message.content
            if not content:
                raise RuntimeError("Empty response from OpenAI")
                
            # Validate JSON structure before parsing
            try:
                json_data = json.loads(content)
                # Basic structure validation
                required_fields = ["title", "ingredients", "steps"]
                for field in required_fields:
                    if field not in json_data:
                        raise ValueError(f"Missing required field: {field}")
                
                # Add video_id to the JSON data
                json_data['video_id'] = video_id
                
                # Validate steps format
                if not isinstance(json_data["steps"], list):
                    raise ValueError("'steps' must be an array")
                for step in json_data["steps"]:
                    if not isinstance(step, dict) or "step_number" not in step or "description" not in step:
                        raise ValueError("Each step must be an object with 'step_number' and 'description'")
                    if not isinstance(step["step_number"], int):
                        raise ValueError("step_number must be an integer")
                
                # If validation passes, parse with pydantic
                self.recipe = Recipe.model_validate_json(json.dumps(json_data))
                return self.recipe
                
            except json.JSONDecodeError as e:
                raise RuntimeError(f"Invalid JSON response from OpenAI: {str(e)}")
            except ValueError as e:
                raise RuntimeError(f"Invalid response structure: {str(e)}")
                
        except openai.APIError as e:
            raise RuntimeError(f"OpenAI API error: {str(e)}")
        except Exception as e:
            raise RuntimeError(f"Failed to generate recipe: {str(e)}")

    def receive_ingredients(self) -> List[Ingredient]:
        """
        Extract just the ingredients list from a transcript.
            
        Returns:
            List[Ingredient]: List of ingredients with quantities
            
        Raises:
            RuntimeError: If recipe is not generated yet
        """
        if self.recipe is None:
            raise RuntimeError("Recipe not generated yet")
        return self.recipe.ingredients

    def receive_steps(self) -> List[InstructionStep]:
        """
        Extract just the instruction steps from a transcript.
        
        Returns:
            List[InstructionStep]: List of numbered instruction steps
            
        Raises:
            RuntimeError: If recipe is not generated yet
        """
        if self.recipe is None:
            raise RuntimeError("Recipe not generated yet")
        return self.recipe.steps

    def receive_servings(self) -> str:
        """
        Extract the number of servings from a transcript.
        
        Returns:
            str: Number of servings
            
        Raises:
            RuntimeError: If recipe is not generated yet or servings is not set
        """
        if self.recipe is None:
            raise RuntimeError("Recipe not generated yet")
        if self.recipe.servings is None:
            raise RuntimeError("Servings not set in recipe")
        return self.recipe.servings
    
    def receive_prep_time(self) -> str:
        """
        Extract the preparation time from a transcript.
        
        Returns:
            str: Preparation time
            
        Raises:
            RuntimeError: If recipe is not generated yet or prep time is not set
        """
        if self.recipe is None:
            raise RuntimeError("Recipe not generated yet")
        if self.recipe.prep_time is None:
            raise RuntimeError("Prep time not set in recipe")
        return self.recipe.prep_time
    
    def receive_cook_time(self) -> str: 
        """
        Extract the cooking time from a transcript.
        
        Returns:
            str: Cooking time
            
        Raises:
            RuntimeError: If recipe is not generated yet or cook time is not set
        """
        if self.recipe is None:
            raise RuntimeError("Recipe not generated yet")
        if self.recipe.cook_time is None:
            raise RuntimeError("Cook time not set in recipe")
        return self.recipe.cook_time
    
    def receive_nutritional_info(self) -> Dict[str, float]:
        """
        Extract the nutritional information from a transcript.
        
        Returns:
            Dict[str, float]: Nutritional information
            
        Raises:
            RuntimeError: If recipe is not generated yet or nutritional info is not set
        """
        if self.recipe is None:
            raise RuntimeError("Recipe not generated yet")
        if self.recipe.nutritional_info is None:
            raise RuntimeError("Nutritional info not set in recipe")
        return self.recipe.nutritional_info
