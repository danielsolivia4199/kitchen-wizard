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
      <h3 className="detail-title">Reviews ({totalReviews})</h3>
      <p>Average Rating: {isNaN(averageRating) ? 'N/A' : averageRating.toFixed()}/5</p>
      <div className="comment-section">
        {comments.map((comment) => (
          <div key={comment.firebaseKey} className="comment-card">
            <h4 className="display-name-comment">{comment.userDisplayName}:</h4>
            <h5>{comment.text}</h5>
            <p>Rating:{comment.rating}/5</p>
            <span className="comment-data">{comment.time}</span>
          </div>
        ))}
      </div>
      <Form onSubmit={handleSubmit}>
        <input type="text" value={newComments} onChange={handleChange} placeholder="Leave a Review!" className="review-text" />
        <select value={selectedRating} onChange={handleRatingChange} className="review-text">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
        <Button type="submit" variant="primary">Add</Button>
      </Form>
    </div>
  );
}

CommentSection.propTypes = {
  recipeFirebaseKey: PropTypes.string.isRequired,
};
