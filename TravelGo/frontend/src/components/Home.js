
import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <Container>
      <div className="text-center mb-5">
        <h1 className="display-4 mb-3">Welcome to TravelGo</h1>
        <p className="lead">Your unified travel booking platform</p>
        <p className="text-muted">
          Search, compare, and book buses and hotels all in one place
        </p>
      </div>

      <Row className="mb-5">
        <Col md={6}>
          <Card className="h-100">
            <Card.Body className="text-center">
              <h3>🚌 Bus Services</h3>
              <p>Find and book comfortable bus rides to your destination</p>
              <LinkContainer to="/services?type=bus">
                <Button variant="primary">Browse Buses</Button>
              </LinkContainer>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="h-100">
            <Card.Body className="text-center">
              <h3>🏨 Hotel Services</h3>
              <p>Discover and reserve the perfect accommodation</p>
              <LinkContainer to="/services?type=hotel">
                <Button variant="primary">Browse Hotels</Button>
              </LinkContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {!user && (
        <Row className="text-center">
          <Col>
            <h4>Get Started Today!</h4>
            <p>Create an account to start booking your travel services</p>
            <LinkContainer to="/register">
              <Button variant="success" size="lg" className="me-3">
                Sign Up Now
              </Button>
            </LinkContainer>
            <LinkContainer to="/login">
              <Button variant="outline-primary" size="lg">
                Login
              </Button>
            </LinkContainer>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Home;
