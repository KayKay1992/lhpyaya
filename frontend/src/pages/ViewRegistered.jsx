import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../api";
import toast from "react-hot-toast";
import { ArrowLeft, Users, Mail, Phone, User } from "lucide-react";

const ViewRegistered = () => {
  const [registrants, setRegistrants] = useState([]);
  const [eventTitle, setEventTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 px-4 py-10">
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
            <p className="text-[#ff9324] font-semibold text-sm">{eventTitle}</p>
          </div>
          {!loading && (
            <span className="ml-auto bg-orange-100 text-[#ff9324] text-sm font-bold px-3 py-1 rounded-full">
              {registrants.length} registered
            </span>
          )}
        </div>

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
            <div className="grid grid-cols-4 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wide">
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
            </div>
            {/* Rows */}
            {registrants.map((r, i) => (
              <div
                key={r._id}
                className={`grid grid-cols-4 gap-4 px-6 py-4 text-sm text-gray-700 items-center border-b border-gray-100 last:border-0 ${
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewRegistered;
