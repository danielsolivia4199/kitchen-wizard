import React from 'react';
import { Button } from 'react-bootstrap';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '../utils/context/authContext';
import { signOut } from '../utils/auth';

export default function ShowUser() {
  const { user } = useAuth();
  return (
    <div className="profile-container">
      <Image src={user.photoURL} alt="user" width="75" height="75" className="profile-image" />
      <h2 className="profile-heading">{user.displayName}</h2>
      <h2 className="profile-detail">Email: {user.email}</h2>
      <h2 className="profile-detail">Last Logged In: {user.metadata.lastSignInTime}</h2>
      <Link href="/recipes/saved" passHref>
        <Button type="button" size="lg" className="saved-recipes-btn">
          SAVED RECIPES
        </Button>
      </Link>
      <Button type="button" size="lg" className="saved-recipes-btn" onClick={signOut}>SIGN OUT</Button>
    </div>
  );
}
