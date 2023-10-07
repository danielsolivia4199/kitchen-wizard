/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-shadow */
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { useAuth } from '../utils/context/authContext';
import { createRecipe, updateRecipe, addSave } from './RecipeData';

const initialState = {
  name: '',
  ingredients: [],
  preparation: [],
  totalcookingtime: '',
  cuisine: '',
  dietaryrestrictions: '',
  image: '',
  public: true,
  mealtype: '',
};

function RecipeForm({ obj }) {
  const [formInput, setFormInput] = useState(initialState);
  const router = useRouter();
  const { user } = useAuth();
  const [ingredients, setIngredients] = useState(['']);
  const [preparation, setPreparation] = useState(['']);

  const handleIngredientChange = (e, index) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = e.target.value;
    setIngredients(newIngredients);
    setFormInput((prevState) => ({
      ...prevState,
      ingredients: newIngredients, // Keep it as an array
    }));
  };
  const addIngredient = () => {
    setIngredients([...ingredients, '']);
  };

  const handlePreparationChange = (e, index) => {
    const newPreparation = [...preparation];
    newPreparation[index] = e.target.value;
    setPreparation(newPreparation);
    setFormInput((prevState) => ({
      ...prevState,
      preparation: newPreparation, // Keep it as an array
    }));
  };

  const addPreparation = () => {
    setPreparation([...preparation, '']);
  };

  const removeIngredient = (index) => {
    const newIngredients = [...ingredients];
    newIngredients.splice(index, 1);
    setIngredients(newIngredients);
    setFormInput((prevState) => ({
      ...prevState,
      ingredients: newIngredients, // Keep it as an array
    }));
  };

  const removePreparation = (index) => {
    const newPreparation = [...preparation];
    newPreparation.splice(index, 1);
    setPreparation(newPreparation);
    setFormInput((prevState) => ({
      ...prevState,
      preparation: newPreparation, // Keep it as an array
    }));
  };

  useEffect(() => {
    if (obj.firebaseKey) {
      setFormInput(obj);
      setIngredients(Array.isArray(obj.ingredients) ? obj.ingredients : obj.ingredients.split('\n'));
      setPreparation(Array.isArray(obj.preparation) ? obj.preparation : obj.preparation.split('\n'));
    }
  }, [obj]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formInput,
      uid: user.uid,
    };
    if (obj.firebaseKey) {
      updateRecipe(payload).then(() => router.push(`/recipes/${obj.firebaseKey}`));
    } else {
      createRecipe(payload).then(({ name }) => {
        const newRecipeFirebaseKey = name;
        const patchPayload = { firebaseKey: newRecipeFirebaseKey };
        updateRecipe(patchPayload).then(() => {
          addSave(newRecipeFirebaseKey, user.uid)
            .then(() => {
              router.push('/recipes');
            })
            .catch((error) => {
              console.error('Error adding save:', error);
            });
        });
      });
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit} className="form-container">
        <h2 className="form-title">{obj.firebaseKey ? 'Update' : 'Add'} Recipe</h2>
        <FloatingLabel controlId="floatingInput1" label="Name" className="input1">
          <Form.Control
            type="text"
            placeholder="Enter Name of Recipe"
            name="name"
            value={formInput.name}
            onChange={handleChange}
            required
          />
        </FloatingLabel>
        <h3>Ingredients:</h3>
        {ingredients.map((ingredient, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <div key={index} className="input1">
            <input
              type="text"
              className="object-input"
              style={{ width: '90%' }}
              placeholder="Enter Recipe Ingredient (and measurements)"
              value={ingredient}
              onChange={(e) => handleIngredientChange(e, index)}
              required
            />
            <button type="button" className="x-button" onClick={() => removeIngredient(index)}>X</button>
          </div>
        ))}
        <button type="button" className="add-button" onClick={addIngredient}>
          Add Ingredient
        </button>
        <h3>Preparation:</h3>
        {preparation.map((preparation, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <div key={index} className="input1">
            <input
              type="text"
              style={{ width: '90%' }}
              placeholder="Enter Steps for Preparation"
              value={preparation}
              onChange={(e) => handlePreparationChange(e, index)}
              required
            />
            <button type="button" className="x-button" onClick={() => removePreparation(index)}>X</button>
          </div>
        ))}
        <button type="button" className="add-button" onClick={addPreparation}>
          Add Step
        </button>
        <FloatingLabel controlId="floatingInput4" label="Total Cooking Time" className="input1">
          <Form.Control
            type="text"
            placeholder="Total Cooking Time"
            name="totalcookingtime"
            value={formInput.totalcookingtime}
            onChange={handleChange}
            required
          />
        </FloatingLabel>
        <div>
          <FloatingLabel controlId="floatingInput5" label="Cuisine" className="input1">
            <Form.Control
              type="text"
              placeholder="Enter Cuisine Type"
              name="cuisine"
              value={formInput.cuisine}
              onChange={handleChange}
              required
            />
          </FloatingLabel>
        </div>
        <FloatingLabel controlId="floatingInput6" label="Dietary Restrictions">
          <Form.Select
            className="input1"
            name="dietaryrestrictions"
            value={formInput.dietaryrestrictions}
            onChange={handleChange}
          >
            <option value="">Select Dietary Restrictions</option>
            <option value="Vegan">Vegan</option>
            <option value="Vegetarian">Vegetarian</option>
            <option value="Gluten-Free">Gluten-Free</option>
          </Form.Select>
        </FloatingLabel>
        <FloatingLabel controlId="floatingInput8" label="Meal Type" className="mb-3">
          <Form.Select
            className="input1"
            name="mealtype"
            value={formInput.mealtype}
            onChange={handleChange}
          >
            <option value="">Select Meal Type</option>
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Snack">Snack</option>
            <option value="Dinner">Dinner</option>
            <option value="Dessert">Dessert</option>
            <option value="Drink">Drink</option>
          </Form.Select>
        </FloatingLabel>
        <FloatingLabel controlId="floatingInput7" label="Image" className="input1">
          <Form.Control
            className="input1"
            type="url"
            placeholder="Add Image"
            name="image"
            value={formInput.image}
            onChange={handleChange}
            required
          />
        </FloatingLabel>
        <Form.Check
          className="text-black mb-3"
          type="switch"
          id="public"
          name="public"
          label="Public?"
          checked={formInput.public}
          onChange={(e) => {
            setFormInput((prevState) => ({
              ...prevState,
              public: e.target.checked,
            }));
          }}
        />
        <Button type="submit" className="submit-button">{obj.firebaseKey ? 'Update' : 'Add'} Recipe</Button>
      </Form>
    </>
  );
}

RecipeForm.propTypes = {
  obj: PropTypes.shape({
    name: PropTypes.string,
    ingredients: PropTypes.array,
    preparation: PropTypes.array,
    totalcookingtime: PropTypes.string,
    cuisine: PropTypes.string,
    dietaryrestrictions: PropTypes.string,
    image: PropTypes.string,
    firebaseKey: PropTypes.string,
    uid: PropTypes.string,
    saved: PropTypes.bool,
    public: PropTypes.bool,
    mealtype: PropTypes.string,
  }),
};

RecipeForm.defaultProps = {
  obj: initialState,
};

export default RecipeForm;
