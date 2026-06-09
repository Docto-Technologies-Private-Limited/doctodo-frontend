"use client";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  CalendarDays,
  HelpCircle,
  LifeBuoy,
  CircleUserRound,
  Bell,
  LogOut,
  X,
  ArrowLeft,
  User,
} from "lucide-react";

// ─── Font scale (matches CSS variables) ──────────────────────────────────────
// --text-xs: 12px   → text-xs
// --text-sm: 14px   → text-sm
// --text-base: 16px → text-base
// --text-lg: 18px   → text-lg
// --text-xl: 20px   → text-xl
// --text-2xl: 24px  → text-2xl
// --text-3xl: 30px  → text-3xl

// Sidebar width constants — must match Sidebar.tsx
const SM_BREAKPOINT     = 640;
const TABLET_BREAKPOINT = 1024;
const SIDEBAR_EXPANDED  = 240;
const SIDEBAR_COLLAPSED = 88;

// ─── Drawer nav items ─────────────────────────────────────────────────────────
const DRAWER_ITEMS = [
  {
    key: "dashboard",
    label: "Home",
    href: "/dashboard",
    icon: <LayoutDashboard size={18} strokeWidth={2} />,
  },
  {
    key: "programme",
    label: "Programme",
    href: "/programme",
    icon: <CalendarDays size={18} strokeWidth={2} />,
  },
  {
    key: "quiz",
    label: "Quiz",
    href: "/quiz",
    icon: <HelpCircle size={18} strokeWidth={2} />,
  },
  {
    key: "support",
    label: "Help & Support",
    href: "/support",
    icon: <LifeBuoy size={18} strokeWidth={2} />,
  },
  {
    key: "myaccount",
    label: "My Account",
    href: "/myaccount",
    icon: <CircleUserRound size={18} strokeWidth={2} />,
  },
  {
    key: "notifications",
    label: "Notifications",
    href: "/notifications",
    badge: 2,
    icon: <Bell size={18} strokeWidth={2} />,
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

// ─── Route meta helper ────────────────────────────────────────────────────────
/**
 * Returns { title, backHref } for the current pathname.
 *
 * Routing rules:
 *
 * Notifications
 *   /notifications            → "Notifications"           (no back)
 *   /notifications/[id]       → "← Notifications"         → /notifications
 *
 * Quiz
 *   /quiz                     → "Quiz"                    (no back)
 *   /quiz/[id]                → "← Quiz Overview"         → /quiz
 *   /quiz/[id]/result         → "← Result"                → /quiz
 *
 * Session (from programme)
 *   /session?tab=live         → "← Live Session"          → /programme?tab=live
 *   /session?tab=archived     → "← Archived Session"      → /programme?tab=archived
 *   /session (no tab)         → "← Session"               → /programme
 *
 * Programme
 *   /programme                → "Programme"               (no back)
 *
 * Everything else keeps original behaviour.
 */
function getRouteInfo(pathname: string, searchParams: URLSearchParams): {
  title: string;
  backHref: string | null;
} {
  // ── Notifications ──────────────────────────────────────────────────────────
  if (pathname === "/notifications") {
    return { title: "Notifications", backHref: null };
  }
  if (pathname.match(/^\/notifications\/.+/)) {
    return { title: "Notifications", backHref: "/notifications" };
  }

  // ── Quiz ───────────────────────────────────────────────────────────────────
  if (pathname === "/quiz") {
    return { title: "Quiz", backHref: null };
  }
  // /quiz/[id]/result  — check more-specific pattern first
  if (pathname.match(/^\/quiz\/.+\/result$/)) {
    return { title: "Result", backHref: "/quiz" };
  }
  // /quiz/[id]
  if (pathname.match(/^\/quiz\/.+/)) {
    return { title: "Quiz Overview", backHref: "/quiz" };
  }

  // ── Session (driven by ?tab= query param set by programme page) ────────────
  if (pathname.startsWith("/session")) {
    const tab = searchParams.get("tab"); // "live" | "archived" | null
    if (tab === "live") {
      return {
        title: "Live Session",
        backHref: "/programme?tab=live",
      };
    }
    if (tab === "archived") {
      return {
        title: "Archived Session",
        backHref: "/programme?tab=archived",
      };
    }
    // Fallback — no tab param
    return { title: "Session", backHref: "/programme" };
  }

  // ── Programme ──────────────────────────────────────────────────────────────
  if (pathname.startsWith("/programme")) {
    return { title: "Programme", backHref: null };
  }

  // ── Other existing routes ──────────────────────────────────────────────────
  if (pathname.startsWith("/support"))       return { title: "Help & Support", backHref: null };
  if (pathname.startsWith("/myaccount"))     return { title: "My Account", backHref: null };
  if (pathname.startsWith("/edit-account"))  return { title: "Edit Account", backHref: "/myaccount" };

  return { title: "Home", backHref: null };
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
  const router = useRouter();

  // Parse search params on the client so we can read ?tab=
  const [searchParams, setSearchParams] = useState<URLSearchParams>(
    () => new URLSearchParams(
      typeof window !== "undefined" ? window.location.search : ""
    )
  );

  useEffect(() => {
    // Keep searchParams in sync whenever the URL changes (client-side navigation).
    setSearchParams(new URLSearchParams(window.location.search));
  }, [pathname]);

  const { title: pageTitle, backHref } = getRouteInfo(pathname, searchParams);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [headerLeft, setHeaderLeft] = useState<number>(() => {
    if (typeof window === "undefined") return SIDEBAR_EXPANDED;
    if (window.innerWidth < SM_BREAKPOINT)     return 0;
    if (window.innerWidth < TABLET_BREAKPOINT) return SIDEBAR_COLLAPSED;
    return SIDEBAR_EXPANDED;
  });

  // ── Single source of truth: sidebar-toggle carries width + mobile flag ─────
  useEffect(() => {
    const handler = (e: Event) => {
      const { width } = (e as CustomEvent).detail;
      setHeaderLeft(width);
    };
    window.addEventListener("sidebar-toggle", handler);
    return () => window.removeEventListener("sidebar-toggle", handler);
  }, []);

  // ── Lock body scroll when drawer open ────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  // ── Close drawer on Escape ────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {/* ════════════════════════════════════════════
          TOP BAR
      ════════════════════════════════════════════ */}
      <header
        style={{ left: headerLeft }}
        className="
          fixed top-0 right-0 z-20
          h-[80px] bg-white border-b border-gray-200
          flex items-center justify-between px-5 sm:px-6
          transition-[left] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
          will-change-[left]
        "
      >
        {/* Left — back button + page title */}
        <div className="flex items-center gap-3">
          {backHref && (
            <button
              onClick={() => router.push(backHref)}
              aria-label="Go back"
              className="
                flex items-center justify-center
                w-8 h-8 rounded-lg
                text-textPrimary
                transition-colors
              "
            >
              <ArrowLeft size={24} strokeWidth={2} />
            </button>
          )}

          <h1 className="font-semibold text-lg md:text-xl lg:text-2xl text-textPrimary">
            {pageTitle}
          </h1>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3 ml-auto">

          {/* Notification bell */}
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
            <Bell size={18} strokeWidth={2} />
            {notificationCount > 0 && (
              <span className="
                absolute -top-0.5 -right-0.5
                w-4 h-4 rounded-full
                bg-primary text-white text-xs font-bold
                flex items-center justify-center
                border-2 border-white
              ">
                {notificationCount}
              </span>
            )}
          </Link>

          {/* User info — md+ only */}
          <div className="hidden md:flex items-center gap-2.5">
            <div className="w-[38px] h-[38px] rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
              <User size={20} strokeWidth={2} color="white" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-gray-900 leading-tight">
                {userName}
              </span>
              <span className="text-xs text-gray-400 leading-tight">
                {userEmail}
              </span>
            </div>
          </div>

          {/* Hamburger — mobile only */}
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
              <span
                className="block w-5 h-0.5 bg-gray-700 rounded-sm origin-center transition-transform duration-[250ms]"
                style={{ transform: drawerOpen ? "translateY(6px) rotate(45deg)" : "none" }}
              />
              <span
                className="block w-5 h-0.5 bg-gray-700 rounded-sm transition-all duration-200"
                style={{ opacity: drawerOpen ? 0 : 1, transform: drawerOpen ? "scaleX(0)" : "scaleX(1)" }}
              />
              <span
                className="block w-5 h-0.5 bg-gray-700 rounded-sm origin-center transition-transform duration-[250ms]"
                style={{ transform: drawerOpen ? "translateY(-6px) rotate(-45deg)" : "none" }}
              />
            </span>
          </button>
        </div>
      </header>

      {/* ════════════════════════════════════════════
          DRAWER — slides from the RIGHT (mobile only)
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
              <User size={22} strokeWidth={2} color="white" />
            </div>
            <div>
              <div className="font-body font-bold text-sm text-white leading-tight">
                {userName}
              </div>
              <div className="font-body text-xs text-white/60 mt-0.5">
                {userEmail}
              </div>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={() => setDrawerOpen(false)}
            aria-label="Close menu"
            className="
              w-7 h-7 rounded-full
              bg-white/10 hover:bg-white/20
              flex items-center justify-center
              text-white/80 hover:text-white
              transition-colors flex-shrink-0
            "
          >
            <X size={14} strokeWidth={2.2} />
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
                    <span className="
                      bg-primary text-white text-xs font-bold rounded-full
                      w-4 h-4 flex items-center justify-center
                    ">
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
            href="auth/login"
            className="
              flex items-center gap-3 w-full px-4 py-2.5
              rounded-lg bg-red-50 hover:bg-red-100
              text-[#c0222a] font-body text-sm font-semibold
              border border-red-200 no-underline transition-colors
            "
          >
            <LogOut size={16} strokeWidth={2.5} />
            Log Out
          </Link>
        </div>
      </div>
    </>
  );
}