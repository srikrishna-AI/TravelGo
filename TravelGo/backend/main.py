
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from datetime import datetime, timedelta
from typing import Optional, List
import jwt
import bcrypt
import mysql.connector
from mysql.connector import Error
import os
from contextlib import contextmanager
import uvicorn

app = FastAPI(title="TravelGo API", description="Real-time unified travel booking platform")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()
SECRET_KEY = "your-secret-key-change-in-production"
ALGORITHM = "HS256"

# Database configuration
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': 'password',
    'database': 'travelgo'
}

@contextmanager
def get_db_connection():
    connection = None
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        yield connection
    except Error as e:
        if connection:
            connection.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        if connection and connection.is_connected():
            connection.close()

# Models
from pydantic import BaseModel, EmailStr
from enum import Enum

class ServiceType(str, Enum):
    BUS = "bus"
    HOTEL = "hotel"

class BookingStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    first_name: str
    last_name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class ServiceSearch(BaseModel):
    service_type: ServiceType
    location: Optional[str] = None
    destination: Optional[str] = None
    date: Optional[str] = None
    min_price: Optional[float] = None
    max_price: Optional[float] = None

class BookingCreate(BaseModel):
    service_id: int
    booking_date: str
    passengers: int = 1

# Authentication functions
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return user_id
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

# Routes
@app.get("/")
def read_root():
    return {"message": "Welcome to TravelGo API"}

@app.post("/auth/register")
def register_user(user: UserCreate):
    with get_db_connection() as connection:
        cursor = connection.cursor()
        
        # Check if user already exists
        cursor.execute("SELECT id FROM users WHERE email = %s", (user.email,))
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Hash password
        hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt())
        
        # Insert user
        cursor.execute(
            "INSERT INTO users (email, password, first_name, last_name) VALUES (%s, %s, %s, %s)",
            (user.email, hashed_password, user.first_name, user.last_name)
        )
        connection.commit()
        
        return {"message": "User registered successfully"}

@app.post("/auth/login")
def login_user(user: UserLogin):
    with get_db_connection() as connection:
        cursor = connection.cursor()
        cursor.execute("SELECT id, password FROM users WHERE email = %s", (user.email,))
        result = cursor.fetchone()
        
        if not result or not bcrypt.checkpw(user.password.encode('utf-8'), result[1].encode('utf-8')):
            raise HTTPException(status_code=400, detail="Invalid credentials")
        
        access_token = create_access_token(data={"sub": result[0]})
        return {"access_token": access_token, "token_type": "bearer"}

@app.get("/services")
def get_services(service_type: Optional[ServiceType] = None, location: Optional[str] = None):
    with get_db_connection() as connection:
        cursor = connection.cursor(dictionary=True)
        
        query = "SELECT * FROM services WHERE available_seats > 0"
        params = []
        
        if service_type:
            query += " AND service_type = %s"
            params.append(service_type.value)
        
        if location:
            query += " AND (location LIKE %s OR destination LIKE %s)"
            params.extend([f"%{location}%", f"%{location}%"])
        
        cursor.execute(query, params)
        services = cursor.fetchall()
        
        return {"services": services}

@app.post("/bookings")
def create_booking(booking: BookingCreate, user_id: int = Depends(verify_token)):
    with get_db_connection() as connection:
        cursor = connection.cursor()
        
        try:
            # Start transaction
            connection.start_transaction()
            
            # Check service availability with lock
            cursor.execute(
                "SELECT available_seats FROM services WHERE id = %s FOR UPDATE",
                (booking.service_id,)
            )
            result = cursor.fetchone()
            
            if not result or result[0] < booking.passengers:
                connection.rollback()
                raise HTTPException(status_code=400, detail="Service not available or insufficient seats")
            
            # Update available seats
            cursor.execute(
                "UPDATE services SET available_seats = available_seats - %s WHERE id = %s",
                (booking.passengers, booking.service_id)
            )
            
            # Create booking
            cursor.execute(
                "INSERT INTO bookings (user_id, service_id, booking_date, passengers, status) VALUES (%s, %s, %s, %s, %s)",
                (user_id, booking.service_id, booking.booking_date, booking.passengers, BookingStatus.CONFIRMED.value)
            )
            
            booking_id = cursor.lastrowid
            connection.commit()
            
            return {"message": "Booking created successfully", "booking_id": booking_id}
            
        except Exception as e:
            connection.rollback()
            raise HTTPException(status_code=500, detail=str(e))

@app.get("/bookings")
def get_user_bookings(user_id: int = Depends(verify_token)):
    with get_db_connection() as connection:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("""
            SELECT b.*, s.name as service_name, s.service_type, s.location, s.destination, s.price
            FROM bookings b
            JOIN services s ON b.service_id = s.id
            WHERE b.user_id = %s
            ORDER BY b.created_at DESC
        """, (user_id,))
        
        bookings = cursor.fetchall()
        return {"bookings": bookings}

@app.delete("/bookings/{booking_id}")
def cancel_booking(booking_id: int, user_id: int = Depends(verify_token)):
    with get_db_connection() as connection:
        cursor = connection.cursor()
        
        try:
            connection.start_transaction()
            
            # Check if booking exists and belongs to user
            cursor.execute(
                "SELECT service_id, passengers FROM bookings WHERE id = %s AND user_id = %s AND status = %s",
                (booking_id, user_id, BookingStatus.CONFIRMED.value)
            )
            result = cursor.fetchone()
            
            if not result:
                connection.rollback()
                raise HTTPException(status_code=404, detail="Booking not found or already cancelled")
            
            service_id, passengers = result
            
            # Update booking status
            cursor.execute(
                "UPDATE bookings SET status = %s WHERE id = %s",
                (BookingStatus.CANCELLED.value, booking_id)
            )
            
            # Return seats to service
            cursor.execute(
                "UPDATE services SET available_seats = available_seats + %s WHERE id = %s",
                (passengers, service_id)
            )
            
            connection.commit()
            return {"message": "Booking cancelled successfully"}
            
        except Exception as e:
            connection.rollback()
            raise HTTPException(status_code=500, detail=str(e))

@app.get("/profile")
def get_user_profile(user_id: int = Depends(verify_token)):
    with get_db_connection() as connection:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT id, email, first_name, last_name, created_at FROM users WHERE id = %s", (user_id,))
        user = cursor.fetchone()
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        return {"user": user}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
