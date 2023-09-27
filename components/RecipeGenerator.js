import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Alert } from 'react-bootstrap';
import { getAllRecipes } from '../api/RecipeData';

function RecipeGenerator() {
  const [inputIngredients, setInputIngredients] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [dietaryrestrictions, setDietaryRestrictions] = useState('');
  const [mealtype, setMealType] = useState('');
  const [showWarning, setShowWarning] = useState(false);
  const router = useRouter();

  const handleGenerate = async () => {
    setShowWarning(false); // Reset the warning state
    const wordsArray = inputIngredients.split(',').map((word) => word.trim());
    try {
      const allRecipes = await getAllRecipes();
      const publicRecipes = allRecipes.filter((recipe) => recipe.public === true);

      let matchingRecipes = publicRecipes.filter((recipe) => {
        if (!Array.isArray(recipe.ingredients)) {
          console.error('recipe.ingredients is not an array for recipe:', recipe);
          return false; // Skip this recipe if ingredients are not an array
        }
        // Join the ingredients into a string and append word boundaries around each ingredient
        const ingredientsString = recipe.ingredients.map((ingredient) => `\\b${ingredient.toLowerCase()}\\b`).join(' ');
        // Check if every word in wordsArray is a whole word in ingredientsString
        return wordsArray.every((word) => {
          const regex = new RegExp(`\\b${word.toLowerCase()}\\b`);
          return ingredientsString.match(regex);
        });
      });
      // Apply additional filters here
      if (cuisine) {
        matchingRecipes = matchingRecipes.filter((recipe) => recipe.cuisine.toLowerCase().includes(cuisine.toLowerCase()));
      }
      if (dietaryrestrictions) {
        matchingRecipes = matchingRecipes.filter((recipe) => recipe.dietaryrestrictions === dietaryrestrictions);
      }
      if (mealtype) {
        matchingRecipes = matchingRecipes.filter((recipe) => recipe.mealtype === mealtype);
      }
      if (matchingRecipes.length > 0) {
        const randomIndex = Math.floor(Math.random() * matchingRecipes.length);
        const generatedRecipeFirebaseKey = matchingRecipes[randomIndex].firebaseKey;
        router.push(`/recipes/${generatedRecipeFirebaseKey}`);
      } else {
        setShowWarning(true); // Show warning when no matches are found
      }
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };
  return (
    <div>
      <h1 className="generator-title">Recipe Generator</h1>
      <div>
        <textarea
          rows="3"
          placeholder="Enter ingredients (separated by commas)"
          className="ingredients-input"
          value={inputIngredients}
          onChange={(e) => setInputIngredients(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter cuisine type"
          className="cuisine-input"
          value={cuisine}
          onChange={(e) => setCuisine(e.target.value)}
        />
        <select value={dietaryrestrictions} className="dietary-input" onChange={(e) => setDietaryRestrictions(e.target.value)}>
          <option value="">Select Dietary Restrictions</option>
          <option value="Vegan">Vegan</option>
          <option value="Vegetarian">Vegetarian</option>
          <option value="Gluten-free">Gluten-Free</option>
        </select>
        <select
          value={mealtype}
          className="mealtype-input"
          onChange={(e) => setMealType(e.target.value)}
        >
          <option value="">Select Meal Type</option>
          <option value="Breakfast">Breakfast</option>
          <option value="Lunch">Lunch</option>
          <option value="Snack">Snack</option>
          <option value="Dinner">Dinner</option>
          <option value="Dessert">Dessert</option>
          <option value="Drink">Drink</option>
        </select>
        <Button
          type="button"
          className="generate-button"
          onClick={handleGenerate}
        >
          Generate Recipe
        </Button>
        {showWarning && <Alert variant="warning">No recipes found with those specific filters.</Alert>}
      </div>
    </div>
  );
}

export default RecipeGenerator;
