import React from 'react';
import { Button } from 'react-bootstrap';
import { signIn } from '../utils/auth';

function Signin() {
  return (
    <div
      className="text-center d-flex flex-column justify-content-start align-content-center text-font" // Applied Roboto Mono to the container
      style={{
        margin: '0 auto',
        height: '100vh',
        backgroundImage: 'url(https://img.freepik.com/free-vector/fruit-vegetables-background_23-2148512944.jpg?w=1800&t=st=1696640567~exp=1696641167~hmac=138cfaa43e3372cee03d4800c58ca5d27cf2eaa2fa38d08c5d95e1780e9ef5b2)',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
      }}
    >
      <h1 className="heading-font" style={{ marginTop: '30px' }}>Kitchen Wizard</h1>
      <p>Your ultimate cooking companion awaits! Become a kitchen wizard and make your culinary journey nothing short of magical. 🌟</p>
      <Button type="button" size="lg" className="copy-btn" onClick={signIn} style={{ width: '150px', margin: '0 auto', marginTop: '10px' }}>
        Sign In
      </Button>

    </div>
  );
}

export default Signin;
