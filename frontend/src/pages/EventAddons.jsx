import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Award, Mic2, ArrowLeft } from "lucide-react";
import rccgLogo from "../assets/download (1).jpg";
import yayaLogo from "../assets/yaya.png";

const EventAddons = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  

  const eventId = searchParams.get("eventId") || "";
  const eventTitle = searchParams.get("title") || "Event";
  const name = searchParams.get("name") || "";

  const certUrl = `/certificate-payment?eventId=${eventId}&title=${eventTitle}&name=${name}`;
  const speakerUrl = `/speaker-booking?eventId=${eventId}&title=${eventTitle}&name=${name}`;

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 via-white to-amber-50">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-orange-100 px-6 py-3 flex items-center gap-2.5">
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
      </header>

      <div className="flex items-start justify-center px-4 py-10">
        <div className="w-full max-w-md">
          {/* Back link */}
          <Link
            to={`/register?eventId=${eventId}&title=${eventTitle}`}
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary mb-6 transition"
          >
            <ArrowLeft size={15} /> Back to Registration
          </Link>

          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Add-Ons for{" "}
              <span className="text-primary">
                {decodeURIComponent(eventTitle)}
              </span>
            </h1>
            <p className="text-sm text-gray-500">
              Enhance your experience — choose one or both options below.
            </p>
          </div>

          {/* Certificate card */}
          <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-6 mb-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400 flex items-center justify-center shrink-0">
                <Award size={20} className="text-white" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-base leading-snug">
                  Certificate of Participation
                </p>
                <p className="text-xs text-amber-600 font-semibold">
                  ₦2,000 one-time payment
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Receive an official certificate recognising your attendance at
              this event. Make payment, fill in how you want your name to
              appear, and upload your evidence.
            </p>
            <button
              onClick={() => navigate(certUrl)}
              className="w-full bg-amber-400 hover:bg-amber-500 active:scale-95 text-white font-bold py-3 rounded-xl transition-all shadow-sm text-sm"
            >
              Yes, I Want a Certificate →
            </button>
          </div>

          {/* Speaker booking card */}
          <div className="bg-blue-50 border-2 border-blue-300 rounded-2xl p-6 mb-8 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center shrink-0">
                <Mic2 size={20} className="text-white" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-base leading-snug">
                  One-on-One with the Keynote Speaker
                </p>
                <p className="text-xs text-blue-600 font-semibold">
                  ₦20,000 one-time payment
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Book a private session with the CEO of Pioneer Airline — an
              exclusive opportunity to connect, ask questions, and get mentored.
            </p>
            <button
              onClick={() => navigate(speakerUrl)}
              className="w-full bg-blue-500 hover:bg-blue-600 active:scale-95 text-white font-bold py-3 rounded-xl transition-all shadow-sm text-sm"
            >
              Yes, Book My Session →
            </button>
          </div>

          {/* Skip */}
          <div className="text-center">
            <button
              onClick={() => navigate("/")}
              className="text-sm text-gray-400 hover:text-gray-600 transition underline underline-offset-2"
            >
              No thanks, go back to events
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventAddons;
