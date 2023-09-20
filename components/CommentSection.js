/* eslint-disable no-restricted-globals */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Form } from 'react-bootstrap';
import { useAuth } from '../utils/context/authContext';
import { getComments, createComment } from '../api/CommentData';

export default function CommentSection({ recipeFirebaseKey }) {
  const [comments, setComments] = useState([]);
  const [newComments, setNewComments] = useState('');
  const { user } = useAuth();
  const [selectedRating, setSelectedRating] = useState(1);

  useEffect(() => {
    getComments(recipeFirebaseKey).then((comment) => {
      setComments(comment);
    });
  }, [recipeFirebaseKey]);

  const handleChange = (e) => {
    setNewComments(e.target.value);
  };

  const handleRatingChange = (e) => {
    setSelectedRating(Number(e.target.value));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      text: newComments,
      rating: Number(selectedRating),
      recipeFirebaseKey,
      userUID: user.uid,
      userDisplayName: user.displayName,
      time: new Date().toString(),
    };
    createComment(payload).then(() => {
      getComments(recipeFirebaseKey).then(setComments);
      setNewComments('');
      setSelectedRating(1);
    });
  };

  const totalReviews = comments.length;
  const averageRating = comments.reduce((acc, comment) => acc + comment.rating, 0) / totalReviews;

  return (
    <div>
      <h3>Reviews ({totalReviews})</h3>
      <p>Average Rating: {isNaN(averageRating) ? 'N/A' : averageRating.toFixed()}/5</p>
      <div className="comment-section">
        {comments.map((comment) => (
          <div key={comment.firebaseKey} className="comment-card">
            <span className="comment-data">{comment.time}</span>
            <h5>{comment.userDisplayName}:</h5>
            <p>{comment.text}</p>
            <p>Rating: {comment.rating}/5</p>
          </div>
        ))}
      </div>
      <Form onSubmit={handleSubmit}>
        <input type="text" value={newComments} onChange={handleChange} placeholder="Leave a Review!" />
        <select value={selectedRating} onChange={handleRatingChange}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
        <Button type="submit">Add</Button>
      </Form>
    </div>
  );
}

CommentSection.propTypes = {
  recipeFirebaseKey: PropTypes.string.isRequired,
};
