"use client";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

// ─── Secondary (icon) Logo ────────────────────────────────────────────────────
const SecondaryLogo = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="18" cy="18" r="17" stroke="#0A3458" strokeWidth="1.5" fill="white" />
    <circle cx="12" cy="14" r="3" fill="#ED1C24" />
    <circle cx="18" cy="10" r="2.5" fill="#0A3458" />
    <circle cx="24" cy="14" r="3" fill="#84BCDA" />
    <circle cx="12" cy="22" r="2.5" fill="#84BCDA" />
    <circle cx="18" cy="26" r="3" fill="#0A3458" />
    <circle cx="24" cy="22" r="2.5" fill="#ED1C24" />
    <text x="18" y="19.5" textAnchor="middle" fontFamily="Raleway,sans-serif" fontSize="7" fontWeight="800" fill="#0A3458">NT</text>
  </svg>
);

// ─── Drawer nav items ─────────────────────────────────────────────────────────
const DRAWER_ITEMS = [
  {
    key: "dashboard", label: "Dashboard", href: "/dashboard",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
  },
  {
    key: "programme", label: "Programme", href: "/programme",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>,
  },
  {
    key: "quiz", label: "Quiz", href: "/quiz",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>,
  },
  {
    key: "support", label: "Help & Support", href: "/support",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></svg>,
  },
  {
    key: "account", label: "My Account", href: "/account",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
  },
  {
    key: "notifications", label: "Notifications", href: "/notifications", badge: 2,
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>,
  },
];

