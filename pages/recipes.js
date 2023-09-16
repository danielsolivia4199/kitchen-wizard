import { React } from 'react';
import { Button } from 'react-bootstrap';
import Link from 'next/link';

export default function RecipePage() {
  return (
    <>
      <h3>RECIPES</h3>
      <Link href="/recipes/generate" passHref>
        <Button variant="dark">GENERATE</Button>
      </Link>
      <Link href="/recipes/add" passHref>
        <Button variant="dark">ADD</Button>
      </Link>
      <Link href="/recipes/saved" passHref>
        <Button variant="dark">SAVED</Button>
      </Link>
    </>
  );
}
