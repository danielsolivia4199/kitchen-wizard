/* eslint-disable react/no-unescaped-entities */
import { Card, Image } from 'react-bootstrap';
import Link from 'next/link';
import { useAuth } from '../utils/context/authContext';

function Home() {
  const { user } = useAuth();

  return (
    <div className="home-container">
      <h3 className="home-title">Welcome to Kitchen Wizard, {user.displayName}!</h3>
      <Image
        src="https://cdn.myportfolio.com/9a75b9adebf12f35ef4d22938bf64527/b54e18fc-3fb8-4282-8fd3-d2a488023289_rw_600.gif?h=2b3d09c5b915d8afc941af3ae46dccc8"
        className="home-image"
      />
      <h4 className="home-subtitle">Your ultimate cooking companion awaits! Become a kitchen wizard and make your culinary journey nothing short of magical. 🌟</h4>
      <div>
        <Link href="/recipes/generate" passHref>
          <Card className="home-card">
            <Card.Body>
              <Card.Title className="home-card-title">Raid Your Fridge 🍎🥦</Card.Title>
              <Card.Text className="home-card-text">
                Unsure what to cook with the ingredients you've got? Worry not! Simply input your available ingredients into the recipe generator, and presto! A recipe will appear before your eyes like magic.
              </Card.Text>
            </Card.Body>
          </Card>
        </Link>
        <Card className="home-card">
          <Card.Body>
            <Card.Title className="home-card-title">Unleash the Wizard in You 🧙‍♂️</Card.Title>
            <Card.Text className="home-card-text">
              Once a recipe appears, its time to challenge and delight your taste buds. Roll up your sleeves and make some kitchen magic happen!
            </Card.Text>
          </Card.Body>
        </Card>
        <Link href="/recipes/add" passHref>
          <Card className="home-card" style={{ cursor: 'pointer' }}>
            <Card.Body>
              <Card.Title className="home-card-title">Share the Love 💕</Card.Title>
              <Card.Text className="home-card-text">
                Holding onto a tasty recipe? Add culinary gems to the generator and let others in on the magic. Because great flavors are worth sharing!
              </Card.Text>
            </Card.Body>
          </Card>
        </Link>
        <Card className="home-card">
          <Card.Body>
            <Card.Title className="home-card-title">Or Guard Your Culinary Secrets 🤫</Card.Title>
            <Card.Text className="home-card-text">
              Have a family recipe that's too magical to share? When adding a recipe, you have the option to keep it private, allowing you to digitize the recipe while keeping it under wraps.
            </Card.Text>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}

export default Home;
