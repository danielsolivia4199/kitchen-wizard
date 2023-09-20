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
      let matchingRecipes = publicRecipes.filter((recipe) => wordsArray.every((word) => recipe.ingredients.toLowerCase().includes(word.toLowerCase())));

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
      <h1>Recipe Generator</h1>
      <div>
        <textarea
          rows="3"
          placeholder="Enter ingredients (separated by commas)"
          value={inputIngredients}
          onChange={(e) => setInputIngredients(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter cuisine type"
          value={cuisine}
          onChange={(e) => setCuisine(e.target.value)}
        />
        <select value={dietaryrestrictions} onChange={(e) => setDietaryRestrictions(e.target.value)}>
          <option value="">Select Dietary Restrictions</option>
          <option value="Vegan">Vegan</option>
          <option value="Vegetarian">Vegetarian</option>
          <option value="Gluten-free">Gluten-Free</option>
        </select>
        <select value={mealtype} onChange={(e) => setMealType(e.target.value)}>
          <option value="">Select Meal Type</option>
          <option value="Breakfast">Breakfast</option>
          <option value="Lunch">Lunch</option>
          <option value="Snack">Snack</option>
          <option value="Dinner">Dinner</option>
          <option value="Dessert">Dessert</option>
          <option value="Drink">Drink</option>
        </select>
        <Button type="button" onClick={handleGenerate}>
          Generate Recipe
        </Button>
        {showWarning && <Alert variant="warning">No recipes found with those specific filters.</Alert>}
      </div>
    </div>
  );
}

export default RecipeGenerator;
