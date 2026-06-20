import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SectionSpinner } from "../components/Spinner";
import { useAuth } from "../context/AuthContext";
import api from "../api";
import {
  CalendarDays,
  MapPin,
  Clock,
  LogIn,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import rccgLogo from "../assets/download (1).jpg";
import yayaLogo from "../assets/yaya.png";

const LandingPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/events")
      .then((res) => setEvents(res.data))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (dateStr) => {
    return new Date(dateStr.slice(0, 10) + "T12:00:00").toLocaleDateString(
      "en-US",
      {
        weekday: "short",
        year: "numeric",
        month: "long",
        day: "numeric",
      },
    );
  };

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

      {/* Hero */}
      <section className="text-center px-6 py-16">
        <span className="inline-block bg-orange-100 text-[#ff9324] text-xs font-semibold px-3 py-1 rounded-full mb-4 tracking-wide uppercase">
          Upcoming Events
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
          Discover & Register
          <br />
          <span className="text-[#ff9324]">for Amazing Events</span>
        </h1>
        <p className="text-gray-500 mt-4 text-base max-w-xl mx-auto">
          Browse all upcoming events and secure your spot in seconds.
        </p>
      </section>

      {/* Events Grid */}
      <section className="px-6 pb-16 max-w-6xl mx-auto">
        {loading ? (
          <SectionSpinner label="Loading events…" />
        ) : events.length === 0 ? (
          <div className="text-center py-20">
            <CalendarDays size={48} className="text-orange-200 mx-auto mb-4" />
            <p className="text-gray-400 text-sm">
              No events available yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event._id}
                className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col"
              >
                {event.image ? (
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-44 object-cover"
                  />
                ) : (
                  <div className="w-full h-44 bg-linear-to-br from-orange-100 to-amber-100 flex items-center justify-center">
                    <CalendarDays
                      size={40}
                      className="text-[#ff9324] opacity-60"
                    />
                  </div>
                )}
                <div className="p-5 flex flex-col flex-1">
                  <h2 className="text-lg font-bold text-gray-900 mb-2">
                    {event.title}
                  </h2>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                    {event.description}
                  </p>
                  <div className="space-y-1.5 mb-5">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <CalendarDays size={13} className="text-[#ff9324]" />
                      {formatDate(event.date)}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock size={13} className="text-[#ff9324]" />
                      {event.time}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <MapPin size={13} className="text-[#ff9324]" />
                      {event.location}
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      navigate(
                        `/register?eventId=${event._id}&title=${encodeURIComponent(event.title)}`,
                      )
                    }
                    className="mt-auto w-full bg-[#ff9324] hover:bg-orange-500 active:scale-95 text-white text-sm font-bold py-2.5 rounded-xl transition-all shadow-sm shadow-orange-200"
                  >
                    Register Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default LandingPage;
