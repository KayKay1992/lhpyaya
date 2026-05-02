import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import api from "../api";
import toast from "react-hot-toast";
import { CalendarDays, ArrowLeft, CheckCircle } from "lucide-react";

const RegisterEvent = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const eventId = searchParams.get("eventId");
  const eventTitle = searchParams.get("title") || "Event";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!eventId) {
      toast.error("Invalid event. Please go back and try again.");
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-amber-50 px-4">
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-amber-50 px-4 py-10">
      <div className="w-full max-w-md">
        {/* Back */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#ff9324] mb-6 transition"
        >
          <ArrowLeft size={15} /> Back to Events
        </Link>

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
                Phone{" "}
                <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
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
  );
};

export default RegisterEvent;
