"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";

// ─── Nav items config ─────────────────────────────────────────────────────────
const NAV_ITEMS = [
  {
    key: "dashboard",
    label: "Dashboard",
    href: "/dashboard",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    key: "programme",
    label: "Programme",
    href: "/programme",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8"  y1="2" x2="8"  y2="6" />
        <line x1="3"  y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    key: "quiz",
    label: "Quiz",
    href: "/quiz",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
  {
    key: "support",
    label: "Help & Support",
    href: "/support",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4M12 16h.01" />
      </svg>
    ),
  },
  {
    key: "myaccount",
    label: "My Account",
    href: "/myaccount",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    key: "notifications",
    label: "Notifications",
    href: "/notifications",
    badge: 2,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
  },
];

const BOTTOM_NAV_KEYS = ["dashboard", "programme", "quiz", "myaccount"];

const SIDEBAR_EXPANDED = 240;
const SIDEBAR_COLLAPSED = 88;
const TABLET_BREAKPOINT = 1024; // px — collapse automatically below this

// ─── Helper: compute the "should be collapsed" state from window width ─────────
function shouldCollapse() {
  if (typeof window === "undefined") return false;
  return window.innerWidth < TABLET_BREAKPOINT;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function Sidebar() {
  const pathname = usePathname();
  const activeKey = pathname === "/" ? "dashboard" : pathname.replace("/", "");

  // Initialise collapsed state correctly on first render (SSR-safe default: false)
  const [collapsed, setCollapsed] = useState(false);

  // Emit a sidebar-toggle event so consuming pages can update their margin
  const emitToggle = useCallback((isCollapsed: boolean) => {
    window.dispatchEvent(
      new CustomEvent("sidebar-toggle", {
        detail: {
          collapsed: isCollapsed,
          width: isCollapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED,
        },
      })
    );
  }, []);

  // On mount: set correct collapsed state based on viewport, then emit
  useEffect(() => {
    const initial = shouldCollapse();
    setCollapsed(initial);
    emitToggle(initial);
  }, [emitToggle]);

  // On resize: recalculate collapsed state and emit if it changed
  useEffect(() => {
    let prev = shouldCollapse();

    const onResize = () => {
      const next = shouldCollapse();
      if (next !== prev) {
        prev = next;
        setCollapsed(next);
        emitToggle(next);
      }
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [emitToggle]);

  // Manual toggle (collapse button)
  const toggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    emitToggle(next);
  };

  const sidebarWidth = collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED;

  const SecondaryLogo = () => (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="18" cy="18" r="17" stroke="#0A3458" strokeWidth="1.5" fill="white" />
      <circle cx="12" cy="14" r="3"   fill="#ED1C24" />
      <circle cx="18" cy="10" r="2.5" fill="#0A3458" />
      <circle cx="24" cy="14" r="3"   fill="#84BCDA" />
      <circle cx="12" cy="22" r="2.5" fill="#84BCDA" />
      <circle cx="18" cy="26" r="3"   fill="#0A3458" />
      <circle cx="24" cy="22" r="2.5" fill="#ED1C24" />
      <text x="18" y="19.5" textAnchor="middle" fontFamily="Raleway,sans-serif" fontSize="7" fontWeight="800" fill="#0A3458">NT</text>
    </svg>
  );

  return (
    <>
      {/* ════════════════════════════════════════════
          DESKTOP + TABLET SIDEBAR  (hidden on mobile)
          
          KEY FIX: We render TWO elements side-by-side:
            1. The fixed <aside> — the actual sidebar panel
            2. A non-fixed <div> spacer — same width, pushes content
               (this replaces the marginLeft approach in pages and
                is the canonical solution to the "ghost white-space" bug)
          
          Since the spacer lives in the normal flow it correctly fills
          the space that the fixed sidebar occupies, and transitions
          in sync so there's never a stale margin value.
      ════════════════════════════════════════════ */}

      {/* ── Flow spacer (same width as sidebar, pushes page content) ── */}
      {/*
        This invisible div sits in normal document flow and is always
        the exact same width as the fixed sidebar. Pages that used
        a JS-driven marginLeft state can simply remove that logic and
        rely on this spacer instead. Either approach works; the spacer
        is the simplest and most reliable.
      */}
      <div
        aria-hidden="true"
        className="hidden sm:block flex-shrink-0 transition-[width,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[width,transform]"
        style={{ width: sidebarWidth }}
      />

      {/* ── Fixed sidebar panel ── */}
      <aside
        style={{ width: sidebarWidth }}
        className="
          fixed top-0 left-0 bottom-0 z-30
          hidden sm:flex flex-col
          bg-white border-r border-gray-200
          overflow-visible
          transition-[width,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[width,transform]
        "
        aria-label="Main navigation"
      >
        {/* ── Logo ── */}
        <div
          className={`
            flex items-center border-b border-gray-200
            flex-shrink-0 min-h-[80px] overflow-hidden
            transition-all duration-300
            ${collapsed ? "justify-center px-3" : "justify-start px-5"}
          `}
        >
          <div
            className="transition-all duration-300 ease-out delay-150 flex items-center"
            style={{ width: collapsed ? 40 : 160, height: 40 }}
          >
            {collapsed ? (
              <SecondaryLogo />
            ) : (
              <Image
                src="/images/logo/test_logo.png"
                alt="Meganeuron NT"
                width={160}
                height={40}
                className="object-contain object-left w-full h-full transition-all duration-300"
                priority
              />
            )}
          </div>
        </div>

        {/* ── Collapse / Expand toggle button ── */}
        <button
          onClick={toggle}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="
            absolute top-[88px] right-[-12px]
            w-7 h-7
            bg-white border border-gray-300 rounded-full
            flex items-center justify-center
            shadow-md hover:bg-gray-50
            transition-all duration-300 ease-out hover:scale-110 active:scale-95
            z-50
          "
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#6b7280"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {collapsed ? (
              <polyline points="9 18 15 12 9 6" />
            ) : (
              <polyline points="15 18 9 12 15 6" />
            )}
          </svg>
        </button>

        {/* ── Nav links ── */}
        <nav
            className={`
              flex-1 py-3 overflow-y-auto overflow-x-hidden
              transition-opacity duration-200
              ${collapsed ? "opacity-90" : "opacity-100"}
            `}
          >
          {NAV_ITEMS.map(({ key, label, href, badge, icon }) => {
            const isActive = activeKey === key;
            return (
              <Link
                key={key}
                href={href}
                title={collapsed ? label : undefined}
                className={`
                  group relative flex items-center no-underline transition-all duration-300 ease-out
                  ${
                    collapsed
                      ? "flex-col gap-1 px-1 py-3 mx-1 my-0.5 rounded-lg justify-center text-[10px]"
                      : "flex-row gap-3 px-5 py-3 text-[0.83rem] justify-start"
                  }
                  ${
                    isActive
                      ? "text-primary bg-red-50 font-semibold"
                      : "text-gray-500 hover:bg-gray-50 hover:text-secondary font-medium"
                  }
                `}
              >
                {isActive && !collapsed && (
                  <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary rounded-r-sm" />
                )}

                <span className="flex-shrink-0 transition-transform duration-300 ease-out group-hover:scale-110">{icon}</span>

                <span
                    className={`
                      transition-all duration-300 ease-out whitespace-nowrap
                      ${collapsed
                        ? "text-[10px] text-center leading-tight max-w-[60px]"
                        : "truncate flex-1"
                      }
                    `}
                  >
                  {label}
                </span>

                {badge !== undefined && badge > 0 && (
                  <span
                    className={`
                      bg-primary text-white text-[9px] font-bold rounded-full
                      flex items-center justify-center flex-shrink-0
                      ${
                        collapsed
                          ? "absolute top-1.5 right-1.5 w-4 h-4"
                          : "w-auto h-auto px-1.5 py-px ml-auto"
                      }
                    `}
                  >
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* ── Logout ── */}
        <div
          className={`border-t border-gray-200 flex-shrink-0 transition-all duration-300 ${collapsed ? "p-2" : "p-4"}`}
        >
          <Link
            href="/login"
            title={collapsed ? "Log Out" : undefined}
            className="
              flex items-center justify-center gap-2 w-full py-2.5
              bg-primary text-white rounded-lg
              font-body text-sm font-semibold no-underline
              hover:brightness-90 transition-all overflow-hidden
            "
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="flex-shrink-0"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            {!collapsed && <span className="whitespace-nowrap">Log Out</span>}
          </Link>
        </div>
      </aside>

      {/* ════════════════════════════════════════════
          MOBILE BOTTOM NAV  (visible only < sm)
      ════════════════════════════════════════════ */}
      <nav
        className="fixed bottom-0 left-0 right-0 h-[60px] bg-white border-t border-gray-200 z-30 flex sm:hidden"
        aria-label="Mobile navigation"
      >
        {NAV_ITEMS.filter((n) => BOTTOM_NAV_KEYS.includes(n.key)).map(
          ({ key, label, href, icon }) => {
            const isActive = activeKey === key;
            return (
              <Link
                key={key}
                href={href}
                className={`
                  flex-1 flex flex-col items-center justify-center gap-0.5
                  text-[10px] font-medium no-underline transition-colors
                  ${isActive ? "text-primary" : "text-gray-400 hover:text-primary"}
                `}
              >
                <div
                  className={`
                    flex items-center justify-center transition-all
                    ${isActive ? "bg-primary/10 rounded-full px-4 py-1" : "py-1"}
                  `}
                >
                  {icon}
                </div>
                <span>{label}</span>
              </Link>
            );
          }
        )}
      </nav>
    </>
  );
}