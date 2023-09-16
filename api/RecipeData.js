import { clientCredentials } from '../utils/client';

const endpoint = clientCredentials.databaseURL;

const getRecipe = (uid) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/recipes.json?orderBy="uid"&equalTo="${uid}"`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data) {
        resolve(Object.values(data));
      } else {
        resolve([]);
      }
    })
    .catch(reject);
});

const createRecipe = (payload) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/recipes.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
    .then((response) => response.json())
    .then((data) => resolve(data))
    .catch(reject);
});

const updateRecipe = (payload) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/recipes/${payload.firebaseKey}.json`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
    .then((response) => response.json())
    .then((data) => resolve(data))
    .catch(reject);
});

const getSingleRecipe = (firebaseKey) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/recipes/${firebaseKey}.json`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => resolve(data))
    .catch(reject);
});

const deleteRecipe = (firebaseKey) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/recipes/${firebaseKey}.json`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => resolve(data))
    .catch(reject);
});

const getUserSaved = (uid) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/userSaved/${uid}.json`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data) {
        const saveKeys = Object.keys(data);
        const userSaved = saveKeys.map((key) => ({
          savedFirebaseKey: key,
          recipeFirebaseKey: data[key].recipeFirebaseKey,
          uid: data[key].uid,
        }));
        resolve(userSaved);
      } else {
        resolve([]);
      }
    })
    .catch(reject);
});

const addSave = (recipeFirebaseKey, uid) => new Promise((resolve, reject) => {
  const save = {
    recipeFirebaseKey,
    uid,
    saved: true,
  };

  fetch(`${endpoint}/userSaved/${uid}.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(save),
  })
    .then((response) => response.json())
    .then(({ name }) => {
      const patchedSave = { ...save, firebaseKey: name };
      resolve(patchedSave);
    })
    .catch(reject);
});

const removeSave = (recipeFirebaseKey, uid) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/userSaved/${uid}.json`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const saveKey = Object.keys(data).find((key) => data[key].recipeFirebaseKey === recipeFirebaseKey);

      if (saveKey) {
        fetch(`${endpoint}/userSaved/${uid}/${saveKey}.json`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((deleteResponse) => {
            if (deleteResponse.ok) {
              resolve();
            } else {
              reject(new Error('Failed to remove save'));
            }
          })
          .catch(reject);
      } else {
        reject(new Error('save not found'));
      }
    })
    .catch(reject);
});

const getAllRecipes = () => new Promise((resolve, reject) => {
  fetch(`${endpoint}/recipes.json`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data) {
        resolve(Object.values(data));
      } else {
        resolve([]);
      }
    })
    .catch(reject);
});

export {
  getRecipe,
  createRecipe,
  updateRecipe,
  getSingleRecipe,
  deleteRecipe,
  getUserSaved,
  addSave,
  removeSave,
  getAllRecipes,
};
