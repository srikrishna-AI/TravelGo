from fastapi import FastAPI, Request, Form, Depends, HTTPException, BackgroundTasks
from fastapi.responses import JSONResponse, FileResponse
from fastapi.exceptions import RequestValidationError as FastAPIRequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from utils.indian_cities import INDIAN_CITIES
from database.connection import get_db, Base, engine
from models.user import User
from passlib.hash import bcrypt
from sqlalchemy.orm import Session
import os
from dotenv import load_dotenv
import logging

load_dotenv()

app = FastAPI()

# Set up logging
logging.basicConfig(level=logging.INFO)

# CORS for frontend-backend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Set to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve static files (logo, favicon, etc.)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Serve favicon.ico at /favicon.ico
@app.get("/favicon.ico")
async def favicon():
    return FileResponse("static/favicon.ico")

# Create tables
Base.metadata.create_all(bind=engine)

# Updated mock destinations with more places and images
MOCK_DESTINATIONS = [
    {"city": "Goa", "price": 4500, "image": "https://source.unsplash.com/featured/?goa,beach"},
    {"city": "Manali", "price": 5200, "image": "https://source.unsplash.com/featured/?manali,mountains"},
    {"city": "Jaipur", "price": 3900, "image": "https://source.unsplash.com/featured/?jaipur,fort"},
    {"city": "Kerala", "price": 4800, "image": "https://source.unsplash.com/featured/?kerala,backwaters"},
    {"city": "Delhi", "price": 3500, "image": "https://source.unsplash.com/featured/?delhi,monument"},
    {"city": "Mumbai", "price": 4100, "image": "https://source.unsplash.com/featured/?mumbai,city"}
]

# Updated mock hotels for each city with Unsplash images
MOCK_HOTELS = {
    "Goa": [
        {"name": "Goa Beach Resort", "price": 3200, "image": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"},
        {"name": "Sunset Inn Goa", "price": 2800, "image": "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80"}
    ],
    "Manali": [
        {"name": "Manali Mountain Lodge", "price": 4100, "image": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"},
        {"name": "Snow Valley Resort", "price": 3500, "image": "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80"}
    ],
    "Jaipur": [
        {"name": "Jaipur Palace Hotel", "price": 2900, "image": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"},
        {"name": "Pink City Inn", "price": 2600, "image": "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80"}
    ],
    "Delhi": [
        {"name": "Delhi Grand", "price": 3700, "image": "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80"},
        {"name": "Monument View Inn", "price": 3200, "image": "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=600&q=80"}
    ]
}

# Updated mock buses for each city with Unsplash images
MOCK_BUSES = {
    "Goa": [
        {"operator": "Goa Express", "departure": "08:00", "arrival": "16:00", "price": 1200, "image": "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80"},
        {"operator": "Beachline Travels", "departure": "14:00", "arrival": "22:00", "price": 1100, "image": "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=600&q=80"}
    ],
    "Manali": [
        {"operator": "Himalayan Buses", "departure": "07:30", "arrival": "18:00", "price": 1500, "image": "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80"},
        {"operator": "Snow Route", "departure": "13:00", "arrival": "23:00", "price": 1400, "image": "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=600&q=80"}
    ],
    "Jaipur": [
        {"operator": "Royal Rajasthan", "departure": "09:00", "arrival": "17:00", "price": 1000, "image": "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80"},
        {"operator": "Pink City Travels", "departure": "15:00", "arrival": "23:00", "price": 950, "image": "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=600&q=80"}
    ],
    "Delhi": [
        {"operator": "Capital Express", "departure": "06:00", "arrival": "14:00", "price": 900, "image": "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80"},
        {"operator": "Monumental Travels", "departure": "12:00", "arrival": "20:00", "price": 850, "image": "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=600&q=80"}
    ]
}

@app.get("/suggest_cities")
async def suggest_cities(query: str = ""):
    query = query.strip().lower()
    if not query:
        return []
    suggestions = [city for city in INDIAN_CITIES if query in city.lower()]
    return suggestions[:8]

@app.post("/register")
async def register(
    email: str = Form(...),
    password: str = Form(...),
    first_name: str = Form(...),
    last_name: str = Form(...),
    db: Session = Depends(get_db)
):
    logging.info(f"Register attempt: {email}, {first_name} {last_name}")
    # Check if user already exists
    user = db.query(User).filter(User.email == email).first()
    if user:
        logging.warning("Email already registered.")
        raise HTTPException(status_code=400, detail="Email already registered.")
    # Hash the password
    hashed_password = bcrypt.hash(password)
    # Create new user
    new_user = User(
        email=email,
        first_name=first_name,
        last_name=last_name,
        hashed_password=hashed_password,
        is_active=True,
        is_admin=False
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    logging.info("Registration successful.")
    return {"message": "Registration successful!", "first_name": new_user.first_name}

@app.post("/login")
async def login(
    email: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == email).first()
    if not user or not bcrypt.verify(password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    return {"message": "Login successful!", "first_name": user.first_name, "email": user.email}

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.get("/", include_in_schema=False)
async def root():
    return FileResponse("static/index.html")

@app.get("/search")
async def search(from_city: str = "", to_city: str = ""):
    logging.info(f"Search request: from={from_city}, to={to_city}")
    results = [d for d in MOCK_DESTINATIONS if to_city.lower() in d["city"].lower()] if to_city else MOCK_DESTINATIONS
    logging.info(f"Search results: {results}")
    return {"results": results}

@app.get("/bookings")
async def get_bookings(email: str):
    # TODO: Replace with real DB query
    mock_bookings = [
        {"destination": "Goa", "date": "2025-07-01", "passengers": 2, "price": 4500},
        {"destination": "Manali", "date": "2025-08-15", "passengers": 1, "price": 5200},
    ]
    return {"bookings": mock_bookings}

def send_booking_email(email: str, booking: dict):
    try:
        logging.info(f"Sending booking email to {email} for booking: {booking}")
        # Here you would use smtplib or yagmail to send a real email
    except Exception as e:
        logging.error(f"Failed to send booking email: {e}")

@app.post("/book")
async def book(
    background_tasks: BackgroundTasks,
    email: str = Form(...),
    destination: str = Form(...),
    price: int = Form(...),
):
    logging.info(f"Booking request: {email}, {destination}, {price}")
    booking = {"destination": destination, "price": price}
    background_tasks.add_task(send_booking_email, email, booking)
    logging.info("Booking successful, email task added.")
    return {"message": "Booking successful! Confirmation email sent.", "booking": booking}

@app.get("/hotels")
async def get_hotels(city: str = ""):
    city = city.strip().title()
    hotels = MOCK_HOTELS.get(city, [])
    return {"hotels": hotels}

@app.get("/buses")
async def get_buses(city: str = ""):
    city = city.strip().title()
    buses = MOCK_BUSES.get(city, [])
    return {"buses": buses}

@app.exception_handler(404)
async def not_found_handler(request, exc):
    return JSONResponse(status_code=404, content={"detail": "Resource not found"})

@app.exception_handler(FastAPIRequestValidationError)
async def validation_exception_handler(request, exc):
    return JSONResponse(status_code=422, content={"detail": exc.errors()})