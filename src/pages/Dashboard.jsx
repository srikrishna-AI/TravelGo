
import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const travelOptions = [
  {
    id: 1,
    type: "Bus",
    name: "Volvo AC Sleeper",
    image: "https://source.unsplash.com/featured/?bus,travel",
    desc: "Comfortable overnight journey.",
    price: 899,
    from: "Mumbai",
    to: "Goa",
    time: "10:00 PM - 7:00 AM",
  },
  {
    id: 2,
    type: "Hotel",
    name: "Blue Lagoon Resort",
    image: "https://source.unsplash.com/featured/?hotel,resort",
    desc: "Beachside luxury stay.",
    price: 2499,
    location: "Goa",
    rating: 4.5,
  },
  {
    id: 3,
    type: "Bus",
    name: "Sharma Travels",
    image: "https://source.unsplash.com/featured/?bus,road",
    desc: "Daytime scenic route.",
    price: 699,
    from: "Pune",
    to: "Manali",
    time: "7:00 AM - 9:00 PM",
  },
  {
    id: 4,
    type: "Hotel",
    name: "Mountain View Inn",
    image: "https://source.unsplash.com/featured/?mountain,hotel",
    desc: "Cozy rooms with a view.",
    price: 1799,
    location: "Manali",
    rating: 4.2,
  },
];

const Dashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [step, setStep] = useState(1);

  // Modal content for Book, Payment, Confirmation
  const openModal = (option) => {
    setSelectedOption(option);
    setModalType("book");
    setStep(1);
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setModalType("");
    setSelectedOption(null);
    setStep(1);
  };

  const handlePayment = () => {
    setStep(2);
    setTimeout(() => setStep(3), 1200); // Simulate payment
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-white to-gray-100 flex flex-col">
      <Navbar />
      <div className="pt-20 pb-8 px-2 flex-1 flex flex-col items-center">
        <h2 className="text-3xl font-bold text-sky-700 mb-4 font-poppins">Welcome to your Dashboard</h2>
        <p className="text-gray-600 mb-8 text-center max-w-xl">View and book the best travel options, manage your bookings, and enjoy exclusive deals. All in one place!</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
          {travelOptions.map((opt) => (
            <div
              key={opt.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 p-5 flex flex-col items-center border border-gray-100 hover:-translate-y-1 hover:scale-[1.02] cursor-pointer group"
            >
              <img
                src={opt.image}
                alt={opt.name}
                className="w-full h-40 object-cover rounded-xl mb-4 group-hover:scale-105 transition-transform"
              />
              <div className="w-full flex flex-col gap-1">
                <span className="text-xs uppercase tracking-wider text-sky-400 font-semibold">{opt.type}</span>
                <h3 className="text-lg font-bold text-gray-800 font-poppins mb-1">{opt.name}</h3>
                <p className="text-gray-500 text-sm mb-2">{opt.desc}</p>
                {opt.type === "Bus" ? (
                  <>
                    <div className="text-gray-600 text-xs mb-1">{opt.from} → {opt.to}</div>
                    <div className="text-gray-500 text-xs mb-1">{opt.time}</div>
                  </>
                ) : (
                  <>
                    <div className="text-gray-600 text-xs mb-1">{opt.location}</div>
                    <div className="text-yellow-400 text-xs mb-1">★ {opt.rating}</div>
                  </>
                )}
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sky-600 font-bold text-lg">₹{opt.price}</span>
                  <button
                    className="bg-sky-500 hover:bg-sky-600 text-white font-semibold px-4 py-2 rounded-lg shadow hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-sky-300"
                    onClick={() => openModal(opt)}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Dialog */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative animate-fadeIn">
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-sky-500 text-2xl font-bold"
                onClick={closeModal}
                aria-label="Close"
              >
                ×
              </button>
              {modalType === "book" && step === 1 && (
                <div className="flex flex-col items-center">
                  <img src={selectedOption.image} alt={selectedOption.name} className="w-24 h-24 rounded-xl mb-3" />
                  <h3 className="text-xl font-bold mb-2 text-sky-700">Book {selectedOption.name}</h3>
                  <p className="text-gray-600 mb-4">{selectedOption.desc}</p>
                  <div className="mb-4 text-lg font-semibold text-sky-600">Amount: ₹{selectedOption.price}</div>
                  <button
                    className="bg-gradient-to-r from-sky-400 to-sky-600 text-white px-6 py-2 rounded-lg shadow hover:shadow-xl hover:scale-105 transition-all font-semibold"
                    onClick={handlePayment}
                  >
                    Proceed to Payment
                  </button>
                </div>
              )}
              {modalType === "book" && step === 2 && (
                <div className="flex flex-col items-center">
                  <div className="loader mb-4"></div>
                  <div className="text-sky-600 font-semibold">Processing Payment...</div>
                </div>
              )}
              {modalType === "book" && step === 3 && (
                <div className="flex flex-col items-center">
                  <svg className="w-16 h-16 text-green-500 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M8 12l2 2l4-4" stroke="currentColor" strokeWidth="2" fill="none"/></svg>
                  <h3 className="text-xl font-bold mb-2 text-green-600">Booking Confirmed!</h3>
                  <div className="text-gray-600 mb-2">Your booking for <span className="font-semibold">{selectedOption.name}</span> is successful.</div>
                  <button
                    className="mt-2 bg-sky-500 hover:bg-sky-600 text-white font-semibold px-4 py-2 rounded-lg shadow hover:shadow-lg transition-all"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
