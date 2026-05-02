import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api";
import toast from "react-hot-toast";
import {
  CalendarDays,
  MapPin,
  Clock,
  Plus,
  Pencil,
  Trash2,
  Users,
  LogOut,
} from "lucide-react";
import rccgLogo from "../assets/download (1).jpg";
import yayaLogo from "../assets/yaya.png";

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const fetchEvents = () => {
    api
      .get("/events")
      .then((res) => setEvents(res.data))
      .catch(() => toast.error("Failed to load events"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    setDeletingId(id);
    try {
      await api.delete(`/events/${id}`);
      toast.success("Event deleted");
      setEvents((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "long",
      day: "numeric",
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
          <span className="ml-2 text-xs bg-orange-100 text-[#ff9324] font-semibold px-2 py-0.5 rounded-full">
            Admin
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 hidden sm:block">
            Hi, {user?.name}
          </span>
          <button
            onClick={() => navigate("/")}
            className="text-sm text-gray-500 hover:text-gray-700 transition"
          >
            View Site
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

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Events</h1>
            <p className="text-gray-500 text-sm mt-0.5">
              {events.length} event{events.length !== 1 ? "s" : ""} total
            </p>
          </div>
          <button
            onClick={() => navigate("/create-event")}
            className="flex items-center gap-2 bg-[#ff9324] hover:bg-orange-500 active:scale-95 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition shadow-md shadow-orange-200"
          >
            <Plus size={16} /> Create Event
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400 text-sm">
            Loading events...
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20">
            <CalendarDays size={48} className="text-orange-200 mx-auto mb-4" />
            <p className="text-gray-400 text-sm">
              No events yet. Create your first one!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {events.map((event) => (
              <div
                key={event._id}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
              >
                {event.image ? (
                  <img
                    src={`http://localhost:5000/${event.image}`}
                    alt={event.title}
                    className="w-full h-40 object-cover"
                  />
                ) : (
                  <div className="w-full h-40 bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
                    <CalendarDays
                      size={36}
                      className="text-[#ff9324] opacity-50"
                    />
                  </div>
                )}
                <div className="p-5 flex flex-col flex-1">
                  <h2 className="font-bold text-gray-900 text-base mb-1">
                    {event.title}
                  </h2>
                  <p className="text-gray-500 text-xs line-clamp-2 mb-3">
                    {event.description}
                  </p>
                  <div className="space-y-1 mb-4">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <CalendarDays size={12} className="text-[#ff9324]" />
                      {formatDate(event.date)}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Clock size={12} className="text-[#ff9324]" />
                      {event.time}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <MapPin size={12} className="text-[#ff9324]" />
                      {event.location}
                    </div>
                  </div>
                  <div className="mt-auto flex gap-2">
                    <button
                      onClick={() =>
                        navigate(
                          `/view-registered?eventId=${event._id}&title=${encodeURIComponent(event.title)}`,
                        )
                      }
                      className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold border border-gray-200 text-gray-600 py-2 rounded-xl hover:bg-gray-50 transition"
                    >
                      <Users size={13} /> Registrants
                    </button>
                    <button
                      onClick={() => navigate(`/edit-event/${event._id}`)}
                      className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold border border-blue-100 text-blue-600 py-2 rounded-xl hover:bg-blue-50 transition"
                    >
                      <Pencil size={13} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(event._id)}
                      disabled={deletingId === event._id}
                      className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold border border-red-100 text-red-500 py-2 rounded-xl hover:bg-red-50 transition disabled:opacity-50"
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
