import React, { useState } from "react";

const featuredDestinations = [
  { name: "Goa", image: "https://source.unsplash.com/featured/?goa,beach", description: "Sun, sand, and sea!" },
  { name: "Manali", image: "https://source.unsplash.com/featured/?manali,mountains", description: "Snowy peaks and adventure." },
  { name: "Jaipur", image: "https://source.unsplash.com/featured/?jaipur,fort", description: "Royal palaces and vibrant culture." },
];

const classes = ["Economy", "Premium Economy", "Business", "First"];

const Landing = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [date, setDate] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [travelClass, setTravelClass] = useState(classes[0]);
  const [loading, setLoading] = useState(false);

  // Debounced fetch for city suggestions
  const fetchSuggestions = async (query, setSuggestions) => {
    if (!query) return setSuggestions([]);
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/suggest_cities?query=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        setSuggestions(data);
      }
    } catch {}
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-8 bg-gradient-to-br from-sky-900 via-blue-800 to-gray-900">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center">
        <img src="/logo.svg" alt="TravelGo Logo" className="w-16 mb-2" />
        <h1 className="text-3xl font-bold text-blue-900 mb-1">TravelGo</h1>
        <p className="text-blue-700 mb-6">Book flights, hotels, and more in real time</p>
        <form className="w-full flex flex-col gap-3">
          <div className="relative">
            <input
              className="w-full border rounded px-3 py-2"
              placeholder="From (city or airport)"
              value={from}
              onChange={e => {
                setFrom(e.target.value);
                fetchSuggestions(e.target.value, setFromSuggestions);
              }}
              autoComplete="off"
            />
            {fromSuggestions.length > 0 && (
              <div className="absolute z-10 bg-white border w-full rounded shadow mt-1">
                {fromSuggestions.map((s, i) => (
                  <div key={i} className="px-3 py-2 hover:bg-blue-100 cursor-pointer" onClick={() => { setFrom(s); setFromSuggestions([]); }}>{s}</div>
                ))}
              </div>
            )}
          </div>
          <div className="relative">
            <input
              className="w-full border rounded px-3 py-2"
              placeholder="To (city or airport)"
              value={to}
              onChange={e => {
                setTo(e.target.value);
                fetchSuggestions(e.target.value, setToSuggestions);
              }}
              autoComplete="off"
            />
            {toSuggestions.length > 0 && (
              <div className="absolute z-10 bg-white border w-full rounded shadow mt-1">
                {toSuggestions.map((s, i) => (
                  <div key={i} className="px-3 py-2 hover:bg-blue-100 cursor-pointer" onClick={() => { setTo(s); setToSuggestions([]); }}>{s}</div>
                ))}
              </div>
            )}
          </div>
          <input
            type="date"
            className="w-full border rounded px-3 py-2"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
          <div className="flex gap-2">
            <input
              type="number"
              min={1}
              max={9}
              className="w-1/2 border rounded px-3 py-2"
              value={passengers}
              onChange={e => setPassengers(Number(e.target.value))}
              placeholder="Passengers"
            />
            <select
              className="w-1/2 border rounded px-3 py-2"
              value={travelClass}
              onChange={e => setTravelClass(e.target.value)}
            >
              {classes.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <button type="submit" className="mt-2 bg-blue-700 text-white font-bold py-2 rounded hover:bg-blue-800 transition">{loading ? "Loading..." : "Search"}</button>
        </form>
        <div className="mt-8 w-full">
          <h2 className="text-lg font-semibold mb-2 text-blue-900">Featured Destinations</h2>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {featuredDestinations.map(dest => (
              <div key={dest.name} className="min-w-[160px] bg-blue-50 rounded-lg shadow p-2 flex-shrink-0">
                <img src={dest.image} alt={dest.name} className="rounded w-full h-24 object-cover mb-1" />
                <div className="font-bold text-blue-800">{dest.name}</div>
                <div className="text-xs text-blue-600">{dest.description}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6 text-sm text-blue-700">
          <a href="/login" className="underline mr-2">Login</a>
          <a href="/register" className="underline">Register</a>
        </div>
      </div>
    </div>
  );
};

export default Landing;
