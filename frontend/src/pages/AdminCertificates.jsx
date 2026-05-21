import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SectionSpinner } from "../components/Spinner";
import { useAuth } from "../context/AuthContext";
import api from "../api";
import toast from "react-hot-toast";
import {
  Award,
  LogOut,
  ArrowLeft,
  Eye,
  FileText,
  CalendarDays,
  User,
  Search,
} from "lucide-react";
import rccgLogo from "../assets/download (1).jpg";
import yayaLogo from "../assets/yaya.png";

const generateCertificateHTML = (request) => {
  const eventTitle = request.event?.title || "Event";
  const eventDate = request.event?.date
    ? new Date(request.event.date).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Certificate of Participation</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Open+Sans:wght@400;600&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Open Sans', sans-serif;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 20px;
    }
    .cert {
      width: 900px;
      min-height: 620px;
      border: 14px solid #ff9324;
      box-shadow: inset 0 0 0 4px #fff8f0;
      padding: 50px 60px;
      position: relative;
      text-align: center;
      background: linear-gradient(135deg, #fffbf5 0%, #fff 50%, #fffbf5 100%);
    }
    .corner {
      position: absolute;
      width: 60px;
      height: 60px;
      border-color: #ff9324;
      border-style: solid;
    }
    .corner-tl { top: 10px; left: 10px; border-width: 4px 0 0 4px; }
    .corner-tr { top: 10px; right: 10px; border-width: 4px 4px 0 0; }
    .corner-bl { bottom: 10px; left: 10px; border-width: 0 0 4px 4px; }
    .corner-br { bottom: 10px; right: 10px; border-width: 0 4px 4px 0; }
    .org { font-size: 13px; font-weight: 600; letter-spacing: 3px; color: #ff9324; text-transform: uppercase; margin-bottom: 6px; }
    .title {
      font-family: 'Playfair Display', serif;
      font-size: 40px;
      font-weight: 700;
      color: #1a1a1a;
      margin: 10px 0 4px;
    }
    .subtitle {
      font-family: 'Playfair Display', serif;
      font-size: 22px;
      color: #444;
      margin-bottom: 28px;
    }
    .presented { font-size: 13px; color: #888; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 10px; }
    .name {
      font-family: 'Playfair Display', serif;
      font-size: 48px;
      font-weight: 700;
      font-style: italic;
      color: #ff9324;
      margin: 8px 0 28px;
      line-height: 1.1;
    }
    .desc { font-size: 14px; color: #555; max-width: 560px; margin: 0 auto 24px; line-height: 1.7; }
    .event-name { font-weight: 700; color: #1a1a1a; }
    .divider { width: 120px; height: 2px; background: #ff9324; margin: 0 auto 24px; }
    .footer { display: flex; justify-content: space-around; margin-top: 32px; gap: 40px; }
    .sig-block { text-align: center; flex: 1; }
    .sig-line { border-top: 1px solid #ccc; padding-top: 6px; font-size: 11px; color: #888; letter-spacing: 0.5px; }
    .sig-name { font-weight: 700; font-size: 13px; color: #333; }
    .date-block { font-size: 12px; color: #777; margin-top: 20px; }
    @media print {
      body { padding: 0; }
      .cert { box-shadow: none; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="cert">
    <div class="corner corner-tl"></div>
    <div class="corner corner-tr"></div>
    <div class="corner corner-bl"></div>
    <div class="corner corner-br"></div>

    <div class="org">RCCG Glorious Youth Fellowship — LHP YAYA</div>
    <div class="title">Certificate</div>
    <div class="subtitle">of Participation</div>

    <div class="presented">This is to certify that</div>
    <div class="name">${request.certificateName}</div>

    <div class="divider"></div>

    <div class="desc">
      has successfully participated in the
      <span class="event-name">${eventTitle}</span>
      ${eventDate ? `held on <strong>${eventDate}</strong>` : ""}
      and is hereby awarded this certificate in recognition of their commitment and participation.
    </div>

    <div class="footer">
      <div class="sig-block">
        <div class="sig-line">
          <div class="sig-name">Youth President</div>
          <div>RCCG Glorious Youth Fellowship</div>
        </div>
      </div>
      <div class="sig-block">
        <div class="sig-line">
          <div class="sig-name">Youth Pastor</div>
          <div>LHP Parish</div>
        </div>
      </div>
    </div>

    <div class="date-block">Issued: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</div>
  </div>
  <script>window.onload = () => window.print();</script>
</body>
</html>`;
};

const AdminCertificates = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/certificates")
      .then((res) => setRequests(res.data))
      .catch(() => toast.error("Failed to load certificate requests"))
      .finally(() => setLoading(false));
  }, []);

  const handleViewReceipt = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleGenerateCertificate = (request) => {
    const html = generateCertificateHTML(request);
    const win = window.open("", "_blank");
    if (win) {
      win.document.write(html);
      win.document.close();
    } else {
      toast.error("Please allow popups to generate the certificate.");
    }
  };

  const filtered = requests.filter((r) => {
    const q = search.toLowerCase();
    return (
      r.certificateName?.toLowerCase().includes(q) ||
      r.participantName?.toLowerCase().includes(q) ||
      r.email?.toLowerCase().includes(q) ||
      r.event?.title?.toLowerCase().includes(q)
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

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Page header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Award size={22} className="text-primary" />
              <h1 className="text-2xl font-bold text-gray-900">
                Certificate Requests
              </h1>
            </div>
            <p className="text-gray-500 text-sm">
              {requests.length} request{requests.length !== 1 ? "s" : ""} total
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
              placeholder="Search by name or event..."
              className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 w-64"
            />
          </div>
        </div>

        {loading ? (
          <SectionSpinner label="Loading certificates…" />
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Award size={48} className="text-orange-200 mx-auto mb-4" />
            <p className="text-gray-400 text-sm">
              {search ? "No results found." : "No certificate requests yet."}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Table header */}
            <div className="hidden md:grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <span>Participant Name</span>
              <span>Name on Certificate</span>
              <span>Event</span>
              <span>Email</span>
              <span>Actions</span>
            </div>

            <div className="divide-y divide-gray-100">
              {filtered.map((req) => (
                <div
                  key={req._id}
                  className="px-6 py-4 flex flex-col md:grid md:grid-cols-[1fr_1fr_1fr_1fr_auto] gap-4 items-start md:items-center"
                >
                  {/* Participant Name */}
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                      <User size={14} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        {req.participantName}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(req.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Certificate Name */}
                  <div>
                    <span className="text-xs text-gray-400 block md:hidden font-semibold uppercase mb-0.5">
                      Certificate Name
                    </span>
                    <p className="text-sm font-bold text-primary">
                      {req.certificateName}
                    </p>
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
                        {req.event?.title || "—"}
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <span className="text-xs text-gray-400 block md:hidden font-semibold uppercase mb-0.5">
                      Email
                    </span>
                    <p className="text-xs text-gray-500 truncate max-w-45">
                      {req.email}
                    </p>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleViewReceipt(req.paymentEvidence)}
                      className="flex items-center gap-1.5 text-xs font-semibold border border-blue-100 text-blue-600 px-3 py-2 rounded-xl hover:bg-blue-50 transition whitespace-nowrap"
                    >
                      <Eye size={13} /> View Receipt
                    </button>
                    <button
                      onClick={() => handleGenerateCertificate(req)}
                      className="flex items-center gap-1.5 text-xs font-semibold border border-orange-200 text-primary px-3 py-2 rounded-xl hover:bg-orange-50 transition whitespace-nowrap"
                    >
                      <FileText size={13} /> Generate Certificate
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

export default AdminCertificates;
