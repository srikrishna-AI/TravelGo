
#!/usr/bin/env python3
"""
TravelGo Application Startup Script
This script sets up the database and starts both backend and frontend servers
"""

import subprocess
import sys
import os
import time
from pathlib import Path

def run_command(command, cwd=None):
    """Run a shell command"""
    try:
        result = subprocess.run(command, shell=True, cwd=cwd, check=True, 
                              capture_output=True, text=True)
        return result.stdout
    except subprocess.CalledProcessError as e:
        print(f"Error running command: {command}")
        print(f"Exit code: {e.returncode}")
        print(f"Error output: {e.stderr}")
        return None

def check_dependencies():
    """Check if required dependencies are installed"""
    print("Checking dependencies...")
    
    # Check Python
    try:
        import sys
        print(f"✓ Python {sys.version}")
    except:
        print("✗ Python not found")
        return False
    
    # Check Node.js
    result = run_command("node --version")
    if result:
        print(f"✓ Node.js {result.strip()}")
    else:
        print("✗ Node.js not found")
        return False
    
    # Check MySQL
    result = run_command("mysql --version")
    if result:
        print(f"✓ MySQL available")
    else:
        print("✗ MySQL not found")
        return False
    
    return True

def setup_backend():
    """Set up the backend"""
    print("\nSetting up backend...")
    
    # Install Python dependencies
    print("Installing Python dependencies...")
    result = run_command("pip install -r requirements.txt", cwd="backend")
    if not result:
        print("Failed to install Python dependencies")
        return False
    
    # Set up database
    print("Setting up database...")
    result = run_command("python3 database.py", cwd="backend")
    if result is not None:
        print("✓ Database setup complete")
    else:
        print("✗ Database setup failed")
        return False
    
    return True

def setup_frontend():
    """Set up the frontend"""
    print("\nSetting up frontend...")
    
    # Install Node.js dependencies
    print("Installing Node.js dependencies...")
    result = run_command("npm install", cwd="frontend")
    if result is not None:
        print("✓ Frontend dependencies installed")
        return True
    else:
        print("✗ Frontend setup failed")
        return False

def start_servers():
    """Start both backend and frontend servers"""
    print("\nStarting servers...")
    
    try:
        # Start backend server
        print("Starting backend server...")
        backend_process = subprocess.Popen(
            ["python3", "main.py"],
            cwd="backend"
        )
        
        # Wait a bit for backend to start
        time.sleep(3)
        
        # Start frontend server
        print("Starting frontend server...")
        frontend_process = subprocess.Popen(
            ["npm", "start"],
            cwd="frontend"
        )
        
        print("\n" + "="*60)
        print("🚀 TravelGo Application Started Successfully!")
        print("="*60)
        print("Backend API: http://localhost:8000")
        print("API Documentation: http://localhost:8000/docs")
        print("Frontend App: http://localhost:3000")
        print("="*60)
        print("\nDemo Account:")
        print("Email: demo@travelgo.com")
        print("Password: password123")
        print("="*60)
        print("\nPress Ctrl+C to stop both servers")
        
        # Wait for processes
        try:
            backend_process.wait()
            frontend_process.wait()
        except KeyboardInterrupt:
            print("\nShutting down servers...")
            backend_process.terminate()
            frontend_process.terminate()
            backend_process.wait()
            frontend_process.wait()
            print("Servers stopped.")
            
    except Exception as e:
        print(f"Error starting servers: {e}")
        return False

def main():
    """Main function"""
    print("TravelGo Application Setup")
    print("=" * 40)
    
    # Check dependencies
    if not check_dependencies():
        print("\nPlease install the required dependencies and try again.")
        sys.exit(1)
    
    # Setup backend
    if not setup_backend():
        print("\nBackend setup failed.")
        sys.exit(1)
    
    # Setup frontend
    if not setup_frontend():
        print("\nFrontend setup failed.")
        sys.exit(1)
    
    # Start servers
    start_servers()

if __name__ == "__main__":
    main()
