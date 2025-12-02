import pytest # type: ignore
from dotenv import load_dotenv # type: ignore
import os
from youtube_parser.recipe_gen import RecipeGenerator
from youtube_parser.type import Recipe, Ingredient, InstructionStep
import openai # type: ignore
from unittest.mock import patch, Mock

@pytest.fixture
def recipe_generator():
    load_dotenv()
    api_key = os.getenv("OPENAI_API_KEY")
    return RecipeGenerator(api_key)

@pytest.fixture
def sample_recipe(recipe_generator):
    transcript = """
    Hey guys! Welcome back to my channel. Today I'm super excited to show you my favorite quick and easy garlic pasta recipe that's perfect for busy weeknights.

    [0:15] Before we get started, don't forget to hit that like button and subscribe to my channel for more easy recipes!

    [0:30] For this recipe, you're going to need:
    - about 200 grams or half a pound of spaghetti
    - 4 cloves of garlic, minced
    - 1/4 cup olive oil
    - red pepper flakes to taste
    - salt and black pepper
    - fresh parsley for garnish

    [1:00] First things first, bring a large pot of water to boil. Don't forget to salt your water - it should taste like the sea! 
    
    [1:45] While we're waiting for the water to boil, let's prep our garlic. I'm going to show you my special technique for mincing it super fine.
    
    [2:30] Once your water is boiling, throw in your pasta. It's going to take about 8-10 minutes to cook al dente.
    
    [3:00] In a separate pan, we're going to slowly heat up our olive oil and add the minced garlic. Keep the heat on medium-low - we want to infuse the oil, not burn the garlic!
    
    [4:30] Your pasta should be done by now. Save about a cup of pasta water - this is super important! Drain your pasta and add it directly to the garlic oil.
    
    [5:00] Give everything a good toss, add a splash of that pasta water to make it nice and silky. Season with salt and pepper, and if you're using parsley, throw that in too.

    [5:30] And that's it! This recipe serves 2-3 people and takes about 15 minutes to prep and 10 minutes to cook. Super quick and delicious!

    [5:45] If you enjoyed this recipe, don't forget to give this video a thumbs up and hit that subscribe button. See you next time!
    """
    recipe_generator.generate_recipe(transcript)
    return recipe_generator.recipe

def test_recipe_structure(recipe_generator, sample_recipe):
    assert isinstance(sample_recipe, Recipe)
    assert sample_recipe.title == "Quick and Easy Garlic Pasta"
    assert len(sample_recipe.ingredients) > 0
    assert len(sample_recipe.steps) > 0

def test_ingredients_structure(recipe_generator, sample_recipe):
    ingredients = recipe_generator.receive_ingredients()
    assert isinstance(ingredients, list)
    assert len(ingredients) > 0
    for ingredient in ingredients:
        assert isinstance(ingredient, Ingredient)
        assert hasattr(ingredient, 'name')
        assert hasattr(ingredient, 'quantity')

def test_steps_structure(recipe_generator, sample_recipe):
    steps = recipe_generator.receive_steps()
    assert isinstance(steps, list)
    assert len(steps) > 0
    for step in steps:
        assert isinstance(step, InstructionStep)
        assert hasattr(step, 'step_number')
        assert hasattr(step, 'description')

def test_servings_structure(recipe_generator, sample_recipe):
    servings = recipe_generator.receive_servings()
    assert isinstance(servings, str)
    assert any(x in servings for x in ["2", "2-3"])

def test_prep_time_structure(recipe_generator, sample_recipe):
    prep_time = recipe_generator.receive_prep_time()
    assert isinstance(prep_time, str)
    assert "15" in prep_time

def test_cook_time_structure(recipe_generator, sample_recipe):
    cook_time = recipe_generator.receive_cook_time()
    assert isinstance(cook_time, str)
    assert "10" in cook_time

def test_nutritional_info_structure(recipe_generator, sample_recipe):
    nutritional_info = recipe_generator.receive_nutritional_info()
    assert isinstance(nutritional_info, dict)
    # Check that values are within reasonable ranges for a pasta dish
    assert 300 <= nutritional_info["calories"] <= 800  # Reasonable range for a pasta serving
    assert 8 <= nutritional_info["protein"] <= 20      # Reasonable protein range
    assert 45 <= nutritional_info["carbs"] <= 100      # Reasonable carbs range for pasta
    assert 10 <= nutritional_info["fat"] <= 30         # Reasonable fat range

def test_empty_transcript():
    recipe_generator = RecipeGenerator("test_key")
    with pytest.raises(ValueError, match="Transcript cannot be empty or whitespace"):
        recipe_generator.generate_recipe("")
    with pytest.raises(ValueError, match="Transcript cannot be empty or whitespace"):
        recipe_generator.generate_recipe("   ")

@patch('openai.OpenAI')
def test_openai_api_error(mock_openai):
    mock_client = Mock()
    mock_openai.return_value = mock_client

    mock_request = Mock()
    mock_error_body = {"error": "test error"}

    mock_client.chat.completions.create.side_effect = openai.APIError(
        "API Error",
        mock_request,
        body=mock_error_body
    )

    recipe_generator = RecipeGenerator("test_key")
    with pytest.raises(RuntimeError, match="OpenAI API error: API Error"):
        recipe_generator.generate_recipe("test transcript")
        
@patch('openai.OpenAI')
def test_empty_openai_response(mock_openai):
    mock_client = Mock()
    mock_openai.return_value = mock_client
    mock_response = Mock()
    mock_response.choices = [Mock(message=Mock(content=None))]
    mock_client.chat.completions.create.return_value = mock_response
    
    recipe_generator = RecipeGenerator("test_key")
    with pytest.raises(RuntimeError, match="Empty response from OpenAI"):
        recipe_generator.generate_recipe("test transcript")

def test_recipe_not_generated_errors(recipe_generator):
    with pytest.raises(RuntimeError, match="Recipe not generated yet"):
        recipe_generator.receive_ingredients()
    
    with pytest.raises(RuntimeError, match="Recipe not generated yet"):
        recipe_generator.receive_steps()
    
    with pytest.raises(RuntimeError, match="Recipe not generated yet"):
        recipe_generator.receive_servings()
    
    with pytest.raises(RuntimeError, match="Recipe not generated yet"):
        recipe_generator.receive_prep_time()
    
    with pytest.raises(RuntimeError, match="Recipe not generated yet"):
        recipe_generator.receive_cook_time()
    
    with pytest.raises(RuntimeError, match="Recipe not generated yet"):
        recipe_generator.receive_nutritional_info()

def test_recipe_missing_fields(recipe_generator):
    recipe_generator.recipe = Recipe(
        title="Test Recipe",
        ingredients=[],
        steps=[],
        servings=None,
        prep_time=None,
        cook_time=None,
        nutritional_info=None
    )
    
    with pytest.raises(RuntimeError, match="Servings not set in recipe"):
        recipe_generator.receive_servings()
    
    with pytest.raises(RuntimeError, match="Prep time not set in recipe"):
        recipe_generator.receive_prep_time()
    
    with pytest.raises(RuntimeError, match="Cook time not set in recipe"):
        recipe_generator.receive_cook_time()
    
    with pytest.raises(RuntimeError, match="Nutritional info not set in recipe"):
        recipe_generator.receive_nutritional_info()
