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
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Certificate of Participation – SPARK 2026</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=Raleway:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
  <style>
    @page { size: A4 landscape; margin: 0; }
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: 'Raleway', sans-serif;
      background: #06101f;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
    }

    /* ── CERT SHELL ────────────────────────────────── */
    .cert {
      width: 1060px;
      height: 750px;
      position: relative;
      overflow: hidden;
      background: linear-gradient(145deg, #0b1d44 0%, #0a1628 35%, #0d2254 65%, #091526 100%);
      print-color-adjust: exact;
      -webkit-print-color-adjust: exact;
    }

    /* ── TECH GRID ─────────────────────────────────── */
    .grid {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(99,149,255,0.045) 1px, transparent 1px),
        linear-gradient(90deg, rgba(99,149,255,0.045) 1px, transparent 1px);
      background-size: 55px 55px;
    }

    /* ── AMBIENT GLOWS ─────────────────────────────── */
    .glow {
      position: absolute;
      border-radius: 50%;
      pointer-events: none;
    }
    .glow-tr {
      width: 420px; height: 420px;
      background: radial-gradient(circle, rgba(80,130,255,0.13) 0%, transparent 65%);
      top: -120px; right: -60px;
    }
    .glow-bl {
      width: 320px; height: 320px;
      background: radial-gradient(circle, rgba(60,100,220,0.10) 0%, transparent 65%);
      bottom: -80px; left: -40px;
    }
    .glow-center {
      width: 500px; height: 240px;
      background: radial-gradient(ellipse, rgba(100,155,255,0.07) 0%, transparent 70%);
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
    }

    /* ── BORDER SYSTEM ─────────────────────────────── */
    .border-outer {
      position: absolute;
      inset: 10px;
      border: 1px solid rgba(180,210,255,0.25);
    }
    .border-inner {
      position: absolute;
      inset: 18px;
      border: 1px solid rgba(180,210,255,0.10);
    }

    /* Gradient edge bars */
    .edge { position: absolute; }
    .edge-top    { top: 0;    left: 0; right: 0;  height: 5px; background: linear-gradient(90deg, transparent 5%, #3b6fd4 30%, #8ab4ff 50%, #c5d9ff 60%, #8ab4ff 70%, #3b6fd4 85%, transparent 95%); }
    .edge-bottom { bottom: 0; left: 0; right: 0;  height: 5px; background: linear-gradient(90deg, transparent 5%, #3b6fd4 30%, #8ab4ff 50%, #c5d9ff 60%, #8ab4ff 70%, #3b6fd4 85%, transparent 95%); }
    .edge-left   { left: 0;   top: 5px; bottom: 5px; width: 4px; background: linear-gradient(180deg, transparent 5%, #3b6fd4 30%, #8ab4ff 55%, #3b6fd4 80%, transparent 95%); }
    .edge-right  { right: 0;  top: 5px; bottom: 5px; width: 4px; background: linear-gradient(180deg, transparent 5%, #3b6fd4 30%, #8ab4ff 55%, #3b6fd4 80%, transparent 95%); }

    /* ── ANGULAR CORNER CUTS ───────────────────────── */
    .cc { position: absolute; width: 58px; height: 58px; }
    .cc::before, .cc::after { content: ''; position: absolute; background: rgba(180,210,255,0.65); }
    .cc.tl { top: 10px;    left: 10px;    }
    .cc.tl::before { top: 0;      left: 0; width: 58px; height: 2px; }
    .cc.tl::after  { top: 0;      left: 0; width: 2px;  height: 58px; }
    .cc.tr { top: 10px;    right: 10px;   }
    .cc.tr::before { top: 0;      right: 0; width: 58px; height: 2px; }
    .cc.tr::after  { top: 0;      right: 0; width: 2px;  height: 58px; }
    .cc.bl { bottom: 10px; left: 10px;    }
    .cc.bl::before { bottom: 0;   left: 0; width: 58px; height: 2px; }
    .cc.bl::after  { bottom: 0;   left: 0; width: 2px;  height: 58px; }
    .cc.br { bottom: 10px; right: 10px;   }
    .cc.br::before { bottom: 0;   right: 0; width: 58px; height: 2px; }
    .cc.br::after  { bottom: 0;   right: 0; width: 2px;  height: 58px; }

    /* Corner diamonds */
    .cd { position: absolute; width: 9px; height: 9px; background: rgba(180,210,255,0.8); transform: rotate(45deg); }
    .cd.tl { top: 6px;    left: 6px;    }
    .cd.tr { top: 6px;    right: 6px;   }
    .cd.bl { bottom: 6px; left: 6px;    }
    .cd.br { bottom: 6px; right: 6px;   }

    /* ── ANGLED ACCENT STRIPS ──────────────────────── */
    .strip-left {
      position: absolute;
      top: 0; left: 0; bottom: 0; width: 6px;
      background: linear-gradient(180deg, transparent, rgba(99,149,255,0.18) 30%, rgba(99,149,255,0.18) 70%, transparent);
    }
    .strip-right {
      position: absolute;
      top: 0; right: 0; bottom: 0; width: 6px;
      background: linear-gradient(180deg, transparent, rgba(99,149,255,0.18) 30%, rgba(99,149,255,0.18) 70%, transparent);
    }

    /* ── CONTENT LAYER ─────────────────────────────── */
    .content {
      position: relative;
      z-index: 10;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 28px 68px 22px;
    }

    /* ── HEADER ────────────────────────────────────── */
    .header {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 18px;
      margin-bottom: 10px;
    }
    .logo-ring {
      width: 50px; height: 50px;
      border-radius: 50%;
      border: 1.5px solid rgba(180,210,255,0.45);
      background: rgba(255,255,255,0.06);
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
      box-shadow: 0 0 12px rgba(99,149,255,0.2);
    }
    .org-text { text-align: center; line-height: 1.55; }
    .org-line {
      font-family: 'Cinzel', serif;
      font-size: 8.5px;
      letter-spacing: 2.5px;
      color: rgba(180,210,255,0.75);
      text-transform: uppercase;
    }

    /* ── DIVIDERS ──────────────────────────────────── */
    .div-full {
      width: 100%;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(180,210,255,0.35), transparent);
      margin: 7px 0;
    }
    .div-center {
      width: 55%;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(180,210,255,0.5), transparent);
      margin: 0 auto 7px;
    }

    /* ── DECO LINE WITH DIAMONDS ───────────────────── */
    .deco-row {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 62%;
      margin: 0 auto 7px;
    }
    .deco-row .l { flex: 1; height: 1px; }
    .deco-row .l.left  { background: linear-gradient(90deg, transparent, rgba(180,210,255,0.4)); }
    .deco-row .l.right { background: linear-gradient(90deg, rgba(180,210,255,0.4), transparent); }
    .deco-d {
      width: 5px; height: 5px;
      background: rgba(180,210,255,0.55);
      transform: rotate(45deg);
      flex-shrink: 0;
    }
    .deco-d.lg {
      width: 7px; height: 7px;
      background: rgba(180,210,255,0.9);
    }

    /* ── CERT MAIN TITLE ───────────────────────────── */
    .cert-title {
      font-family: 'Cinzel', serif;
      font-size: 54px;
      font-weight: 900;
      letter-spacing: 14px;
      text-align: center;
      background: linear-gradient(175deg, #ffffff 0%, #dce9ff 35%, #9dbeff 70%, #6a9eff 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      filter: drop-shadow(0 0 18px rgba(100,155,255,0.45));
      line-height: 1;
      margin-bottom: 1px;
    }
    .cert-sub {
      font-family: 'Cinzel', serif;
      font-size: 15px;
      font-weight: 400;
      letter-spacing: 9px;
      color: rgba(180,210,255,0.65);
      text-align: center;
      margin-bottom: 8px;
    }

    /* ── PRESENTED TO ──────────────────────────────── */
    .presented {
      font-family: 'Cormorant Garamond', serif;
      font-size: 13px;
      font-style: italic;
      color: rgba(180,210,255,0.55);
      letter-spacing: 1.5px;
      margin-bottom: 2px;
    }

    /* ── PARTICIPANT NAME ──────────────────────────── */
    .pname {
      font-family: 'Cormorant Garamond', serif;
      font-size: 46px;
      font-weight: 600;
      font-style: italic;
      text-align: center;
      background: linear-gradient(175deg, #ffffff 0%, #eaf0ff 45%, #b8d0ff 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      filter: drop-shadow(0 2px 14px rgba(100,155,255,0.5));
      line-height: 1.1;
      margin-bottom: 5px;
    }

    /* ── DESCRIPTION ───────────────────────────────── */
    .desc {
      font-family: 'Raleway', sans-serif;
      font-size: 10.5px;
      font-weight: 400;
      color: rgba(180,210,255,0.6);
      text-align: center;
      max-width: 700px;
      line-height: 1.85;
      margin-bottom: 5px;
    }
    .desc strong { color: rgba(220,235,255,0.9); font-weight: 600; }

    /* ── THEME ─────────────────────────────────────── */
    .theme {
      font-family: 'Cinzel', serif;
      font-size: 10.5px;
      font-weight: 700;
      letter-spacing: 4px;
      color: rgba(180,210,255,0.8);
      margin-bottom: 3px;
    }
    .meta {
      font-family: 'Raleway', sans-serif;
      font-size: 9.5px;
      font-weight: 500;
      color: rgba(140,180,255,0.48);
      letter-spacing: 2.5px;
      text-transform: uppercase;
      margin-bottom: 8px;
    }

    /* ── FOOTER ────────────────────────────────────── */
    .footer {
      width: 100%;
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      margin-top: auto;
    }

    .sig-block { text-align: center; min-width: 200px; }
    .sig-line {
      width: 170px;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(180,210,255,0.38), transparent);
      margin: 0 auto 5px;
    }
    .sig-name {
      font-family: 'Cinzel', serif;
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.8px;
      color: rgba(220,235,255,0.85);
      margin-bottom: 2px;
    }
    .sig-role {
      font-family: 'Raleway', sans-serif;
      font-size: 8px;
      color: rgba(140,180,255,0.48);
      letter-spacing: 0.5px;
    }

    /* ── SEAL ──────────────────────────────────────── */
    .seal-wrap { display: flex; flex-direction: column; align-items: center; }
    .seal {
      width: 96px; height: 96px;
      border-radius: 50%;
      border: 1.5px solid rgba(180,210,255,0.38);
      background: radial-gradient(circle at 40% 35%, rgba(30,65,140,0.85), rgba(8,18,40,0.95));
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      box-shadow:
        0 0 0 4px rgba(99,149,255,0.08),
        0 0 24px rgba(99,149,255,0.28),
        inset 0 0 18px rgba(99,149,255,0.12);
      position: relative;
    }
    .seal::before {
      content: '';
      position: absolute;
      inset: 6px;
      border-radius: 50%;
      border: 1px solid rgba(180,210,255,0.2);
    }
    .seal::after {
      content: '';
      position: absolute;
      inset: 11px;
      border-radius: 50%;
      border: 1px dashed rgba(180,210,255,0.1);
    }
    .seal-text { z-index: 1; text-align: center; }
    .seal-s {
      font-family: 'Cinzel', serif;
      font-size: 17px;
      font-weight: 900;
      letter-spacing: 3px;
      background: linear-gradient(180deg, #fff 0%, #b8d0ff 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      line-height: 1;
    }
    .seal-yr {
      font-family: 'Cinzel', serif;
      font-size: 11px;
      color: rgba(180,210,255,0.65);
      letter-spacing: 2px;
      margin-bottom: 1px;
    }
    .seal-m {
      font-family: 'Raleway', sans-serif;
      font-size: 5.5px;
      color: rgba(140,180,255,0.5);
      letter-spacing: 0.8px;
      text-transform: uppercase;
    }

    /* ── SIDE DECORATIVE LINES ─────────────────────── */
    .side-deco {
      position: absolute;
      top: 50%; transform: translateY(-50%);
      display: flex; flex-direction: column; gap: 6px; align-items: center;
    }
    .side-deco.left  { left: 30px; }
    .side-deco.right { right: 30px; }
    .sd-line { width: 1px; height: 40px; background: linear-gradient(180deg, transparent, rgba(140,180,255,0.3), transparent); }
    .sd-d { width: 5px; height: 5px; background: rgba(140,180,255,0.4); transform: rotate(45deg); }

    @media print {
      body { background: #06101f; }
      .cert { box-shadow: none; }
    }
  </style>
</head>
<body>
  <div class="cert">

    <!-- Background layers -->
    <div class="grid"></div>
    <div class="glow glow-tr"></div>
    <div class="glow glow-bl"></div>
    <div class="glow glow-center"></div>

    <!-- Border system -->
    <div class="edge edge-top"></div>
    <div class="edge edge-bottom"></div>
    <div class="edge edge-left"></div>
    <div class="edge edge-right"></div>
    <div class="border-outer"></div>
    <div class="border-inner"></div>

    <!-- Corner cuts -->
    <div class="cc tl"></div><div class="cc tr"></div>
    <div class="cc bl"></div><div class="cc br"></div>
    <div class="cd tl"></div><div class="cd tr"></div>
    <div class="cd bl"></div><div class="cd br"></div>

    <!-- Side accent strips -->
    <div class="strip-left"></div>
    <div class="strip-right"></div>

    <!-- Side decorative elements -->
    <div class="side-deco left">
      <div class="sd-line"></div>
      <div class="sd-d"></div>
      <div class="sd-line"></div>
    </div>
    <div class="side-deco right">
      <div class="sd-line"></div>
      <div class="sd-d"></div>
      <div class="sd-line"></div>
    </div>

    <!-- CONTENT -->
    <div class="content">

      <!-- Header -->
      <div class="header">
        <div class="logo-ring">
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
            <circle cx="15" cy="15" r="13" stroke="rgba(180,210,255,0.4)" stroke-width="1"/>
            <text x="15" y="19" text-anchor="middle" font-size="7" fill="rgba(180,210,255,0.85)" font-family="Cinzel,serif" font-weight="700">RCCG</text>
          </svg>
        </div>
        <div class="org-text">
          <div class="org-line">The Redeemed Christian Church of God</div>
          <div class="org-line">Lighthouse Parish &nbsp;·&nbsp; Youths &amp; Young Adults</div>
        </div>
        <div class="logo-ring">
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
            <circle cx="15" cy="15" r="13" stroke="rgba(180,210,255,0.4)" stroke-width="1"/>
            <text x="15" y="14" text-anchor="middle" font-size="6.5" fill="rgba(180,210,255,0.85)" font-family="Cinzel,serif" font-weight="700">LHP</text>
            <text x="15" y="22" text-anchor="middle" font-size="6.5" fill="rgba(180,210,255,0.85)" font-family="Cinzel,serif" font-weight="700">YAYA</text>
          </svg>
        </div>
      </div>

      <div class="div-full"></div>

      <!-- Main Title -->
      <div class="cert-title">CERTIFICATE</div>
      <div class="cert-sub">OF &nbsp; PARTICIPATION</div>

      <!-- Deco divider -->
      <div class="deco-row">
        <div class="l left"></div>
        <div class="deco-d"></div>
        <div class="deco-d lg"></div>
        <div class="deco-d"></div>
        <div class="l right"></div>
      </div>

      <div class="presented">This Certificate is proudly presented to</div>
      <div class="pname">${request.certificateName}</div>

      <div class="div-center"></div>

      <div class="desc">
        For actively participating in <strong>SPARK 2026 – Port Harcourt Youth Business &amp; Career Summit</strong>, a transformational gathering designed to inspire, equip and empower young leaders, entrepreneurs and professionals to create lasting impact in society.
      </div>

      <div class="theme">&#10022; &nbsp; ONE SPARK. ENDLESS IMPACT. &nbsp; &#10022;</div>
      <div class="meta">27th June 2026 &nbsp;&nbsp;·&nbsp;&nbsp; Port Harcourt, Rivers State</div>

      <!-- Footer: Signatures + Seal -->
      <div class="footer">
        <!-- Left sig -->
        <div class="sig-block">
          <div class="sig-line"></div>
          <div class="sig-name">CAPT. HENRY UNGBUKU OKOBAUNDU</div>
          <div class="sig-role">Group Managing Director · Pioneer Airlines</div>
        </div>

        <!-- Center seal -->
        <div class="seal-wrap">
          <div class="seal">
            <div class="seal-text">
              <div class="seal-s">SPARK</div>
              <div class="seal-yr">2026</div>
              <div class="seal-m">One Spark · Endless Impact</div>
            </div>
          </div>
        </div>

        <!-- Right sig -->
        <div class="sig-block">
          <div class="sig-line"></div>
          <div class="sig-name">KENNETH NWANKPA</div>
          <div class="sig-role">Convener · SPARK 2026</div>
        </div>
      </div>

    </div><!-- /content -->
  </div><!-- /cert -->

  <script>
    document.fonts.ready.then(() => setTimeout(() => window.print(), 600));
  </script>
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
