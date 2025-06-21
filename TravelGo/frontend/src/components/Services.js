
import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Form, Badge, Modal, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Services = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    service_type: '',
    location: '',
    min_price: '',
    max_price: ''
  });
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [bookingData, setBookingData] = useState({
    booking_date: '',
    passengers: 1
  });
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [services, filter]);

  const fetchServices = async () => {
    try {
      const response = await axios.get('/services');
      setServices(response.data.services);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch services:', error);
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = services;

    if (filter.service_type) {
      filtered = filtered.filter(service => service.service_type === filter.service_type);
    }

    if (filter.location) {
      filtered = filtered.filter(service => 
        service.location.toLowerCase().includes(filter.location.toLowerCase()) ||
        (service.destination && service.destination.toLowerCase().includes(filter.location.toLowerCase()))
      );
    }

    if (filter.min_price) {
      filtered = filtered.filter(service => service.price >= parseFloat(filter.min_price));
    }

    if (filter.max_price) {
      filtered = filtered.filter(service => service.price <= parseFloat(filter.max_price));
    }

    setFilteredServices(filtered);
  };

  const handleFilterChange = (e) => {
    setFilter({
      ...filter,
      [e.target.name]: e.target.value
    });
  };

  const handleBookingClick = (service) => {
    if (!user) {
      alert('Please login to make a booking');
      return;
    }
    setSelectedService(service);
    setShowBookingModal(true);
    setBookingError('');
    setBookingSuccess('');
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingError('');

    try {
      await axios.post('/bookings', {
        service_id: selectedService.id,
        booking_date: bookingData.booking_date,
        passengers: parseInt(bookingData.passengers)
      });
      
      setBookingSuccess('Booking created successfully!');
      setShowBookingModal(false);
      fetchServices(); // Refresh services to update available seats
    } catch (error) {
      setBookingError(error.response?.data?.detail || 'Booking failed');
    }
  };

  if (loading) {
    return <div className="text-center">Loading services...</div>;
  }

  return (
    <div>
      <h2 className="mb-4">Travel Services</h2>
      
      {/* Filters */}
      <Card className="mb-4">
        <Card.Body>
          <h5>Filter Services</h5>
          <Row>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Service Type</Form.Label>
                <Form.Select name="service_type" value={filter.service_type} onChange={handleFilterChange}>
                  <option value="">All Types</option>
                  <option value="bus">Bus</option>
                  <option value="hotel">Hotel</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Location</Form.Label>
                <Form.Control
                  type="text"
                  name="location"
                  value={filter.location}
                  onChange={handleFilterChange}
                  placeholder="Search location..."
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Min Price</Form.Label>
                <Form.Control
                  type="number"
                  name="min_price"
                  value={filter.min_price}
                  onChange={handleFilterChange}
                  placeholder="Min price"
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Max Price</Form.Label>
                <Form.Control
                  type="number"
                  name="max_price"
                  value={filter.max_price}
                  onChange={handleFilterChange}
                  placeholder="Max price"
                />
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {bookingSuccess && (
        <Alert variant="success" onClose={() => setBookingSuccess('')} dismissible>
          {bookingSuccess}
        </Alert>
      )}

      {/* Services List */}
      <Row>
        {filteredServices.map(service => (
          <Col md={6} lg={4} key={service.id} className="mb-4">
            <Card className="h-100">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h5>{service.name}</h5>
                  <Badge bg={service.service_type === 'bus' ? 'primary' : 'success'}>
                    {service.service_type.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-muted mb-2">
                  📍 {service.location}
                  {service.destination && ` → ${service.destination}`}
                </p>
                <p>{service.description}</p>
                <div className="mb-3">
                  <strong>Amenities:</strong>
                  <div className="mt-1">
                    {JSON.parse(service.amenities || '[]').map((amenity, index) => (
                      <Badge key={index} bg="light" text="dark" className="me-1">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h4 className="text-primary mb-0">${service.price}</h4>
                    <small className="text-muted">
                      {service.available_seats} seats available
                    </small>
                  </div>
                  <Button 
                    variant="primary" 
                    onClick={() => handleBookingClick(service)}
                    disabled={service.available_seats === 0}
                  >
                    {service.available_seats === 0 ? 'Sold Out' : 'Book Now'}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {filteredServices.length === 0 && (
        <div className="text-center text-muted">
          <p>No services found matching your criteria.</p>
        </div>
      )}

      {/* Booking Modal */}
      <Modal show={showBookingModal} onHide={() => setShowBookingModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Book {selectedService?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {bookingError && <Alert variant="danger">{bookingError}</Alert>}
          <Form onSubmit={handleBookingSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Booking Date</Form.Label>
              <Form.Control
                type="date"
                value={bookingData.booking_date}
                onChange={(e) => setBookingData({...bookingData, booking_date: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Number of Passengers</Form.Label>
              <Form.Control
                type="number"
                min="1"
                max={selectedService?.available_seats}
                value={bookingData.passengers}
                onChange={(e) => setBookingData({...bookingData, passengers: e.target.value})}
                required
              />
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button variant="secondary" onClick={() => setShowBookingModal(false)} className="me-2">
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Confirm Booking
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Services;
