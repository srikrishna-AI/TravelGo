
import mysql.connector
from mysql.connector import Error
import bcrypt
from datetime import datetime, timedelta

# Database configuration
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': 'password',
}

def create_database():
    try:
        connection = mysql.connector.connect(**{k: v for k, v in DB_CONFIG.items() if k != 'database'})
        cursor = connection.cursor()
        
        # Create database
        cursor.execute("CREATE DATABASE IF NOT EXISTS travelgo")
        cursor.execute("USE travelgo")
        
        # Create users table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                first_name VARCHAR(100) NOT NULL,
                last_name VARCHAR(100) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Create services table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS services (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                service_type ENUM('bus', 'hotel') NOT NULL,
                location VARCHAR(255) NOT NULL,
                destination VARCHAR(255),
                price DECIMAL(10, 2) NOT NULL,
                available_seats INT NOT NULL,
                description TEXT,
                amenities JSON,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Create bookings table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS bookings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                service_id INT NOT NULL,
                booking_date DATE NOT NULL,
                passengers INT DEFAULT 1,
                status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id),
                FOREIGN KEY (service_id) REFERENCES services(id)
            )
        """)
        
        connection.commit()
        print("Database and tables created successfully!")
        
        # Insert sample data
        insert_sample_data(cursor, connection)
        
    except Error as e:
        print(f"Error: {e}")
    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()

def insert_sample_data(cursor, connection):
    # Sample bus services
    bus_services = [
        ("Express Bus Service", "bus", "New York", "Boston", 45.00, 40, "Comfortable express bus service", '["WiFi", "AC", "Reclining Seats"]'),
        ("City Connect Bus", "bus", "Los Angeles", "San Francisco", 65.00, 35, "Premium city connector", '["WiFi", "AC", "Entertainment System"]'),
        ("Metro Bus Line", "bus", "Chicago", "Detroit", 35.00, 50, "Affordable metro bus service", '["AC", "Comfortable Seats"]'),
        ("Luxury Coach", "bus", "Miami", "Orlando", 55.00, 30, "Luxury coach service", '["WiFi", "AC", "Reclining Seats", "Snacks"]'),
    ]
    
    # Sample hotel services
    hotel_services = [
        ("Grand Hotel", "hotel", "New York", None, 150.00, 25, "Luxury hotel in downtown", '["WiFi", "Pool", "Gym", "Restaurant"]'),
        ("Budget Inn", "hotel", "Los Angeles", None, 80.00, 40, "Affordable accommodation", '["WiFi", "Parking", "Breakfast"]'),
        ("Business Hotel", "hotel", "Chicago", None, 120.00, 30, "Perfect for business travelers", '["WiFi", "Conference Room", "Gym"]'),
        ("Beach Resort", "hotel", "Miami", None, 200.00, 20, "Beachfront luxury resort", '["WiFi", "Pool", "Beach Access", "Spa"]'),
    ]
    
    # Insert bus services
    for service in bus_services:
        cursor.execute("""
            INSERT INTO services (name, service_type, location, destination, price, available_seats, description, amenities)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """, service)
    
    # Insert hotel services
    for service in hotel_services:
        cursor.execute("""
            INSERT INTO services (name, service_type, location, destination, price, available_seats, description, amenities)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """, service)
    
    # Create sample user
    hashed_password = bcrypt.hashpw("password123".encode('utf-8'), bcrypt.gensalt())
    cursor.execute("""
        INSERT INTO users (email, password, first_name, last_name)
        VALUES (%s, %s, %s, %s)
    """, ("demo@travelgo.com", hashed_password, "Demo", "User"))
    
    connection.commit()
    print("Sample data inserted successfully!")

if __name__ == "__main__":
    create_database()
