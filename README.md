# TravelGo Frontend (React + Tailwind)

This is the modern frontend for TravelGo, a real-time travel booking platform.

## Tech Stack
- React (Vite)
- Tailwind CSS
- React Router
- Connects to Python FastAPI backend

## Available Pages
- Landing
- Search
- Login
- Register
- Dashboard
- Booking

## Development
1. Install dependencies:
   ```sh
   npm install
   ```
2. Start the dev server:
   ```sh
   npm run dev
   ```
3. The app will run at http://localhost:5173

## Backend
- Make sure your FastAPI backend is running (default: http://localhost:8000)
- Update API URLs in the frontend as needed for integration.

## Styling
- All styles use Tailwind CSS utility classes.

---

Replace placeholder content in each page with your actual UI and logic.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
