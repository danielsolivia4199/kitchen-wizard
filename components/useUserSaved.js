/* eslint-disable import/prefer-default-export */
import { useState, useEffect } from 'react';
import { getUserSaved } from '../api/RecipeData';
import { useAuth } from '../utils/context/authContext';

export const useUserSaved = () => {
  const [userSaved, setUserSaved] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      getUserSaved(user.uid)
        .then(setUserSaved)
        .catch((error) => console.error('Error fetching user saved recipes:', error));
    }
  }, [user]);

  return userSaved;
};
