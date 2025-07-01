import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const glass =
  "bg-white/20 backdrop-blur-md rounded-xl shadow-lg border border-white/30 p-6 mb-6 flex flex-col items-center transition hover:scale-105 hover:bg-white/30";

export default function Menu() {
  const [destinations, setDestinations] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [buses, setBuses] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");

  // Fetch destinations on mount
  useEffect(() => {
    fetch("/search")
      .then((res) => res.json())
      .then((data) => setDestinations(data.results || []));
  }, []);

  // Poll hotels and buses every 5 seconds when city changes
  useEffect(() => {
    let interval;
    const fetchData = () => {
      if (!selectedCity) return;
      fetch(`/hotels?city=${encodeURIComponent(selectedCity)}`)
        .then((res) => res.json())
        .then((data) => setHotels(data.hotels || []));
      fetch(`/buses?city=${encodeURIComponent(selectedCity)}`)
        .then((res) => res.json())
        .then((data) => setBuses(data.buses || []));
    };
    fetchData();
    if (selectedCity) {
      interval = setInterval(fetchData, 5000);
    }
    return () => clearInterval(interval);
  }, [selectedCity]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-300 to-pink-200 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-white mb-8 drop-shadow-lg">TravelGo Menu</h1>
      <div className="w-full max-w-2xl">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Choose a Destination</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {destinations.map((d) => (
              <button
                key={d.city}
                className={glass + (selectedCity === d.city ? " ring-2 ring-blue-400" : "")}
                onClick={() => setSelectedCity(d.city)}
              >
                <img src={d.image} alt={d.city} className="w-full h-32 object-cover rounded-lg mb-2" />
                <div className="font-bold text-lg text-white">{d.city}</div>
                <div className="text-white/80">From ₹{d.price}</div>
              </button>
            ))}
          </div>
        </div>
        {selectedCity && (
          <>
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-2">Hotels in {selectedCity}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {hotels.length === 0 && <div className="text-white/80">No hotels found.</div>}
                {hotels.map((h) => (
                  <div key={h.name} className={glass}>
                    <img src={h.image} alt={h.name} className="w-full h-24 object-cover rounded mb-2" />
                    <div className="font-bold text-white">{h.name}</div>
                    <div className="text-white/80">From ₹{h.price}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-2">Buses to {selectedCity}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {buses.length === 0 && <div className="text-white/80">No buses found.</div>}
                {buses.map((b, i) => (
                  <div key={b.operator + i} className={glass}>
                    <img src={b.image} alt={b.operator} className="w-full h-24 object-cover rounded mb-2" />
                    <div className="font-bold text-white">{b.operator}</div>
                    <div className="text-white/80">{b.departure} → {b.arrival}</div>
                    <div className="text-white/80">₹{b.price}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        <div className="flex justify-center mt-8">
          <Link to="/" className="text-white underline hover:text-blue-200">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
