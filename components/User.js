import React from 'react';
import { Button } from 'react-bootstrap';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '../utils/context/authContext';
import { signOut } from '../utils/auth';

export default function ShowUser() {
  const { user } = useAuth();
  return (
    <div>
      <Image src={user.photoURL} alt="user" width="75px" height="75px" />
      <h2>{user.displayName}</h2>
      <h2>Email: {user.email}</h2>
      <h2>Last Logged In: {user.metadata.lastSignInTime}</h2>
      <Link href="/recipes/saved" passHref>
        <Button type="button" size="lg" className="saved-recipes-btn">
          SAVED RECIPES
        </Button>
      </Link>
      <Button type="button" size="lg" className="saved-recipes-btn" onClick={signOut}>SIGN OUT</Button>
    </div>
  );
}
