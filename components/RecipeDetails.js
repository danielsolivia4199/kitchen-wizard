/* eslint-disable react/no-array-index-key */
/* eslint-disable react/prop-types */
import React, {
  useState, useEffect, useCallback,
} from 'react';
import { useRouter } from 'next/router';
import {
  Image, Button, Collapse, FormControl,
} from 'react-bootstrap';
import {
  getSingleRecipe, addSave, removeSave, getUserSaved,
} from '../api/RecipeData';
import CommentSection from './CommentSection';
import { useAuth } from '../utils/context/authContext';

// Timer component
const Timer = ({ initialSeconds = 0 }) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setSeconds(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    let interval;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const formattedTime = new Date(seconds * 1000).toISOString().substr(11, 8);

  return (
    <div>
      <h1>{formattedTime}</h1>
      <Button onClick={() => setIsActive(!isActive)}>
        {isActive ? 'Pause' : 'Start'}
      </Button>
      <Button onClick={() => setSeconds(initialSeconds)}>
        Reset
      </Button>
    </div>
  );
};

function RecipeDetailsPage() {
  const router = useRouter();
  const { firebaseKey } = router.query;
  const [recipeDetails, setRecipeDetails] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [timeInput, setTimeInput] = useState('00:00');

  const convertToSeconds = useCallback((timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 3600 + minutes * 60;
  }, []);

  useEffect(() => {
    if (firebaseKey) {
      getSingleRecipe(firebaseKey)
        .then((data) => {
          setRecipeDetails(data);
        })
        .catch((error) => {
          console.error('Error fetching recipe details:', error);
        });
    }
  }, [firebaseKey]);

  useEffect(() => {
    if (user) {
      // Fetch user's saved recipes when the component mounts
      getUserSaved(user.uid)
        .then((savedRecipes) => {
          const isRecipeSaved = savedRecipes.some((save) => save.recipeFirebaseKey === firebaseKey);
          setIsSaved(isRecipeSaved);
        })
        .catch((error) => {
          console.error('Error fetching user saved recipes:', error);
        });
    }
  }, [user, firebaseKey]);

  useEffect(() => {
    // Check local storage to see if the recipe is saved
    const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];
    const isRecipeSaved = savedRecipes.includes(firebaseKey);
    setIsSaved(isRecipeSaved);
  }, [firebaseKey]);

  const toggleSave = () => {
    if (isSaved) {
      removeSave(firebaseKey, user.uid)
        .then(() => {
          setIsSaved(false);
          // Remove the recipe key from local storage
          const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];
          const updatedSavedRecipes = savedRecipes.filter((key) => key !== firebaseKey);
          localStorage.setItem('savedRecipes', JSON.stringify(updatedSavedRecipes));
        })
        .catch((error) => {
          console.error('Error removing save:', error);
        });
    } else {
      addSave(firebaseKey, user.uid)
        .then(() => {
          setIsSaved(true);
          // Add the recipe key to local storage
          const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];
          savedRecipes.push(firebaseKey);
          localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
        })
        .catch((error) => {
          console.error('Error adding save:', error);
        });
    }
  };

  if (!recipeDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{recipeDetails.name}</h1>
      {/* Image */}
      <div>
        <Image src={recipeDetails.image} alt={recipeDetails.name} className="recipe-image" />
      </div>
      {/* Buttons */}
      <div>
        <Button
          type="button"
          className="star-button"
          onClick={toggleSave}
        >
          {isSaved ? 'Unsave' : 'Save'}
        </Button>
        <Button
          onClick={() => setOpen(!open)}
          aria-controls="timer-collapse"
          aria-expanded={open}
        >
          Timer
        </Button>
      </div>
      <Collapse in={open}>
        <div id="timer-collapse">
          <FormControl
            type="text"
            value={timeInput}
            onChange={(e) => setTimeInput(e.target.value)}
          />
          <Timer initialSeconds={convertToSeconds(timeInput)} />
        </div>
      </Collapse>
      <h3>Cuisine: {recipeDetails.cuisine}</h3>
      {recipeDetails.dietaryrestrictions && (
        <h3>Dietary Restrictions: {recipeDetails.dietaryrestrictions}</h3>
      )}
      <h3>Total Cooking Time: {recipeDetails.totalcookingtime}</h3>
      <h1>Ingredients:</h1>
      <ul>
        {recipeDetails.ingredients.map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul>
      <h1>Preparation:</h1>
      <ol>
        {recipeDetails.preparation.map((step, index) => (
          <li key={index}>{step}</li>
        ))}
      </ol>
      <div className="comments-section">
        <CommentSection recipeFirebaseKey={firebaseKey} userUID={user.uid} />
      </div>
    </div>
  );
}
export default RecipeDetailsPage;
