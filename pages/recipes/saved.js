import { useEffect, useState } from 'react';
import { useAuth } from '../../utils/context/authContext';
import { getAllRecipes, getUserSaved } from '../../api/RecipeData';
import RecipeCard from '../../components/RecipeCard';

export default function UserSaved() {
  const { user } = useAuth();
  const [userSaved] = useState([]);
  const [filterUserSaved, setFilterUserSaved] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user && user.uid) {
      getUserSaved(user.uid)
        .then((saved) => {
          const filteredSavedRecipes = saved.filter((save) => {
            const matchingRecipe = recipes.find((recipe) => recipe.firebaseKey === save.recipeFirebaseKey);
            if (!matchingRecipe) {
              return false;
            }
            const { name, cuisine } = matchingRecipe;
            const query = searchQuery.toLowerCase();
            return (
              name.toLowerCase().includes(query)
              || cuisine.toLowerCase().includes(query)
            );
          });
          setFilterUserSaved(filteredSavedRecipes);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching user saved:', error);
          setLoading(false);
        });
    }
  }, [recipes, searchQuery]);

  useEffect(() => {
    getAllRecipes().then((recipeData) => {
      setRecipes(recipeData);
    })
      .catch((error) => {
        console.error('Error fetching recipes:', error);
      });
  }, []);

  return (
    <div className="full-page-container">
      <h1 className="user-saved">Saved Recipes</h1>
      <div className="search-bar">
        <input
          type="text"
          className="search-bar-input"
          placeholder="Search for recipe by name or cuisine"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="saved-recipes-container">
        {loading ? (
          <p>Loading...</p>
        ) : (
          filterUserSaved.map((save) => {
            const matchingRecipe = recipes.find((recipe) => recipe.firebaseKey === save.recipeFirebaseKey);
            if (matchingRecipe) {
              return (
                <RecipeCard
                  key={matchingRecipe.firebaseKey}
                  recipeObj={matchingRecipe}
                  userSaved={userSaved}
                  onUpdate={() => getAllRecipes().then((recipeData) => {
                    setRecipes(recipeData);
                  })}
                />
              );
            }
            return null;
          })
        )}
      </div>
    </div>
  );
}
