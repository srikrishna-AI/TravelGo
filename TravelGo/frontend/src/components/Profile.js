
import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return <div className="text-center">Please login to view your profile.</div>;
  }

  return (
    <div>
      <h2 className="mb-4">My Profile</h2>
      
      <Row>
        <Col md={8}>
          <Card>
            <Card.Header>
              <h5>Personal Information</h5>
            </Card.Header>
            <Card.Body>
              <Row className="mb-3">
                <Col sm={3}><strong>First Name:</strong></Col>
                <Col sm={9}>{user.first_name}</Col>
              </Row>
              <Row className="mb-3">
                <Col sm={3}><strong>Last Name:</strong></Col>
                <Col sm={9}>{user.last_name}</Col>
              </Row>
              <Row className="mb-3">
                <Col sm={3}><strong>Email:</strong></Col>
                <Col sm={9}>{user.email}</Col>
              </Row>
              <Row className="mb-3">
                <Col sm={3}><strong>Member Since:</strong></Col>
                <Col sm={9}>{new Date(user.created_at).toLocaleDateString()}</Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Profile;
