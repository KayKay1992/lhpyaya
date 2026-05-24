import { useState, useEffect, useRef, Fragment } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { ButtonSpinner } from "../components/Spinner";
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
  Award,
  Mic2,
  Sparkles,
  ChevronRight,
  UserRound,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import rccgLogo from "../assets/download (1).jpg";
import yayaLogo from "../assets/yaya.png";

const RegisterEvent = () => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    referral: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [eventImage, setEventImage] = useState(null);
  const [eventDetails, setEventDetails] = useState(null);
  const [speakers, setSpeakers] = useState([]);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const formRef = useRef(null);

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
            description: res.data.description,
          });
          if (res.data.speakers) setSpeakers(res.data.speakers);
        })
        .catch(() => {});
    }
  }, [eventId]);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!eventId) {
      toast.error("Invalid event. Please go back and try again.");
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
                <CalendarDays size={15} className="text-primary shrink-0" />
                <span>
                  {new Date(
                    eventDetails.date.slice(0, 10) + "T12:00:00",
                  ).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-gray-700">
                <Clock size={15} className="text-primary shrink-0" />
                <span>{eventDetails.time}</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-gray-700">
                <MapPin size={15} className="text-primary shrink-0" />
                <span>{eventDetails.location}</span>
              </div>
            </div>
          )}

          {/* Certificate prompt */}
          <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 mb-4 text-left shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-amber-400 flex items-center justify-center shrink-0">
                <Award size={18} className="text-white" />
              </div>
              <p className="font-bold text-gray-900 text-sm leading-snug">
                Do You Need a Certificate of Participation?
              </p>
            </div>
            <p className="text-xs text-gray-500 mb-3 pl-12">
              Get an official certificate to recognise your attendance at this
              event.
            </p>
            <button
              onClick={() =>
                navigate(
                  `/certificate-payment?eventId=${eventId}&title=${eventTitle}&name=${encodeURIComponent(form.name)}`,
                )
              }
              className="w-full bg-amber-400 hover:bg-amber-500 text-white font-bold py-2.5 rounded-xl transition text-sm shadow-sm"
            >
              Yes, Get My Certificate →
            </button>
          </div>

          {/* Speaker booking prompt */}
          <div className="bg-blue-50 border-2 border-blue-300 rounded-2xl p-5 mb-4 text-left shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-blue-500 flex items-center justify-center shrink-0">
                <Mic2 size={18} className="text-white" />
              </div>
              <p className="font-bold text-gray-900 text-sm leading-snug">
                Book a One-on-One with Our Keynote Speaker!
              </p>
            </div>
            <p className="text-xs text-gray-500 mb-3 pl-12">
              Meet personally with the CEO of Pioneer Airline — a rare
              opportunity you don’t want to miss.
            </p>
            <button
              onClick={() =>
                navigate(
                  `/speaker-booking?eventId=${eventId}&title=${eventTitle}&name=${encodeURIComponent(form.name)}`,
                )
              }
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2.5 rounded-xl transition text-sm shadow-sm"
            >
              Yes, Book My Session →
            </button>
          </div>

          {/* WhatsApp community */}
          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-5 mb-4 text-left shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-[#25D366] flex items-center justify-center shrink-0 text-white font-bold text-lg">
                W
              </div>
              <p className="font-bold text-gray-900 text-sm leading-snug">
                Join Our WhatsApp Community!
              </p>
            </div>
            <p className="text-xs text-gray-500 mb-3 pl-12">
              Stay updated with event info, reminders, and announcements.
            </p>
            <a
              href="https://chat.whatsapp.com/BNgu49pWizR6WypiCutHDe?s=cl&p=a&mlu=4"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center bg-[#25D366] hover:bg-green-500 text-white font-bold py-2.5 rounded-xl transition text-sm shadow-sm"
            >
              Yes, Join Community →
            </a>
          </div>

          {/* Volunteer team */}
          <div className="bg-teal-50 border-2 border-teal-200 rounded-2xl p-5 mb-6 text-left shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-[#128C7E] flex items-center justify-center shrink-0 text-white font-bold text-lg">
                V
              </div>
              <p className="font-bold text-gray-900 text-sm leading-snug">
                Do You Want to Join Our Volunteer Team?
              </p>
            </div>
            <p className="text-xs text-gray-500 mb-3 pl-12">
              Be part of the team making this event happen — join our volunteer
              WhatsApp group.
            </p>
            <a
              href="https://chat.whatsapp.com/J9o02sRit1gLCe26Lv8Y1F"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center bg-[#128C7E] hover:bg-teal-700 text-white font-bold py-2.5 rounded-xl transition text-sm shadow-sm"
            >
              Yes, Join Volunteer Group →
            </a>
          </div>

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
              className="flex items-center gap-2 border border-[#ff9324] text-primary text-sm font-semibold px-4 py-2 rounded-xl hover:bg-orange-50 transition"
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
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary mb-6 transition"
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

          {/* Event Description — modern redesign */}
          {eventDetails?.description && (
            <div className="mb-8">
              <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#ff9324] to-amber-500 p-6 text-white shadow-xl shadow-orange-200/60">
                {/* decorative circles */}
                <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-white/10" />
                <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-white/10" />
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10" />
                {/* heading */}
                <div className="flex items-center gap-2 mb-3 relative">
                  <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                    <Sparkles size={16} className="text-white" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-white/80">
                    About This Event
                  </span>
                </div>
                <p className="text-base font-medium leading-relaxed relative text-white/95">
                  {eventDetails.description}
                </p>
                {/* info pills */}
                <div className="flex flex-wrap gap-2 mt-4 relative">
                  {eventDetails.date && (
                    <span className="flex items-center gap-1.5 bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                      <CalendarDays size={12} />
                      {new Date(
                        eventDetails.date.slice(0, 10) + "T12:00:00",
                      ).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  )}
                  {eventDetails.time && (
                    <span className="flex items-center gap-1.5 bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                      <Clock size={12} />
                      {eventDetails.time}
                    </span>
                  )}
                  {eventDetails.location && (
                    <span className="flex items-center gap-1.5 bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                      <MapPin size={12} />
                      {eventDetails.location}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Meet the Speakers */}
          {speakers.length > 0 && (
            <div className="mb-10">
              {/* Section header */}
              <div className="text-center mb-6">
                <span className="inline-flex items-center gap-2 bg-orange-100 text-[#ff9324] text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-3">
                  <UserRound size={13} /> Meet the Speakers
                </span>
                <h2 className="text-2xl font-extrabold text-gray-900">
                  Who You'll Hear From
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  World-class voices. Life-changing insights.
                </p>
              </div>

              {/* Speaker cards with interspersed Register Now buttons */}
              <div className="space-y-4">
                {speakers.map((speaker, idx) => (
                  <Fragment key={speaker._id}>
                    {/* Register Now CTA after every 2nd speaker (and not before first) */}
                    {idx > 0 && idx % 2 === 0 && (
                      <div className="py-2">
                        <button
                          onClick={scrollToForm}
                          className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-[#ff9324] to-amber-500 hover:from-orange-500 hover:to-amber-600 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-orange-200/60 transition-all active:scale-95 text-sm"
                        >
                          <CalendarDays size={16} />
                          Register Now — Secure Your Spot!
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    )}
                    <div className="flex items-center gap-4 bg-white rounded-2xl border border-orange-100 shadow-sm px-5 py-4 hover:shadow-md hover:border-orange-200 transition-all">
                      {/* Photo */}
                      {speaker.image ? (
                        <img
                          src={speaker.image}
                          alt={speaker.name}
                          className="w-16 h-16 rounded-2xl object-cover shrink-0 border-2 border-orange-100"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-orange-100 to-amber-100 flex items-center justify-center shrink-0">
                          <UserRound size={28} className="text-[#ff9324]" />
                        </div>
                      )}
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 text-base leading-tight">
                          {speaker.name}
                        </p>
                        {speaker.title && (
                          <p className="text-xs text-[#ff9324] font-semibold mt-0.5 leading-snug">
                            {speaker.title}
                          </p>
                        )}
                      </div>
                      {/* Decorative accent */}
                      <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                        <Mic2 size={16} className="text-[#ff9324]" />
                      </div>
                    </div>
                  </Fragment>
                ))}
              </div>

              {/* Final Register Now button */}
              <button
                onClick={scrollToForm}
                className="mt-5 w-full flex items-center justify-center gap-2 bg-linear-to-r from-[#ff9324] to-amber-500 hover:from-orange-500 hover:to-amber-600 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-orange-200/60 transition-all active:scale-95 text-sm"
              >
                <CalendarDays size={16} />
                Register Now — Secure Your Spot!
                <ChevronRight size={16} />
              </button>
            </div>
          )}

          {/* Registration form anchor */}
          <div ref={formRef} />

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#ff9324] shadow-lg mb-4">
              <CalendarDays className="text-white" size={26} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Register for Event
            </h1>
            <p className="text-primary font-semibold text-sm mt-1">
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

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Who told you about this event?
                </label>
                <input
                  type="text"
                  name="referral"
                  value={form.referral}
                  onChange={handleChange}
                  placeholder="e.g. A friend, Social media, Poster, Church announcement..."
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff9324] focus:border-transparent transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#ff9324] hover:bg-orange-500 active:scale-95 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-orange-200 disabled:opacity-60 mt-2"
              >
                {loading ? (
                  <ButtonSpinner label="Submitting…" />
                ) : (
                  "Confirm Registration"
                )}
              </button>

              {/* Add-ons prompt — eye-catching gradient banner */}
              <div className="mt-5">
                <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-amber-400 to-orange-500 p-5 text-white shadow-lg shadow-orange-200/60">
                  <div className="absolute -top-5 -right-5 w-24 h-24 rounded-full bg-white/10" />
                  <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-white/10" />
                  <div className="flex items-center gap-3 mb-3 relative">
                    <div className="flex items-center gap-1.5 bg-white/20 rounded-xl px-2.5 py-2">
                      <Award size={18} className="text-white" />
                      <Mic2 size={18} className="text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-sm leading-tight">
                        Get a Certificate or Book a Speaker Session!
                      </p>
                      <p className="text-xs text-white/80 mt-0.5">
                        Limited slots — don't miss out!
                      </p>
                    </div>
                  </div>
                  <Link
                    to={`/event-extras?eventId=${eventId}&title=${eventTitle}&name=${encodeURIComponent(form.name)}`}
                    className="w-full flex items-center justify-center gap-2 bg-white text-orange-500 font-bold text-sm py-2.5 rounded-xl hover:bg-orange-50 transition shadow-sm relative"
                  >
                    <Award size={14} />
                    <Mic2 size={14} />
                    Click here to book / pay →
                  </Link>
                </div>
              </div>

              {/* WhatsApp links */}
              <div className="mt-4 space-y-2.5">
                <a
                  href="https://chat.whatsapp.com/BNgu49pWizR6WypiCutHDe?s=cl&p=a&mlu=4"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3 hover:bg-green-100 transition group"
                >
                  <div className="w-9 h-9 rounded-full bg-[#25D366] flex items-center justify-center shrink-0 text-white font-bold text-base">
                    W
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-bold text-gray-800">
                      Join Event Community
                    </p>
                    <p className="text-xs text-gray-500">
                      Get updates on WhatsApp
                    </p>
                  </div>
                  <span className="text-green-600 text-xs font-semibold group-hover:translate-x-0.5 transition">
                    Join →
                  </span>
                </a>
                <a
                  href="https://chat.whatsapp.com/J9o02sRit1gLCe26Lv8Y1F"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3 hover:bg-green-100 transition group"
                >
                  <div className="w-9 h-9 rounded-full bg-[#128C7E] flex items-center justify-center shrink-0 text-white font-bold text-base">
                    V
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-bold text-gray-800">
                      Join Volunteer Team
                    </p>
                    <p className="text-xs text-gray-500">
                      Be part of the team!
                    </p>
                  </div>
                  <span className="text-green-600 text-xs font-semibold group-hover:translate-x-0.5 transition">
                    Join →
                  </span>
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterEvent;
