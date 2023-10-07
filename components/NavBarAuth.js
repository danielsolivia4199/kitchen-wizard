import React from 'react';
import Link from 'next/link';
import {
  Navbar, Container, Nav, Button,
} from 'react-bootstrap';
import { signOut } from '../utils/auth';

export default function NavBarAuth() {
  return (
    <Navbar className="custom-navbar align-items-center" collapseOnSelect expand="sm">
      <Container fluid>
        <div className="d-flex align-items-center">
          <Link passHref href="/">
            <Navbar.Brand>Kitchen Wizard |</Navbar.Brand>
          </Link>
        </div>

        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav" className="nav-text">
          <Nav>
            <Link passHref href="/recipes">
              <Nav.Link>Recipes</Nav.Link>
            </Link>
            <Link passHref href="/profile">
              <Nav.Link>Profile</Nav.Link>
            </Link>
          </Nav>
        </Navbar.Collapse>

        <div className="d-flex align-items-center">
          <Button variant="danger" onClick={signOut}>Sign Out</Button>
        </div>
      </Container>
    </Navbar>

  );
}
