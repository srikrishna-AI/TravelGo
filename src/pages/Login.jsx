import React, { useState } from "react";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, v));

    const res = await fetch("http://localhost:8000/login", { method: "POST", body: formData });

    if (res.ok) setMessage("Login successful!");
    else {
      const err = await res.json().catch(() => ({}));
      setMessage(err.detail || "Login failed.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 dark:bg-gray-900 relative overflow-auto" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0"></div>
      <form onSubmit={handleSubmit} className="relative z-10 p-8 flex flex-col gap-2 max-w-md w-full mx-auto bg-gray-900/90 rounded-2xl shadow-2xl border border-gray-800 mt-10 animate-fadeIn">
        <h2 className="text-2xl font-bold mb-2 text-white">Login</h2>
        <input name="email" placeholder="Email" onChange={handleChange} required className="border border-gray-700 bg-gray-800 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required className="border border-gray-700 bg-gray-800 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <button type="submit" className="bg-gradient-to-r from-blue-700 to-sky-500 text-white rounded py-2 mt-2 font-semibold shadow hover:scale-105 transition-all" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        <div className="text-sm text-center mt-2 text-sky-400">{message}</div>
      </form>
    </div>
  );
};

export default Login;