// ─── Props ────────────────────────────────────────────────────────────────────
interface TopBarProps {
  title?: string;
  userName?: string;
  userEmail?: string;
  notificationCount?: number;
  activeKey?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function TopBar({
  title = "Dashboard",
  userName = "David Joe",
  userEmail = "david@meganeuron.com",
  notificationCount = 2,
  activeKey = "dashboard",
}: TopBarProps) {

  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(240);

  const router = useRouter();

  const getPageTitle = () => {
    if (pathname.startsWith("/programme/live")) return "Live Session";
    if (pathname.startsWith("/programme/archived")) return "Archived Session";
    if (pathname.startsWith("/programme")) return "Programme";
    if (pathname.startsWith("/quiz")) return "Quiz";
    if (pathname.startsWith("/support")) return "Help & Support";
    if (pathname.startsWith("/account")) return "My Account";
    return "Dashboard";
  };

  const showBack = pathname.includes("/programme/live") || pathname.includes("/programme/archived");

  const handleBack = () => {
    router.push("/programme"); // ALWAYS go to parent
  };

  // Track sidebar width changes
  useEffect(() => {
    const handler = (e: Event) => {
      setSidebarWidth((e as CustomEvent).detail.width);
    };
    window.addEventListener("sidebar-toggle", handler);
    return () => window.removeEventListener("sidebar-toggle", handler);
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setDrawerOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {/* ════════════════════════════════════════════
          TOP BAR
      ════════════════════════════════════════════ */}
      <header
        className="
            fixed top-0 left-0 right-0 z-5
            h-[80px] bg-white border-b border-gray-200
            flex items-center justify-between px-5 sm:px-6
          "
      >
        {/* Left */}
        {/* <div className="flex items-center gap-3">
          <Link href="/" className="sm:hidden" aria-label="Meganeuron NT">
            <SecondaryLogo />
          </Link>
        </div> */}

        <div className="flex items-center gap-3">

          {showBack && (
            <button
              onClick={handleBack}
              className="text-textPrimary hover:text-primary"
            >
              ←
            </button>
          )}

          <h1 className="font-semibold text-2xl text-textPrimary">
            {showBack ? `${getPageTitle()}` : getPageTitle()}
          </h1>

        </div>

        {/* Right */}
        <div className="flex items-center gap-3 ml-auto">

          {/* Notification bell — all breakpoints */}
          <Link
            href="/notifications"
            aria-label={`Notifications${notificationCount ? `, ${notificationCount} unread` : ""}`}
            className="
              relative w-9 h-9 rounded-full
              flex items-center justify-center
              bg-gray-100 hover:bg-gray-200
              text-gray-500 transition-colors
            "
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {notificationCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary text-white text-[9px] font-bold flex items-center justify-center border-2 border-white">
                {notificationCount}
              </span>
            )}
          </Link>

          {/* User info — all breakpoints */}
          <div className="hidden md:flex items-center gap-2.5">
            <div className="w-[38px] h-[38px] rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>

            <div className="flex flex-col">
              <span className="text-[0.85rem] font-bold text-gray-900 leading-tight">
                {userName}
              </span>
              <span className="text-[0.75rem] text-gray-400 leading-tight">
                {userEmail}
              </span>
            </div>
          </div>

          {/* ── Hamburger — MOBILE ONLY (hidden on sm+) ── */}
          <button
            onClick={() => setDrawerOpen((p) => !p)}
            aria-label={drawerOpen ? "Close menu" : "Open menu"}
            aria-expanded={drawerOpen}
            aria-controls="topbarDrawer"
            className="
              sm:hidden
              flex items-center justify-center
              w-[38px] h-[38px] rounded-lg
              bg-transparent hover:bg-gray-100
              cursor-pointer transition-colors flex-shrink-0
            "
          >
            <span className="relative flex flex-col justify-between w-5 h-3.5" aria-hidden="true">
              <span className="block w-5 h-0.5 bg-gray-700 rounded-sm origin-center transition-transform duration-[250ms]"
                style={{ transform: drawerOpen ? "translateY(6px) rotate(45deg)" : "none" }} />
              <span className="block w-5 h-0.5 bg-gray-700 rounded-sm transition-all duration-200"
                style={{ opacity: drawerOpen ? 0 : 1, transform: drawerOpen ? "scaleX(0)" : "scaleX(1)" }} />
              <span className="block w-5 h-0.5 bg-gray-700 rounded-sm origin-center transition-transform duration-[250ms]"
                style={{ transform: drawerOpen ? "translateY(-6px) rotate(-45deg)" : "none" }} />
            </span>
          </button>
        </div>
      </header>

      {/* ════════════════════════════════════════════
          DRAWER — slides from the RIGHT
          Mobile only (hamburger only shows on mobile)
      ════════════════════════════════════════════ */}

      {/* Overlay */}
      <div
        aria-hidden="true"
        onClick={() => setDrawerOpen(false)}
        className={`
          fixed inset-0 bg-black/45 z-[200]
          transition-opacity duration-300
          ${drawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
      />

      {/* Drawer panel */}
      <div
        id="topbarDrawer"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        aria-hidden={!drawerOpen}
        className={`
          fixed top-0 right-0 h-full w-[280px]
          bg-white z-[201] flex flex-col shadow-2xl
          transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
          ${drawerOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Drawer header */}
        <div className="bg-secondary px-5 pt-6 pb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center flex-shrink-0 border-2 border-white/25">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div>
              <div className="font-body font-bold text-[14px] text-white leading-tight">{userName}</div>
              <div className="font-body text-[11px] text-white/60 mt-0.5">{userEmail}</div>
            </div>
          </div>
          {/* Close X */}
          <button
            onClick={() => setDrawerOpen(false)}
            aria-label="Close menu"
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors flex-shrink-0"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <line x1="1" y1="1" x2="13" y2="13" />
              <line x1="13" y1="1" x2="1" y2="13" />
            </svg>
          </button>
        </div>

        {/* Drawer nav */}
        <nav className="flex-1 overflow-y-auto py-3">
          {DRAWER_ITEMS.map(({ key, label, href, icon, badge }, idx) => {
            const isActive = pathname.startsWith(href);
            const showDivider = idx === 3;
            return (
              <div key={key}>
                {showDivider && <div className="h-px bg-gray-100 my-2 mx-4" />}
                <Link
                  href={href}
                  onClick={() => setDrawerOpen(false)}
                  className={`
                    flex items-center gap-3.5 px-5 py-3
                    font-body text-sm no-underline transition-colors
                    border-l-[3px]
                    ${isActive
                      ? "font-semibold text-secondary bg-blue-50 border-primary"
                      : "font-medium text-gray-700 hover:bg-primaryLight hover:text-primary border-transparent"
                    }
                  `}
                >
                  {icon}
                  <span className="flex-1">{label}</span>
                  {badge !== undefined && badge > 0 && (
                    <span className="bg-primary text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                      {badge}
                    </span>
                  )}
                </Link>
              </div>
            );
          })}
        </nav>

        {/* Drawer logout */}
        <div className="p-4 border-t border-gray-200">
          <Link
            href="/login"
            className="
              flex items-center gap-3 w-full px-4 py-2.5
              rounded-lg bg-red-50 hover:bg-red-100
              text-[#c0222a] font-body text-sm font-semibold
              border border-red-200 no-underline transition-colors
            "
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Log Out
          </Link>
        </div>
      </div>
    </>
  );
}