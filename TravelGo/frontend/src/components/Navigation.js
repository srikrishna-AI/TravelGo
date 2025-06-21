
import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useAuth } from '../context/AuthContext';

const Navigation = () => {
  const { user, logout } = useAuth();

  return (
    <Navbar bg="primary" variant="dark" expand="lg">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand>TravelGo</Navbar.Brand>
        </LinkContainer>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/">
              <Nav.Link>Home</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/services">
              <Nav.Link>Services</Nav.Link>
            </LinkContainer>
            {user && (
              <>
                <LinkContainer to="/bookings">
                  <Nav.Link>My Bookings</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/profile">
                  <Nav.Link>Profile</Nav.Link>
                </LinkContainer>
              </>
            )}
          </Nav>
          
          <Nav>
            {user ? (
              <>
                <Navbar.Text className="me-3">
                  Welcome, {user.first_name}!
                </Navbar.Text>
                <Button variant="outline-light" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <LinkContainer to="/login">
                  <Nav.Link>Login</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/register">
                  <Nav.Link>Register</Nav.Link>
                </LinkContainer>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
