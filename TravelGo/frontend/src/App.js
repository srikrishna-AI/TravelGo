
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Navigation from './components/Navigation';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Services from './components/Services';
import Bookings from './components/Bookings';
import Profile from './components/Profile';
import { AuthProvider } from './context/AuthContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navigation />
          <Container className="mt-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/services" element={<Services />} />
              <Route path="/bookings" element={<Bookings />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </Container>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
