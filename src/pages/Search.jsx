import React, { useState } from "react";

const glass =
  "bg-white/20 backdrop-blur-md rounded-xl shadow-lg border border-white/30 p-6 mb-6 flex flex-col items-center transition hover:scale-105 hover:bg-white/30";

export default function Search() {
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [date, setDate] = useState("");
  const [buses, setBuses] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearched(true);
    setBuses([]);
    setHotels([]);
    if (!toCity) return;
    // Fetch buses
    const busRes = await fetch(`/buses?city=${encodeURIComponent(toCity)}`);
    const busData = await busRes.json();
    setBuses(busData.buses || []);
    // Fetch hotels
    const hotelRes = await fetch(`/hotels?city=${encodeURIComponent(toCity)}`);
    const hotelData = await hotelRes.json();
    setHotels(hotelData.hotels || []);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-300 to-pink-200 flex flex-col items-center justify-center p-4">
      <form
        onSubmit={handleSearch}
        className="w-full max-w-md bg-white/30 backdrop-blur-md rounded-xl shadow-lg border border-white/30 p-6 mb-8 flex flex-col gap-4"
      >
        <h2 className="text-2xl font-bold text-white mb-2">
          Search Your Trip
        </h2>
        <input
          type="text"
          placeholder="From City"
          value={fromCity}
          onChange={(e) => setFromCity(e.target.value)}
          className="rounded p-2 border border-gray-300 focus:outline-none"
          required
        />
        <input
          type="text"
          placeholder="To City"
          value={toCity}
          onChange={(e) => setToCity(e.target.value)}
          className="rounded p-2 border border-gray-300 focus:outline-none"
          required
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded p-2 border border-gray-300 focus:outline-none"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white rounded p-2 font-semibold hover:bg-blue-600 transition"
        >
          Search
        </button>
      </form>
      {searched && (
        <div className="w-full max-w-2xl">
          <h3 className="text-xl font-semibold text-white mb-2">
            Available Buses
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {buses.length === 0 && (
              <div className="text-white/80">No buses found.</div>
            )}
            {buses.map((b, i) => (
              <div key={b.operator + i} className={glass}>
                <img
                  src={b.image}
                  alt={b.operator}
                  className="w-full h-24 object-cover rounded mb-2"
                />
                <div className="font-bold text-white">{b.operator}</div>
                <div className="text-white/80">
                  {b.departure} → {b.arrival}
                </div>
                <div className="text-white/80">₹{b.price}</div>
              </div>
            ))}
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Hotels in {toCity}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {hotels.length === 0 && (
              <div className="text-white/80">No hotels found.</div>
            )}
            {hotels.map((h) => (
              <div key={h.name} className={glass}>
                <img
                  src={h.image}
                  alt={h.name}
                  className="w-full h-24 object-cover rounded mb-2"
                />
                <div className="font-bold text-white">{h.name}</div>
                <div className="text-white/80">From ₹{h.price}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
