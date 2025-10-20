// My database should be like this: 
// recipes: id, title, video_id, servings, prep_time, cook_time, calories, protein, carbs, fat
// ingredients: id, recipe_id, name, quantity
// steps: id, recipe_id, step_number, description

export const dummyRecipes = [
  {
    id: 1,
    title: "Quick Garlic Pasta",
    video_id: "abcd1234",
    servings: "2-3",
    prep_time: "15 min",
    cook_time: "10 min",
    calories: 520,
    protein: 14,
    carbs: 70,
    fat: 18,
    ingredients: [
      { id: 1, recipe_id: 1, name: "Spaghetti", quantity: "200g" },
      { id: 2, recipe_id: 1, name: "Garlic", quantity: "4 cloves, minced" },
      { id: 3, recipe_id: 1, name: "Olive oil", quantity: "1/4 cup" },
      { id: 4, recipe_id: 1, name: "Red pepper flakes", quantity: "1 tsp" },
      { id: 5, recipe_id: 1, name: "Parmesan cheese", quantity: "1/4 cup, grated" }
    ],
    steps: [
      { id: 1, recipe_id: 1, step_number: 1, description: "Boil salted water and cook pasta 8-10 min." },
      { id: 2, recipe_id: 1, step_number: 2, description: "Gently cook garlic in olive oil." },
      { id: 3, recipe_id: 1, step_number: 3, description: "Toss pasta with garlic oil, season, and serve." }
    ]
  },
  {
    id: 2,
    title: "Chicken Stir Fry",
    video_id: "efgh5678",
    servings: "2",
    prep_time: "20 min",
    cook_time: "10 min",
    calories: 430,
    protein: 36,
    carbs: 28,
    fat: 18,
    ingredients: [
      { id: 6, recipe_id: 2, name: "Chicken breast", quantity: "300g" },
      { id: 7, recipe_id: 2, name: "Soy sauce", quantity: "2 tbsp" },
      { id: 8, recipe_id: 2, name: "Bell peppers", quantity: "2 cups, sliced" },
      { id: 9, recipe_id: 2, name: "Broccoli", quantity: "1 cup" },
      { id: 10, recipe_id: 2, name: "Ginger", quantity: "1 tbsp, minced" }
    ],
    steps: [
      { id: 4, recipe_id: 2, step_number: 1, description: "Slice chicken and vegetables." },
      { id: 5, recipe_id: 2, step_number: 2, description: "Stir fry chicken, add vegetables and sauce." },
      { id: 6, recipe_id: 2, step_number: 3, description: "Cook until tender-crisp and serve." }
    ]
  },
  {
    id: 3,
    title: "Classic Margherita Pizza",
    video_id: "ijkl9012",
    servings: "2-3",
    prep_time: "10 min",
    cook_time: "15 min",
    calories: 680,
    protein: 28,
    carbs: 82,
    fat: 26,
    ingredients: [
      { id: 11, recipe_id: 3, name: "Pizza dough", quantity: "1 ball" },
      { id: 12, recipe_id: 3, name: "Tomato sauce", quantity: "1/2 cup" },
      { id: 13, recipe_id: 3, name: "Fresh mozzarella", quantity: "200g" },
      { id: 14, recipe_id: 3, name: "Fresh basil", quantity: "10 leaves" },
      { id: 15, recipe_id: 3, name: "Olive oil", quantity: "2 tbsp" }
    ],
    steps: [
      { id: 7, recipe_id: 3, step_number: 1, description: "Preheat oven to 475°F." },
      { id: 8, recipe_id: 3, step_number: 2, description: "Roll out dough and spread sauce." },
      { id: 9, recipe_id: 3, step_number: 3, description: "Add mozzarella and bake 12-15 min." },
      { id: 10, recipe_id: 3, step_number: 4, description: "Top with fresh basil and drizzle olive oil." }
    ]
  },
  {
    id: 4,
    title: "Avocado Toast with Poached Egg",
    video_id: "mnop3456",
    servings: "1",
    prep_time: "5 min",
    cook_time: "8 min",
    calories: 380,
    protein: 18,
    carbs: 32,
    fat: 22,
    ingredients: [
      { id: 16, recipe_id: 4, name: "Sourdough bread", quantity: "2 slices" },
      { id: 17, recipe_id: 4, name: "Avocado", quantity: "1 ripe" },
      { id: 18, recipe_id: 4, name: "Eggs", quantity: "2" },
      { id: 19, recipe_id: 4, name: "Lemon juice", quantity: "1 tsp" },
      { id: 20, recipe_id: 4, name: "Red pepper flakes", quantity: "pinch" }
    ],
    steps: [
      { id: 11, recipe_id: 4, step_number: 1, description: "Toast bread until golden." },
      { id: 12, recipe_id: 4, step_number: 2, description: "Mash avocado with lemon juice and salt." },
      { id: 13, recipe_id: 4, step_number: 3, description: "Poach eggs in simmering water 3-4 min." },
      { id: 14, recipe_id: 4, step_number: 4, description: "Spread avocado on toast and top with egg." }
    ]
  },
  {
    id: 5,
    title: "Thai Green Curry",
    video_id: "qrst7890",
    servings: "4",
    prep_time: "15 min",
    cook_time: "25 min",
    calories: 520,
    protein: 32,
    carbs: 18,
    fat: 36,
    ingredients: [
      { id: 21, recipe_id: 5, name: "Green curry paste", quantity: "3 tbsp" },
      { id: 22, recipe_id: 5, name: "Coconut milk", quantity: "400ml" },
      { id: 23, recipe_id: 5, name: "Chicken thighs", quantity: "400g" },
      { id: 24, recipe_id: 5, name: "Thai basil", quantity: "1/2 cup" },
      { id: 25, recipe_id: 5, name: "Bamboo shoots", quantity: "1 cup" }
    ],
    steps: [
      { id: 15, recipe_id: 5, step_number: 1, description: "Fry curry paste until fragrant." },
      { id: 16, recipe_id: 5, step_number: 2, description: "Add coconut milk and bring to simmer." },
      { id: 17, recipe_id: 5, step_number: 3, description: "Add chicken and cook 15 min." },
      { id: 18, recipe_id: 5, step_number: 4, description: "Stir in vegetables and basil." }
    ]
  },
  {
    id: 6,
    title: "Chocolate Chip Cookies",
    video_id: "uvwx1234",
    servings: "24 cookies",
    prep_time: "15 min",
    cook_time: "12 min",
    calories: 180,
    protein: 2,
    carbs: 24,
    fat: 9,
    ingredients: [
      { id: 26, recipe_id: 6, name: "Butter", quantity: "1 cup, softened" },
      { id: 27, recipe_id: 6, name: "Brown sugar", quantity: "3/4 cup" },
      { id: 28, recipe_id: 6, name: "All-purpose flour", quantity: "2 1/4 cups" },
      { id: 29, recipe_id: 6, name: "Chocolate chips", quantity: "2 cups" },
      { id: 30, recipe_id: 6, name: "Vanilla extract", quantity: "2 tsp" }
    ],
    steps: [
      { id: 19, recipe_id: 6, step_number: 1, description: "Cream butter and sugars together." },
      { id: 20, recipe_id: 6, step_number: 2, description: "Mix in eggs and vanilla." },
      { id: 21, recipe_id: 6, step_number: 3, description: "Fold in flour and chocolate chips." },
      { id: 22, recipe_id: 6, step_number: 4, description: "Bake at 375°F for 10-12 min." }
    ]
  }
];
