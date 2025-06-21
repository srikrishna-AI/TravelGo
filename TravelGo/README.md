# TravelGo
# TravelGo - Unified Travel Booking Platform

TravelGo is a full-stack web application that enables users to search, compare, and book various travel services such as buses and hotels in real-time.

## Features

- **User Authentication**: Secure registration and login with JWT tokens
- **Service Search**: Browse and filter buses and hotels by location, price, and availability
- **Real-time Booking**: Book services with automatic availability updates
- **Booking Management**: View and cancel existing bookings
- **User Profile**: Manage personal information and booking history
- **Responsive Design**: Mobile-friendly interface built with React Bootstrap

## Tech Stack

- **Backend**: Python FastAPI with async support
- **Database**: MySQL for structured data
- **Frontend**: React with Bootstrap
- **Authentication**: JWT tokens with bcrypt password hashing
- **Real-time Features**: Transaction locks for concurrent booking handling

## Prerequisites

- Python 3.8+
- Node.js 14+
- MySQL 8.0+

## Installation & Setup

### 1. Clone the repository
```bash
git clone <repository-url>
cd TravelGo
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Set up MySQL database
python database.py

# Start the FastAPI server
python main.py
```

The API will be available at `http://localhost:8000`
API documentation (Swagger UI) will be available at `http://localhost:8000/docs`

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install Node.js dependencies
npm install

# Start the React development server
npm start
```

The frontend will be available at `http://localhost:3000`

## Database Schema

The application uses three main tables:

- **users**: User authentication and profile information
- **services**: Travel services (buses and hotels) with availability
- **bookings**: User bookings with status tracking

## API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login

### Services
- `GET /services` - Get all available services with optional filters
- `GET /services?service_type=bus&location=New York` - Filtered search

### Bookings
- `POST /bookings` - Create a new booking
- `GET /bookings` - Get user's bookings
- `DELETE /bookings/{booking_id}` - Cancel a booking

### User Profile
- `GET /profile` - Get user profile information

## Demo Account

You can use the following demo account to test the application:
- **Email**: demo@travelgo.com
- **Password**: password123

## Key Features

### Real-time Availability
- Uses MySQL transaction locks to prevent overbooking
- Automatic seat count updates when bookings are made or cancelled

### Concurrent Booking Handling
- Database-level locking ensures data consistency
- Proper error handling for booking conflicts

### Security
- JWT token-based authentication
- bcrypt password hashing
- CORS configuration for frontend integration

### Responsive Design
- Mobile-friendly interface
- Bootstrap components for consistent styling
- Real-time updates without page refresh

## Architecture

The application follows a clean architecture pattern:

- **Frontend**: React SPA with context-based state management
- **Backend**: FastAPI with async request handling
- **Database**: MySQL with proper indexing and constraints
- **Authentication**: JWT tokens with secure password storage

## Deployment

The application is designed to be cloud-ready and can be deployed on:
- AWS EC2 (application servers)
- AWS RDS (MySQL database)
- AWS S3 + CloudFront (static frontend hosting)

## Future Enhancements

- Payment gateway integration
- Advanced search filters (ratings, amenities)
- Admin panel for service management
- Mobile app development
- Real-time notifications
- Itinerary planning features

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
