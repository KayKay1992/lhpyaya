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

const generateCertificateHTML = (request, rccgLogoUrl, yayaLogoUrl) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1.0" />
  <title>Certificate of Participation – SPARK 2026</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Dancing+Script:wght@400;600;700&family=Raleway:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
  <style>
    @page { size: A4 landscape; margin: 0; }
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      background: #8a8a8a;
      display: flex; align-items: flex-start; justify-content: center;
      min-height: 100vh;
      padding: 20px 0;
      print-color-adjust: exact;
      -webkit-print-color-adjust: exact;
    }

    /* ── RESPONSIVE WRAPPER ─────────────────────────── */
    .cert-wrapper {
      width: 100%;
      display: flex;
      justify-content: center;
      overflow: hidden;
    }

    /* ── CERTIFICATE SHELL ─────────────────────────── */
    .cert {
      width: 1060px; height: auto;
      position: relative; overflow: hidden;
      background: #ffffff;
      font-family: 'Raleway', sans-serif;
      flex-shrink: 0;
      transform-origin: top center;
    }

    /* ── BLUE SIDE PANELS ──────────────────────────── */
    .panel {
      position: absolute; top: 0; bottom: 0; width: 88px;
      background: linear-gradient(175deg, #091b52 0%, #1640b2 45%, #0c2478 80%, #091850 100%);
      z-index: 5;
    }
    .panel.l { left: 0; }
    .panel.r { right: 0; }

    /* ── LEFT PANEL DECORATIONS ────────────────────── */
    /* Upward-pointing triangles (mid-left) */
    .lt { position: absolute; left: 50%; transform: translateX(-50%); width: 0; height: 0; }
    .lt1 { top: 190px; border-left: 11px solid transparent; border-right: 11px solid transparent; border-bottom: 18px solid rgba(255,255,255,0.55); }
    .lt2 { top: 213px; border-left: 11px solid transparent; border-right: 11px solid transparent; border-bottom: 18px solid rgba(255,255,255,0.3); }
    .lt3 { top: 236px; border-left: 11px solid transparent; border-right: 11px solid transparent; border-bottom: 18px solid rgba(255,255,255,0.14); }
    /* Tech circuit lines bottom-left */
    .lcirc { position: absolute; left: 8px; bottom: 105px; }
    .lc-line { width: 58px; height: 1px; background: rgba(255,255,255,0.22); margin-bottom: 6px; }
    .lc-dot { width: 6px; height: 6px; border-radius: 50%; background: rgba(255,255,255,0.35); margin-bottom: 7px; }
    .lc-sm { width: 35px; height: 1px; background: rgba(255,255,255,0.15); margin-bottom: 5px; }
    /* Small sparkle top-left */
    .l-star { position: absolute; top: 20px; left: 50%; transform: translateX(-50%); color: rgba(255,255,255,0.7); font-size: 16px; line-height: 1; }

    /* ── RIGHT PANEL DECORATIONS ───────────────────── */
    /* Downward-pointing triangles */
    .rt { position: absolute; right: 50%; transform: translateX(50%); width: 0; height: 0; }
    .rt1 { top: 300px; border-left: 10px solid transparent; border-right: 10px solid transparent; border-top: 16px solid rgba(255,255,255,0.5); }
    .rt2 { top: 322px; border-left: 10px solid transparent; border-right: 10px solid transparent; border-top: 16px solid rgba(255,255,255,0.28); }
    .rt3 { top: 344px; border-left: 10px solid transparent; border-right: 10px solid transparent; border-top: 16px solid rgba(255,255,255,0.13); }
    /* Dot cluster */
    .rdot { position: absolute; border-radius: 50%; background: rgba(255,255,255,0.22); }
    .rd1 { right: 20px; top: 440px; width: 7px; height: 7px; }
    .rd2 { right: 30px; top: 453px; width: 4px; height: 4px; }
    .rd3 { right: 16px; top: 462px; width: 5px; height: 5px; }
    .rd4 { right: 34px; top: 470px; width: 3px; height: 3px; }
    .rd5 { right: 22px; top: 478px; width: 6px; height: 6px; }

    /* ── SPARK 2026 LOGO (right panel, top) ────────── */
    .spark-logo {
      position: absolute; top: 14px; right: 3px; z-index: 20;
      border: 1.5px solid rgba(255,255,255,0.65);
      padding: 5px 7px 4px;
    }
    .sp-star-top { font-size: 9px; letter-spacing: 4px; color: rgba(255,255,255,0.75); display: block; text-align: center; margin-bottom: 1px; }
    .sp-row1 { display: flex; align-items: flex-start; justify-content: center; }
    .sp-spa { font-family: 'Cinzel', serif; font-size: 27px; font-weight: 900; color: #fff; letter-spacing: -1px; line-height: 1; }
    .sp-row2 { display: flex; align-items: center; gap: 4px; justify-content: center; }
    .sp-rk  { font-family: 'Cinzel', serif; font-size: 27px; font-weight: 900; color: #fff; line-height: 1; }
    .sp-yrbox { display: flex; flex-direction: column; border: 1.5px solid rgba(255,255,255,0.55); padding: 1px 3px; }
    .sp-yr { font-family: 'Cinzel', serif; font-size: 10px; font-weight: 900; color: #fff; line-height: 1.15; text-align: center; }
    .sp-tag { font-family: 'Raleway', sans-serif; font-size: 4.5px; color: rgba(255,255,255,0.7); letter-spacing: 1.2px; text-transform: uppercase; text-align: center; margin-top: 2px; }

    /* ── BLUE ACCENT BARS (top/bottom of white area) ─ */
    .acc-top { position: absolute; top: 0;    left: 88px; right: 88px; height: 5px; background: #0c2368; z-index: 6; }
    .acc-bot { position: absolute; bottom: 0; left: 88px; right: 88px; height: 5px; background: #0c2368; z-index: 6; }

    /* ── WHITE AREA BORDER FRAMES ──────────────────── */
    .frm-out { position: absolute; top: 5px; left: 88px; right: 88px; bottom: 5px; border: 2.5px solid #0c2368; z-index: 6; pointer-events: none; }
    .frm-in  { position: absolute; top: 12px; left: 95px; right: 95px; bottom: 12px; border: 1px solid rgba(12,35,104,0.2); z-index: 6; pointer-events: none; }

    /* ── CORNER ANGULAR ACCENTS ────────────────────── */
    /* Bottom-left and bottom-right blue triangles */
    .ca-bl {
      position: absolute; bottom: 5px; left: 88px; z-index: 7;
      width: 135px; height: 68px;
      background: linear-gradient(120deg, #0c2368, #1640b2);
      clip-path: polygon(0 100%, 100% 100%, 0 0);
    }
    .ca-br {
      position: absolute; bottom: 5px; right: 88px; z-index: 7;
      width: 135px; height: 68px;
      background: linear-gradient(60deg, #0c2368, #1640b2);
      clip-path: polygon(100% 100%, 0 100%, 100% 0);
    }
    /* Top-left small triangle */
    .ca-tl {
      position: absolute; top: 5px; left: 88px; z-index: 7;
      width: 80px; height: 40px;
      background: linear-gradient(140deg, #0c2368, #1640b2);
      clip-path: polygon(0 0, 100% 0, 0 100%);
    }

    /* ── CONTENT ───────────────────────────────────── */
    .content {
      position: relative; z-index: 10;
      display: flex; flex-direction: column; align-items: center;
      padding: 22px 108px 34px;
    }

    /* Logos row */
    .logos-row { display: flex; align-items: center; gap: 10px; margin-bottom: 5px; }
    .logo-img { width: 64px; height: 64px; border-radius: 50%; object-fit: cover; border: 2px solid #0c2368; }

    /* Org headings */
    .org-main { font-family: 'Cinzel', serif; font-size: 13px; font-weight: 700; letter-spacing: 2.5px; color: #0c2368; text-align: center; margin-bottom: 4px; }
    .parish-row { display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 2px; }
    .parish-line { width: 52px; height: 1.5px; background: #0c2368; }
    .parish-text { font-family: 'Cinzel', serif; font-size: 9px; font-weight: 600; letter-spacing: 3px; color: #0c2368; }
    .youth-text { font-family: 'Cinzel', serif; font-size: 9px; font-weight: 600; letter-spacing: 3px; color: #0c2368; text-align: center; margin-bottom: 5px; }

    /* CERTIFICATE */
    .cert-ttl { font-family: 'Cinzel', serif; font-size: 72px; font-weight: 900; letter-spacing: 5px; color: #0c2368; line-height: 1; margin-bottom: 0; }

    /* OF PARTICIPATION */
    .of-row { display: flex; align-items: center; justify-content: center; gap: 14px; width: 100%; margin-bottom: 6px; }
    .of-line { flex: 1; max-width: 115px; height: 1.5px; background: #0c2368; }
    .of-txt { font-family: 'Cinzel', serif; font-size: 13px; font-weight: 600; letter-spacing: 5px; color: #0c2368; }

    /* Script sub-heading */
    .certifies-txt { font-family: 'Dancing Script', cursive; font-size: 17px; color: #3659a0; margin-bottom: 1px; }

    /* Participant name */
    .pname { font-family: 'Dancing Script', cursive; font-size: 58px; font-weight: 700; color: #0c2368; line-height: 1.05; text-align: center; margin-bottom: 1px; }

    /* Name underline with diamond */
    .name-ul { display: flex; align-items: center; width: 62%; margin: 0 auto 8px; }
    .name-ul-l { flex: 1; height: 1.5px; background: #0c2368; }
    .name-ul-d { width: 10px; height: 10px; border: 1.5px solid #0c2368; transform: rotate(45deg); flex-shrink: 0; margin-left: 8px; }

    /* Description */
    .desc { font-family: 'Raleway', sans-serif; font-size: 11.5px; font-weight: 500; color: #222; text-align: center; max-width: 590px; line-height: 1.85; margin-bottom: 6px; }
    .desc strong { color: #0c2368; font-weight: 700; }

    /* Footer */
    .footer { width: 100%; display: flex; align-items: flex-end; justify-content: space-between; margin-top: 16px; padding: 0 8px; }

    .sig-block { text-align: center; width: 218px; }
    .sig-sign { font-family: 'Dancing Script', cursive; font-size: 31px; font-weight: 700; color: #0c2368; line-height: 1.2; margin-bottom: 3px; }
    .sig-hr { width: 100%; height: 1px; background: #666; margin-bottom: 4px; }
    .sig-name { font-family: 'Cinzel', serif; font-size: 9px; font-weight: 700; color: #0c2368; letter-spacing: 0.3px; margin-bottom: 2px; }
    .sig-role { font-size: 9.5px; color: #444; margin-bottom: 1px; }
    .sig-org  { font-size: 9.5px; font-weight: 700; color: #0c2368; }

    /* Seal */
    .seal-wrap { display: flex; flex-direction: column; align-items: center; }
    .seal {
      width: 108px; height: 108px; border-radius: 50%;
      background: radial-gradient(circle at 40% 36%, #2459cc, #0b1f62);
      border: 2.5px solid #2459cc;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      box-shadow: 0 0 0 5px rgba(28,64,185,0.13), 0 5px 24px rgba(10,25,90,0.45);
      position: relative; text-align: center;
    }
    .seal::before { content: ''; position: absolute; inset: 5px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.22); }
    .seal-i { z-index: 1; }
    .s-stars { font-size: 8px; letter-spacing: 3px; color: rgba(255,255,255,0.6); display: block; margin-bottom: 1px; }
    .s-one    { font-family: 'Cinzel', serif; font-size: 9px; font-weight: 700; letter-spacing: 2px; color: #fff; display: block; }
    .s-spark  { font-family: 'Cinzel', serif; font-size: 13px; font-weight: 900; letter-spacing: 2px; color: #fff; display: block; }
    .s-endl   { font-family: 'Cinzel', serif; font-size: 9px; font-weight: 700; letter-spacing: 2px; color: #fff; display: block; }
    .s-impact { font-family: 'Cinzel', serif; font-size: 13px; font-weight: 900; letter-spacing: 2px; color: #fff; display: block; }
    /* Ribbon tabs */
    .seal-ribbons { display: flex; gap: 8px; margin-top: 2px; }
    .rib { width: 0; height: 0; border-left: 12px solid transparent; border-right: 12px solid transparent; border-top: 18px solid #0c2368; }

    @media print {
      body { background: white; }
      .cert { box-shadow: none; }
    }
  </style>
</head>
<body>
<div class="cert-wrapper">
<div class="cert">

  <!-- ── BLUE LEFT PANEL ───────────────────────── -->
  <div class="panel l">
    <div class="l-star">✦</div>
    <div class="lt lt1"></div>
    <div class="lt lt2"></div>
    <div class="lt lt3"></div>
    <div class="lcirc">
      <div class="lc-line"></div>
      <div class="lc-dot"></div>
      <div class="lc-sm"></div>
      <div class="lc-line"></div>
      <div class="lc-dot"></div>
    </div>
  </div>

  <!-- ── BLUE RIGHT PANEL ──────────────────────── -->
  <div class="panel r">
    <!-- SPARK 2026 logo -->
    <div class="spark-logo">
      <span class="sp-star-top">★ ★ ★</span>
      <div class="sp-row1"><span class="sp-spa">SPA</span></div>
      <div class="sp-row2">
        <span class="sp-rk">RK</span>
        <div class="sp-yrbox">
          <span class="sp-yr">20</span>
          <span class="sp-yr">26</span>
        </div>
      </div>
      <div class="sp-tag">ONE SPARK. ENDLESS IMPACT</div>
    </div>
    <div class="rt rt1"></div>
    <div class="rt rt2"></div>
    <div class="rt rt3"></div>
    <div class="rdot rd1"></div>
    <div class="rdot rd2"></div>
    <div class="rdot rd3"></div>
    <div class="rdot rd4"></div>
    <div class="rdot rd5"></div>
  </div>

  <!-- ── BLUE ACCENT BARS & BORDERS ───────────── -->
  <div class="acc-top"></div>
  <div class="acc-bot"></div>
  <div class="frm-out"></div>
  <div class="frm-in"></div>

  <!-- ── CORNER ANGULAR ACCENTS ────────────────── -->
  <div class="ca-tl"></div>
  <div class="ca-bl"></div>
  <div class="ca-br"></div>

  <!-- ══ CONTENT ══════════════════════════════════ -->
  <div class="content">

    <!-- Logos -->
    <div class="logos-row">
      <img src="${rccgLogoUrl}" alt="RCCG" class="logo-img" />
      <img src="${yayaLogoUrl}" alt="YAYA" class="logo-img" />
    </div>

    <!-- Org text -->
    <div class="org-main">THE REDEEMED CHRISTIAN CHURCH OF GOD</div>
    <div class="parish-row">
      <div class="parish-line"></div>
      <div class="parish-text">LIGHT HOUSE PARISH</div>
      <div class="parish-line"></div>
    </div>
    <div class="youth-text">YOUNG YOUTHS &amp; ADULTS</div>

    <!-- Main title -->
    <div class="cert-ttl">CERTIFICATE</div>
    <div class="of-row">
      <div class="of-line"></div>
      <div class="of-txt">OF PARTICIPATION</div>
      <div class="of-line"></div>
    </div>

    <div class="certifies-txt">This certifies that</div>

    <!-- Participant name -->
    <div class="pname">${request.certificateName}</div>
    <div class="name-ul">
      <div class="name-ul-l"></div>
      <div class="name-ul-d"></div>
    </div>

    <!-- Body text -->
    <div class="desc">
      has actively participated in the <strong>SPARK 2026 – Port Harcourt Youth Business &amp; Career Summit</strong>
      held on <strong>27th June, 2026</strong> in Port Harcourt.<br/>
      Your participation contributes to building a generation of purpose, leadership and impact.
    </div>

    <!-- ── FOOTER ──────────────────────────────── -->
    <div class="footer">

      <!-- Left: Capt. Henry signature -->
      <div class="sig-block">
        <div class="sig-sign">Okobaundu</div>
        <div class="sig-hr"></div>
        <div class="sig-name">CAPT. HENRY UNGBUKU OKOBAUNDU</div>
        <div class="sig-role">Group Managing Director</div>
        <div class="sig-org">Pioneer Airlines</div>
      </div>

      <!-- Center: Embossed seal -->
      <div class="seal-wrap">
        <div class="seal">
          <div class="seal-i">
            <span class="s-stars">★ ★ ★</span>
            <span class="s-one">ONE</span>
            <span class="s-spark">SPARK</span>
            <span class="s-endl">ENDLESS</span>
            <span class="s-impact">IMPACT</span>
          </div>
        </div>
        <div class="seal-ribbons">
          <div class="rib"></div>
          <div class="rib"></div>
        </div>
      </div>

      <!-- Right: Kenneth Nwankpa signature -->
      <div class="sig-block">
        <div class="sig-sign">Kenneth Nwankpa</div>
        <div class="sig-hr"></div>
        <div class="sig-name">KENNETH NWANKPA</div>
        <div class="sig-role">Convener</div>
        <div class="sig-org">SPARK 2026</div>
      </div>

    </div><!-- /footer -->
  </div><!-- /content -->

</div><!-- /cert -->
</div><!-- /cert-wrapper -->
<script>
  function scaleCert() {
    var cert = document.querySelector('.cert');
    var wrapper = document.querySelector('.cert-wrapper');
    var vw = window.innerWidth;
    if (vw < 1080) {
      var scale = (vw - 16) / 1060;
      cert.style.transform = 'scale(' + scale + ')';
      cert.style.transformOrigin = 'top center';
      wrapper.style.height = Math.ceil(cert.offsetHeight * scale) + 'px';
    } else {
      cert.style.transform = '';
      cert.style.transformOrigin = '';
      wrapper.style.height = '';
    }
  }
  window.addEventListener('resize', scaleCert);
  document.fonts.ready.then(function() {
    scaleCert();
    setTimeout(function() { window.print(); }, 700);
  });
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
    const html = generateCertificateHTML(request, rccgLogo, yayaLogo);
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
