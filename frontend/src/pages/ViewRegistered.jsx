import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import api from "../api";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import rccgLogo from "../assets/download (1).jpg";
import yayaLogo from "../assets/yaya.png";
import {
  ArrowLeft,
  Users,
  Mail,
  Phone,
  User,
  Trash2,
  CheckCircle2,
  Circle,
  Search,
  LogOut,
} from "lucide-react";

const ViewRegistered = () => {
  const [registrants, setRegistrants] = useState([]);
  const [eventTitle, setEventTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);
  const [search, setSearch] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const eventId = searchParams.get("eventId");
  const titleParam = searchParams.get("title");

  useEffect(() => {
    if (!eventId) return;
    api
      .get(`/registrations/${eventId}`)
      .then((res) => {
        setRegistrants(res.data.registrants);
        setEventTitle(
          res.data.event || decodeURIComponent(titleParam || "Event"),
        );
      })
      .catch(() => toast.error("Failed to load registrants"))
      .finally(() => setLoading(false));
  }, [eventId]);

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this registrant?")) return;
    setDeletingId(id);
    try {
      await api.delete(`/registrations/${id}`);
      setRegistrants((prev) => prev.filter((r) => r._id !== id));
      toast.success("Registrant removed");
    } catch {
      toast.error("Failed to remove registrant");
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleAttend = async (id) => {
    setTogglingId(id);
    try {
      const res = await api.patch(`/registrations/${id}/attend`);
      setRegistrants((prev) =>
        prev.map((r) =>
          r._id === id ? { ...r, attended: res.data.attended } : r,
        ),
      );
      toast.success(
        res.data.attended ? "Marked as attended" : "Marked as not attended",
      );
    } catch {
      toast.error("Failed to update attendance");
    } finally {
      setTogglingId(null);
    }
  };

  const filtered = registrants.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-orange-100 px-6 py-3 flex items-center justify-between">
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
            onClick={() => navigate("/dashboard")}
            className="text-sm text-gray-500 hover:text-gray-700 transition"
          >
            Dashboard
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

      <div className="px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#ff9324] mb-6 transition"
          >
            <ArrowLeft size={15} /> Back to Dashboard
          </Link>

          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-[#ff9324] flex items-center justify-center shadow-md shadow-orange-200">
              <Users size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Registrants</h1>
              <p className="text-[#ff9324] font-semibold text-sm">
                {eventTitle}
              </p>
            </div>
            {!loading && (
              <span className="ml-auto bg-orange-100 text-[#ff9324] text-sm font-bold px-3 py-1 rounded-full">
                {registrants.length} registered
              </span>
            )}
          </div>

          {/* Search Bar */}
          {!loading && registrants.length > 0 && (
            <div className="relative mb-6">
              <Search
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff9324] focus:border-transparent transition"
              />
            </div>
          )}

          {loading ? (
            <div className="text-center py-20 text-gray-400 text-sm">
              Loading registrants...
            </div>
          ) : registrants.length === 0 ? (
            <div className="text-center py-20">
              <Users size={48} className="text-orange-200 mx-auto mb-4" />
              <p className="text-gray-400 text-sm">
                No one has registered for this event yet.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-6 gap-3 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                <span className="flex items-center gap-1.5">
                  <User size={12} /> Name
                </span>
                <span className="flex items-center gap-1.5">
                  <Mail size={12} /> Email
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone size={12} /> Phone
                </span>
                <span>Registered</span>
                <span>Attended</span>
                <span></span>
              </div>
              {/* Rows */}
              {filtered.length === 0 ? (
                <div className="text-center py-10 text-gray-400 text-sm">
                  No results match your search.
                </div>
              ) : (
                filtered.map((r, i) => (
                  <div
                    key={r._id}
                    className={`grid grid-cols-6 gap-3 px-6 py-4 text-sm text-gray-700 items-center border-b border-gray-100 last:border-0 ${
                      i % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                    }`}
                  >
                    <span className="font-medium truncate">{r.name}</span>
                    <span className="text-gray-500 truncate">{r.email}</span>
                    <span className="text-gray-500">
                      {r.phone || <span className="text-gray-300">—</span>}
                    </span>
                    <span className="text-gray-400 text-xs">
                      {new Date(r.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <div>
                      <button
                        onClick={() => handleToggleAttend(r._id)}
                        disabled={togglingId === r._id}
                        className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition disabled:opacity-50 ${
                          r.attended
                            ? "bg-green-50 text-green-600 border-green-200 hover:bg-green-100"
                            : "bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        {r.attended ? (
                          <CheckCircle2 size={13} />
                        ) : (
                          <Circle size={13} />
                        )}
                        {r.attended ? "Attended" : "Mark"}
                      </button>
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleDelete(r._id)}
                        disabled={deletingId === r._id}
                        className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 border border-red-100 hover:border-red-300 px-2.5 py-1.5 rounded-lg transition disabled:opacity-50"
                      >
                        <Trash2 size={13} />
                        {deletingId === r._id ? "Removing..." : "Remove"}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewRegistered;
