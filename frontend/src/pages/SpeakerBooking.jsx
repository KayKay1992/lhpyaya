import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../api";
import toast from "react-hot-toast";
import {
  Mic2,
  Upload,
  CheckCircle,
  ArrowLeft,
  Copy,
  FileText,
  CreditCard,
} from "lucide-react";
import rccgLogo from "../assets/download (1).jpg";
import yayaLogo from "../assets/yaya.png";

const ACCOUNT_DETAILS = {
  amount: "₦20,000",
  accountName: "RCCG GLORIOUS YOUTH FELLOWSHIP",
  bank: "FIDELITY BANK",
  accountNumber: "5210040973",
};

const SpeakerBooking = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const eventId = searchParams.get("eventId");
  const eventTitle = searchParams.get("title") || "Event";
  const prefillName = searchParams.get("name") || "";

  const [form, setForm] = useState({
    name: prefillName,
    phone: "",
  });
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
    if (selected.type.startsWith("image/")) {
      setFilePreview(URL.createObjectURL(selected));
    } else {
      setFilePreview(null);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(ACCOUNT_DETAILS.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!eventId) {
      toast.error("Invalid event. Please go back.");
      return;
    }
    if (!form.name.trim()) {
      toast.error("Your name is required.");
      return;
    }
    const phoneRegex = /^\+?[0-9]{7,15}$/;
    if (!phoneRegex.test(form.phone.trim().replace(/[\s().-]/g, ""))) {
      toast.error("Please enter a valid phone number (7–15 digits).");
      return;
    }
    if (!file) {
      toast.error("Please upload proof of payment.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("eventId", eventId);
      formData.append("name", form.name.trim());
      formData.append("phone", form.phone.trim());
      formData.append("paymentEvidence", file);

      await api.post("/speaker-bookings", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSubmitted(true);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Submission failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-orange-50 via-white to-amber-50 px-4">
        <div className="bg-white rounded-3xl shadow-xl border border-orange-100 p-10 max-w-md w-full text-center">
          <div className="flex items-center justify-center mb-5">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle size={36} className="text-green-500" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Booking Submitted!
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Your one-on-one session request with the Keynote Speaker has been
            received. The admin will review your payment and get back to you
            shortly.
          </p>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-primary hover:bg-orange-500 text-white font-bold py-3 rounded-xl transition shadow-md shadow-orange-200"
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
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition"
        >
          <ArrowLeft size={16} /> Back
        </button>
      </header>

      <div className="max-w-lg mx-auto px-4 py-10">
        {/* Page title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-orange-100 mb-4">
            <Mic2 size={28} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Book a One-on-One Session
          </h1>
          <p className="text-gray-600 text-sm mt-1 font-medium">
            with the CEO of Pioneer Airline
          </p>
          <p className="text-gray-400 text-xs mt-1">
            {decodeURIComponent(eventTitle)}
          </p>
        </div>

        {/* Payment details card */}
        <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard size={18} className="text-primary" />
            <h2 className="font-bold text-gray-800 text-sm">Payment Details</h2>
          </div>
          <p className="text-xs text-gray-500 mb-4">
            Make a payment of{" "}
            <span className="font-bold text-gray-900 text-sm">
              {ACCOUNT_DETAILS.amount}
            </span>{" "}
            to the account below to secure your one-on-one session, then fill
            the form and upload your payment evidence.
          </p>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-xs text-gray-400 uppercase tracking-wide">
                Amount
              </span>
              <span className="font-bold text-primary text-lg">
                {ACCOUNT_DETAILS.amount}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-xs text-gray-400 uppercase tracking-wide">
                Account Name
              </span>
              <span className="font-semibold text-gray-800 text-xs text-right max-w-[55%]">
                {ACCOUNT_DETAILS.accountName}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-xs text-gray-400 uppercase tracking-wide">
                Bank
              </span>
              <span className="font-semibold text-gray-800 text-sm">
                {ACCOUNT_DETAILS.bank}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-xs text-gray-400 uppercase tracking-wide">
                Account Number
              </span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900 text-lg tracking-widest">
                  {ACCOUNT_DETAILS.accountNumber}
                </span>
                <button
                  onClick={handleCopy}
                  title="Copy account number"
                  className="text-primary hover:text-orange-600 transition"
                >
                  {copied ? (
                    <CheckCircle size={16} className="text-green-500" />
                  ) : (
                    <Copy size={16} />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-orange-100 shadow-sm p-6 space-y-5"
        >
          <h2 className="font-bold text-gray-800 text-sm mb-1">
            Fill in Your Details
          </h2>

          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Your Full Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. John Doe"
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="e.g. 08012345678"
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
            />
          </div>

          {/* Payment evidence upload */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Upload Proof of Payment
            </label>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-orange-200 rounded-xl cursor-pointer bg-orange-50 hover:bg-orange-100 transition">
              {filePreview ? (
                <img
                  src={filePreview}
                  alt="Payment proof preview"
                  className="h-full w-full object-contain rounded-xl p-1"
                />
              ) : file ? (
                <div className="flex flex-col items-center gap-2">
                  <FileText size={28} className="text-primary" />
                  <span className="text-xs text-gray-600 font-medium truncate max-w-50">
                    {file.name}
                  </span>
                  <span className="text-xs text-gray-400">PDF uploaded</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload size={24} className="text-primary" />
                  <span className="text-xs text-gray-500">
                    Click to upload screenshot or PDF
                  </span>
                  <span className="text-xs text-gray-400">
                    JPG, PNG, WEBP, PDF · Max 10MB
                  </span>
                </div>
              )}
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-orange-500 text-white font-bold py-3 rounded-xl transition shadow-md shadow-orange-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Submitting..." : "Submit Booking Request"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SpeakerBooking;
