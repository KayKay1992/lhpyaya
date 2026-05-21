/* ─────────────────────────────────────────────
   Shared loading spinners used across the app
   ───────────────────────────────────────────── */

/**
 * Full-page spinner – use when an entire page is loading
 * (e.g. fetching a single record before the page can render)
 */
export const PageSpinner = ({ label = "Loading…" }) => (
  <div className="min-h-screen bg-linear-to-br from-orange-50 via-white to-amber-50 flex flex-col items-center justify-center gap-6">
    <div className="relative w-20 h-20">
      {/* outer track */}
      <div className="absolute inset-0 rounded-full border-4 border-orange-100" />
      {/* spinning arc */}
      <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#ff9324] animate-spin" />
      {/* inner glowing dot */}
      <div className="absolute inset-[6px] rounded-full bg-white shadow-inner flex items-center justify-center">
        <div className="w-4 h-4 rounded-full bg-[#ff9324] animate-pulse" />
      </div>
    </div>
    <div className="text-center">
      <p className="text-base font-semibold text-gray-700 animate-pulse">
        {label}
      </p>
      <p className="text-xs text-gray-400 mt-1">Please wait a moment…</p>
    </div>
  </div>
);

/**
 * Section spinner – use inside a page where only a data section is loading
 * (e.g. event lists, registrant tables)
 */
export const SectionSpinner = ({ label = "Loading…" }) => (
  <div className="flex flex-col items-center justify-center py-24 gap-5">
    <div className="relative w-14 h-14">
      <div className="absolute inset-0 rounded-full border-4 border-orange-100" />
      <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#ff9324] animate-spin" />
      <div className="absolute inset-[5px] rounded-full bg-orange-50 flex items-center justify-center">
        <div className="w-3 h-3 rounded-full bg-[#ff9324] animate-pulse" />
      </div>
    </div>
    <p className="text-sm font-medium text-gray-400 animate-pulse">{label}</p>
  </div>
);

/**
 * Button spinner – use inside submit/action buttons while a request is in-flight.
 * Renders a tiny spinning SVG + a label, so the button keeps its size.
 */
export const ButtonSpinner = ({ label = "Loading…" }) => (
  <span className="inline-flex items-center justify-center gap-2">
    <svg
      className="animate-spin h-4 w-4 flex-shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
    {label}
  </span>
);
