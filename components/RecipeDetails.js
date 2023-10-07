/* eslint-disable no-restricted-globals */
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

  const formattedTime = seconds && !isNaN(seconds)
    ? new Date(seconds * 1000).toISOString().substr(11, 8)
    : '00:00:00'; // or some other default value

  return (
    <div>
      <h1>{formattedTime}</h1>
      <Button className="timer-button" variant="success" onClick={() => setIsActive(!isActive)}>
        {isActive ? 'Pause' : 'Start'}
      </Button>
      <Button className="timer-button" variant="danger" onClick={() => setSeconds(initialSeconds)}>
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
      <div className="image-con">
        <h1>{recipeDetails.name}</h1>
        {/* Image */}
        <div>
          <Image src={recipeDetails.image} alt={recipeDetails.name} className="recipe-image" />
        </div>
      </div>
      <div className="recipe-details-container">
        <h5>Cuisine: {recipeDetails.cuisine}</h5>
        {recipeDetails.dietaryrestrictions && (
          <h5>Dietary Restrictions: {recipeDetails.dietaryrestrictions}</h5>
        )}
        <h5>Total Cooking Time: {recipeDetails.totalcookingtime}</h5>
        <h3 className="detail-title">Ingredients:</h3>
        <ul>
          {recipeDetails.ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
        <h3 className="detail-title">Preparation:</h3>
        <ol>
          {recipeDetails.preparation.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
        {/* Buttons */}
        <div className="con-buttons">
          <Button
            type="button"
            size="lg"
            variant="danger"
            className="star-button"
            onClick={toggleSave}
          >
            {isSaved ? 'Unsave' : 'Save'}
          </Button>
          <Button
            onClick={() => setOpen(!open)}
            aria-controls="timer-collapse"
            aria-expanded={open}
            size="lg"
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
        <div className="comments-section">
          <CommentSection recipeFirebaseKey={firebaseKey} userUID={user.uid} />
        </div>
      </div>
    </div>
  );
}
export default RecipeDetailsPage;
