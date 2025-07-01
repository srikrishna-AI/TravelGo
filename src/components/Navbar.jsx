import React from "react";
import { Link } from "react-router-dom";

const navLinks = [
  { name: "Home", to: "/" },
  { name: "Search", to: "/search" },
  { name: "Bookings", to: "/booking" },
  { name: "Profile", to: "/dashboard" },
  { name: "Logout", to: "/login" },
];

const Navbar = () => (
  <nav className="w-full bg-white shadow-md py-3 px-4 flex items-center justify-between fixed top-0 left-0 z-50">
    <div className="flex items-center gap-2">
      <img src="/logo.svg" alt="TravelGo" className="w-8 h-8" />
      <span className="font-bold text-lg text-sky-600 tracking-wide">TravelGo</span>
    </div>
    <div className="flex gap-4">
      {navLinks.map((link) => (
        <Link
          key={link.name}
          to={link.to}
          className="text-gray-700 font-medium hover:text-sky-500 transition-colors px-2 py-1 rounded-md hover:bg-sky-100"
        >
          {link.name}
        </Link>
      ))}
    </div>
  </nav>
);

export default Navbar;
