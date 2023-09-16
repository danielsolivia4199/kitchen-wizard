import { useEffect, useState } from 'react';
import { useAuth } from '../../utils/context/authContext';
import { getAllRecipes, getUserSaved } from '../../api/RecipeData';
import RecipeCard from '../../components/RecipeCard';

export default function UserSaved() {
  const { user } = useAuth();
  const [userSaved, setUserSaved] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user && user.uid) {
      getUserSaved(user.uid)
        .then((saved) => {
          setUserSaved(saved);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching user saved:', error);
          setLoading(false);
        });
    }
  }, [user]);

  useEffect(() => {
    getAllRecipes().then((recipeData) => {
      setRecipes(recipeData);
    })
      .catch((error) => {
        console.error('Error fetching recipes:', error);
      });
  }, []);

  const filteredSavedRecipes = userSaved.filter((save) => {
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

  return (
    <div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for recipe by name or cuisine"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '500px',
            height: '40px',
            fontSize: '18px',
          }}
        />
      </div>
      <h1 className="user-saved">Saved Recipes</h1>
      <div className="saved">
        {loading ? (
          <p>Loading...</p>
        ) : (
          filteredSavedRecipes.map((save) => {
            const matchingRecipe = recipes.find((recipe) => recipe.firebaseKey === save.recipeFirebaseKey);
            if (matchingRecipe) {
              return (
                <RecipeCard
                  key={matchingRecipe.firebaseKey}
                  recipeObj={matchingRecipe}
                  userSaved={userSaved}
                  onUpdate={() => getUserSaved(user.uid).then((saved) => setUserSaved(saved))}
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
