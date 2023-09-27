import React from 'react';
import { Button } from 'react-bootstrap';
import Link from 'next/link';

export default function RecipePage() {
  return (
    <div className="container-recipes">
      <h3>RECIPES</h3>
      <div className="button-container">
        <Link href="/recipes/generate" passHref>
          <Button variant="success" className="big-button">GENERATE</Button>
        </Link>
      </div>
      <div className="button-container">
        <Link href="/recipes/add" passHref>
          <Button variant="primary" className="big-button">ADD</Button>
        </Link>
      </div>
      <div className="button-container">
        <Link href="/recipes/saved" passHref>
          <Button variant="dark" className="big-button">SAVED</Button>
        </Link>
      </div>
    </div>
  );
}
