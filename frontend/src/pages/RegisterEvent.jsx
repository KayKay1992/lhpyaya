import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import api from "../api";
import toast from "react-hot-toast";
import {
  CalendarDays,
  ArrowLeft,
  CheckCircle,
  LogIn,
  LogOut,
  LayoutDashboard,
  Clock,
  MapPin,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import rccgLogo from "../assets/download (1).jpg";
import yayaLogo from "../assets/yaya.png";

const RegisterEvent = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [eventImage, setEventImage] = useState(null);
  const [eventDetails, setEventDetails] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const eventId = searchParams.get("eventId");
  const eventTitle = searchParams.get("title") || "Event";

  useEffect(() => {
    if (eventId) {
      api
        .get(`/events/${eventId}`)
        .then((res) => {
          if (res.data.image) setEventImage(res.data.image);
          setEventDetails({
            date: res.data.date,
            time: res.data.time,
            location: res.data.location,
          });
        })
        .catch(() => {});
    }
  }, [eventId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!eventId) {
      toast.error("Invalid event. Please go back and try again.");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email.trim())) {
      toast.error("Please enter a valid email address.");
      return;
    }

    // Phone validation: 7–15 digits, optional leading +
    const phoneRegex = /^\+?[0-9]{7,15}$/;
    if (!phoneRegex.test(form.phone.trim().replace(/[\s().-]/g, ""))) {
      toast.error("Please enter a valid phone number (7–15 digits).");
      return;
    }

    setLoading(true);
    try {
      await api.post(`/registrations/${eventId}`, form);
      setSuccess(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-orange-50 via-white to-amber-50 px-4">
        <div className="bg-white rounded-3xl shadow-xl border border-orange-100 p-10 max-w-md w-full text-center">
          <div className="flex items-center justify-center mb-5">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle size={36} className="text-green-500" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            You're registered!
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            You have successfully registered for{" "}
            <span className="font-semibold text-gray-800">
              {decodeURIComponent(eventTitle)}
            </span>
            . See you there!
          </p>

          {eventDetails && (
            <div className="bg-orange-50 border border-orange-100 rounded-2xl px-5 py-4 mb-6 text-left space-y-2.5">
              <div className="flex items-center gap-2.5 text-sm text-gray-700">
                <CalendarDays size={15} className="text-[#ff9324] shrink-0" />
                <span>
                  {new Date(eventDetails.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-gray-700">
                <Clock size={15} className="text-[#ff9324] shrink-0" />
                <span>{eventDetails.time}</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-gray-700">
                <MapPin size={15} className="text-[#ff9324] shrink-0" />
                <span>{eventDetails.location}</span>
              </div>
            </div>
          )}
          <button
            onClick={() => navigate("/")}
            className="w-full bg-[#ff9324] hover:bg-orange-500 text-white font-bold py-3 rounded-xl transition shadow-md shadow-orange-200"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 via-white to-amber-50">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-orange-100 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img
            src={rccgLogo}
            alt="RCCG Logo"
            className="w-10 h-10 rounded-full object-cover"
          />
          <img
            src={yayaLogo}
            alt="YaYa Logo"
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="text-lg font-bold text-gray-900 tracking-tight">
            LHP-YAYA
          </span>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {user.role === "admin" && (
                <button
                  onClick={() => navigate("/dashboard")}
                  className="flex items-center gap-2 bg-[#ff9324] text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-orange-500 transition"
                >
                  <LayoutDashboard size={15} /> Dashboard
                </button>
              )}
              {user.role !== "admin" && (
                <span className="text-sm text-gray-500 hidden sm:block">
                  Hello, {user.name}
                </span>
              )}
              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="flex items-center gap-2 border border-gray-200 text-gray-600 text-sm font-semibold px-4 py-2 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition"
              >
                <LogOut size={15} /> Sign Out
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-2 border border-[#ff9324] text-[#ff9324] text-sm font-semibold px-4 py-2 rounded-xl hover:bg-orange-50 transition"
            >
              <LogIn size={15} /> Sign In
            </button>
          )}
        </div>
      </header>

      <div className="flex items-start justify-center px-4 py-10">
        <div className="w-full max-w-md">
          {/* Back */}
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#ff9324] mb-6 transition"
          >
            <ArrowLeft size={15} /> Back to Events
          </Link>

          {/* Event Flyer */}
          {eventImage && (
            <div className="mb-8 rounded-2xl overflow-hidden shadow-lg border border-orange-100">
              <img
                src={eventImage}
                alt={decodeURIComponent(eventTitle)}
                className="w-full object-contain max-h-[480px]"
              />
            </div>
          )}

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#ff9324] shadow-lg mb-4">
              <CalendarDays className="text-white" size={26} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Register for Event
            </h1>
            <p className="text-[#ff9324] font-semibold text-sm mt-1">
              {decodeURIComponent(eventTitle)}
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-orange-100 p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff9324] focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff9324] focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  placeholder="+1 234 567 8900"
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff9324] focus:border-transparent transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#ff9324] hover:bg-orange-500 active:scale-95 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-orange-200 disabled:opacity-60 mt-2"
              >
                {loading ? "Submitting..." : "Confirm Registration"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterEvent;
