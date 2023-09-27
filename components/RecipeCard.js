/* eslint-disable react/no-unused-prop-types */
import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Link from 'next/link';
import { Modal, Image } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Star, StarFill } from 'react-bootstrap-icons';
import RecipeForm from '../api/RecipeForm';
import {
  deleteRecipe, addSave, removeSave, getUserSaved,
} from '../api/RecipeData';
import { useAuth } from '../utils/context/authContext';
import { useUserSaved } from './useUserSaved';

export default function RecipeCard({ recipeObj, onUpdate }) {
  const userSaved = useUserSaved();
  const [isSaved, setIsSaved] = useState(
    userSaved.some((save) => save.recipeFirebaseKey === recipeObj.firebaseKey),
  );
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const isRecipeCreator = user && user.uid === recipeObj.uid; // Checks if the user is the creator

  useEffect(() => {
    getUserSaved(user.uid).then((savedRecipes) => {
      const isRecipeSaved = savedRecipes.some((save) => save.recipeFirebaseKey === recipeObj.firebaseKey);
      setIsSaved(isRecipeSaved);
    });
  }, [recipeObj.firebaseKey, user.uid]);

  const toggleSave = () => {
    if (isSaved) {
      removeSave(recipeObj.firebaseKey, user.uid)
        .then(() => {
          setIsSaved(false);
          onUpdate();
        })
        .catch((error) => {
          console.error('Error removing save:', error);
        });
    } else {
      addSave(recipeObj.firebaseKey, user.uid)
        .then(() => {
          setIsSaved(true);
          onUpdate();
        })
        .catch((error) => {
          console.error('Error adding save:', error);
        });
    }
  };

  const deleteThisRecipe = async () => {
    if (isRecipeCreator && window.confirm(`Delete ${recipeObj.name} recipe?`)) {
      try {
        await deleteRecipe(recipeObj.firebaseKey);
        onUpdate();
      } catch (error) {
        console.error('Failed to delete recipe:', error);
      }
    }
  };

  const openEditModal = () => {
    setShowModal(true);
  };

  const closeEditModal = () => {
    setShowModal(false);
  };

  return (
    <Card className="recipe-card" style={{ width: '18rem', margin: '10px' }}>
      <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
        <Image
          variant="top"
          src={recipeObj.image}
          alt={recipeObj.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>
      <Card.Body>
        <Card.Title>{recipeObj.name}</Card.Title>
        <Button
          type="button"
          className="btn btn-link"
          onClick={toggleSave}
        >
          {isSaved ? (
            <StarFill className="text-red-500" size={24} />
          ) : (
            <Star className="text-blue-500" size={24} />
          )}
        </Button>
        <Link href={`/recipes/${recipeObj.firebaseKey}`} passHref>
          <Button variant="dark">VIEW</Button>
        </Link>
        {isRecipeCreator && ( // Render "Edit" and "Delete" buttons for the recipe creator
          <div>
            <Button variant="dark" onClick={openEditModal}>
              EDIT
            </Button>
            <Button variant="danger" onClick={deleteThisRecipe} className="m-2">
              DELETE
            </Button>
          </div>
        )}
      </Card.Body>

      <Modal show={showModal} onHide={closeEditModal}>
        <Modal.Body>
          <RecipeForm obj={recipeObj} />
        </Modal.Body>
      </Modal>
    </Card>
  );
}

RecipeCard.propTypes = {
  recipeObj: PropTypes.shape({
    image: PropTypes.string,
    name: PropTypes.string,
    firebaseKey: PropTypes.string,
    uid: PropTypes.string,
  }).isRequired,
  userSaved: PropTypes.arrayOf(
    PropTypes.shape({
      recipeFirebaseKey: PropTypes.string.isRequired,
      uid: PropTypes.string.isRequired,
    }),
  ),
  onUpdate: PropTypes.func.isRequired,
};

RecipeCard.defaultProps = {
  userSaved: [],
};
