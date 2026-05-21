import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SectionSpinner } from "../components/Spinner";
import { useAuth } from "../context/AuthContext";
import api from "../api";
import toast from "react-hot-toast";
import {
  Mic2,
  LogOut,
  ArrowLeft,
  Eye,
  Phone,
  User,
  Search,
  CalendarDays,
} from "lucide-react";
import rccgLogo from "../assets/download (1).jpg";
import yayaLogo from "../assets/yaya.png";

const AdminSpeakerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/speaker-bookings")
      .then((res) => setBookings(res.data))
      .catch(() => toast.error("Failed to load speaker bookings"))
      .finally(() => setLoading(false));
  }, []);

  const handleViewReceipt = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const filtered = bookings.filter((b) => {
    const q = search.toLowerCase();
    return (
      b.name?.toLowerCase().includes(q) ||
      b.phone?.toLowerCase().includes(q) ||
      b.event?.title?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <img
            src={rccgLogo}
            alt="RCCG"
            className="w-9 h-9 rounded-full object-cover"
          />
          <img
            src={yayaLogo}
            alt="YaYa"
            className="w-9 h-9 rounded-full object-cover"
          />
          <span className="text-lg font-bold text-gray-900 tracking-tight">
            LHP-YAYA
          </span>
          <span className="ml-2 text-xs bg-orange-100 text-primary font-semibold px-2 py-0.5 rounded-full">
            Admin
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 hidden sm:block">
            Hi, {user?.name}
          </span>
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition"
          >
            <ArrowLeft size={14} /> Dashboard
          </button>
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="flex items-center gap-1.5 text-sm text-red-500 border border-red-200 px-3 py-1.5 rounded-xl hover:bg-red-50 transition"
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Mic2 size={22} className="text-primary" />
              <h1 className="text-2xl font-bold text-gray-900">
                Speaker Session Bookings
              </h1>
            </div>
            <p className="text-gray-500 text-sm">
              {bookings.length} booking{bookings.length !== 1 ? "s" : ""} —
              One-on-one with the CEO of Pioneer Airline
            </p>
          </div>
          {/* Search */}
          <div className="relative">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, phone or event..."
              className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 w-64"
            />
          </div>
        </div>

        {loading ? (
          <SectionSpinner label="Loading bookings…" />
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Mic2 size={48} className="text-orange-200 mx-auto mb-4" />
            <p className="text-gray-400 text-sm">
              {search ? "No results found." : "No bookings yet."}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Table header */}
            <div className="hidden md:grid grid-cols-[1fr_1fr_1fr_auto] gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <span>Participant Name</span>
              <span>Phone Number</span>
              <span>Event</span>
              <span>Receipt</span>
            </div>

            <div className="divide-y divide-gray-100">
              {filtered.map((booking) => (
                <div
                  key={booking._id}
                  className="px-6 py-4 flex flex-col md:grid md:grid-cols-[1fr_1fr_1fr_auto] gap-4 items-start md:items-center"
                >
                  {/* Name */}
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                      <User size={14} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        {booking.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(booking.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center gap-1.5">
                    <Phone size={13} className="text-gray-400 shrink-0" />
                    <span className="text-sm text-gray-700 font-medium">
                      {booking.phone}
                    </span>
                  </div>

                  {/* Event */}
                  <div>
                    <span className="text-xs text-gray-400 block md:hidden font-semibold uppercase mb-0.5">
                      Event
                    </span>
                    <div className="flex items-center gap-1.5">
                      <CalendarDays
                        size={13}
                        className="text-gray-400 shrink-0"
                      />
                      <p className="text-sm text-gray-700 font-medium">
                        {booking.event?.title || "—"}
                      </p>
                    </div>
                  </div>

                  {/* View Receipt button */}
                  <div>
                    <button
                      onClick={() => handleViewReceipt(booking.paymentEvidence)}
                      className="flex items-center gap-1.5 text-xs font-semibold border border-blue-100 text-blue-600 px-4 py-2 rounded-xl hover:bg-blue-50 transition whitespace-nowrap"
                    >
                      <Eye size={13} /> View Receipt
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSpeakerBookings;
