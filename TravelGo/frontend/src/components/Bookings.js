
import React, { useState, useEffect } from 'react';
import { Card, Badge, Button, Alert, Modal } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('/bookings');
      setBookings(response.data.bookings);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      setError('Failed to load bookings');
      setLoading(false);
    }
  };

  const handleCancelClick = (booking) => {
    setSelectedBooking(booking);
    setShowCancelModal(true);
  };

  const handleCancelConfirm = async () => {
    try {
      await axios.delete(`/bookings/${selectedBooking.id}`);
      setSuccess('Booking cancelled successfully');
      setShowCancelModal(false);
      fetchBookings(); // Refresh bookings
    } catch (error) {
      setError(error.response?.data?.detail || 'Failed to cancel booking');
      setShowCancelModal(false);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      confirmed: 'success',
      pending: 'warning',
      cancelled: 'danger'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status.toUpperCase()}</Badge>;
  };

  if (!user) {
    return <div className="text-center">Please login to view your bookings.</div>;
  }

  if (loading) {
    return <div className="text-center">Loading bookings...</div>;
  }

  return (
    <div>
      <h2 className="mb-4">My Bookings</h2>
      
      {error && (
        <Alert variant="danger" onClose={() => setError('')} dismissible>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert variant="success" onClose={() => setSuccess('')} dismissible>
          {success}
        </Alert>
      )}

      {bookings.length === 0 ? (
        <div className="text-center text-muted">
          <p>You haven't made any bookings yet.</p>
        </div>
      ) : (
        bookings.map(booking => (
          <Card key={booking.id} className="mb-3">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h5>{booking.service_name}</h5>
                  <p className="text-muted mb-2">
                    📍 {booking.location}
                    {booking.destination && ` → ${booking.destination}`}
                  </p>
                  <p className="mb-1">
                    <strong>Booking Date:</strong> {booking.booking_date}
                  </p>
                  <p className="mb-1">
                    <strong>Passengers:</strong> {booking.passengers}
                  </p>
                  <p className="mb-1">
                    <strong>Total Price:</strong> ${(booking.price * booking.passengers).toFixed(2)}
                  </p>
                  <p className="mb-1">
                    <strong>Booked On:</strong> {new Date(booking.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-end">
                  <div className="mb-2">
                    {getStatusBadge(booking.status)}
                  </div>
                  <Badge bg={booking.service_type === 'bus' ? 'primary' : 'success'}>
                    {booking.service_type.toUpperCase()}
                  </Badge>
                  {booking.status === 'confirmed' && (
                    <div className="mt-2">
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleCancelClick(booking)}
                      >
                        Cancel Booking
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card.Body>
          </Card>
        ))
      )}

      {/* Cancel Confirmation Modal */}
      <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Cancel Booking</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to cancel this booking?</p>
          <p><strong>{selectedBooking?.service_name}</strong></p>
          <p>Booking Date: {selectedBooking?.booking_date}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
            Keep Booking
          </Button>
          <Button variant="danger" onClick={handleCancelConfirm}>
            Cancel Booking
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Bookings;
