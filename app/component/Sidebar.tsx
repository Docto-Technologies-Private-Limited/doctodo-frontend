"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useLayoutEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import {
  Home,
  LayoutGrid,
  Puzzle,
  CircleHelp,
  UserRound,
  Bell,
  ChevronRight,
  ChevronLeft,
  LogOut,
} from "lucide-react";

// ─── Nav items config ─────────────────────────────────────────────────────────
const NAV_ITEMS = [
  {
    key: "dashboard",
    label: "Home",
    href: "/dashboard",
    icon: <Home size={20} strokeWidth={1.75} />,
  },
  {
    key: "programme",
    label: "Programme",
    href: "/programme",
    icon: <LayoutGrid size={20} strokeWidth={1.75} />,
  },
  {
    key: "quiz",
    label: "Quiz",
    href: "/quiz",
    icon: <Puzzle size={20} strokeWidth={1.75} />,
  },
  {
    key: "support",
    label: "Help & Support",
    href: "/support",
    icon: <CircleHelp size={20} strokeWidth={1.75} />,
  },
  {
    key: "myaccount",
    label: "My Account",
    href: "/myaccount",
    icon: <UserRound size={20} strokeWidth={1.75} />,
  },
  {
    key: "notifications",
    label: "Notifications",
    href: "/notifications",
    badge: 0,
    icon: <Bell size={20} strokeWidth={1.75} />,
  },
];

const BOTTOM_NAV_KEYS = ["dashboard", "programme", "quiz", "myaccount"];

const SM_BREAKPOINT = 640;
const SIDEBAR_EXPANDED = 240;
const SIDEBAR_COLLAPSED = 88;
const TABLET_BREAKPOINT = 1024;

function shouldCollapse() {
  if (typeof window === "undefined") return false;
  return window.innerWidth < TABLET_BREAKPOINT;
}

export default function Sidebar() {
  const pathname = usePathname();
  const activeKey = pathname === "/" ? "dashboard" : pathname.replace("/", "");

  const [collapsed, setCollapsed] = useState<boolean>(() => shouldCollapse());

  const emitToggle = useCallback((isCollapsed: boolean) => {
    const mobile = window.innerWidth < SM_BREAKPOINT;
    window.dispatchEvent(
      new CustomEvent("sidebar-toggle", {
        detail: {
          collapsed: isCollapsed,
          mobile,
          width: mobile ? 0 : isCollapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED,
        },
      })
    );
  }, []);

  useLayoutEffect(() => {
    const initial = shouldCollapse();
    setCollapsed(initial);
    emitToggle(initial);
  }, [emitToggle]);

  useEffect(() => {
    let prevCollapsed = shouldCollapse();
    let prevMobile = window.innerWidth < SM_BREAKPOINT;

    const onResize = () => {
      const nextCollapsed = shouldCollapse();
      const nextMobile = window.innerWidth < SM_BREAKPOINT;

      if (nextCollapsed !== prevCollapsed || nextMobile !== prevMobile) {
        prevCollapsed = nextCollapsed;
        prevMobile = nextMobile;
        setCollapsed(nextCollapsed);
        emitToggle(nextCollapsed);
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [emitToggle]);

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
      {/* ── Flow spacer ── */}
      <div
        aria-hidden="true"
        className="hidden sm:block flex-shrink-0 transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[width]"
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
          transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[width]
        "
        aria-label="Main navigation"
      >
        {/* ── Logo ── */}
        <div
          className={`
            flex items-center border-b border-gray-200
            flex-shrink-0 min-h-[80px] overflow-hidden transition-all duration-300
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

        {/* ── Collapse / Expand toggle ── */}
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
          {collapsed
            ? <ChevronRight size={12} strokeWidth={2.5} className="text-gray-500" />
            : <ChevronLeft  size={12} strokeWidth={2.5} className="text-gray-500" />
          }
        </button>

        {/* ── Nav links ── */}
        <nav
          className={`
            flex-1 py-3 overflow-y-auto overflow-x-hidden transition-opacity duration-200
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
                  ${collapsed
                    ? "flex-col gap-1 px-1 py-3 mx-1 my-0.5 rounded-lg justify-center text-xs"
                    : "flex-row gap-3 px-5 py-3 text-sm justify-start"
                  }
                  ${isActive
                    ? "text-primary bg-primaryLight font-semibold"
                    : "text-textPrimary hover:bg-secondaryLight hover:text-secondary font-medium"
                  }
                `}
              >
                {/* Active left bar — expanded only */}
                {isActive && !collapsed && (
                  <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary rounded-r-sm" />
                )}

                {/* Icon */}
                <span className="flex-shrink-0 transition-transform duration-300 ease-out group-hover:scale-110">
                  {icon}
                </span>

                {/* Label */}
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

                {/* Badge */}
                {badge !== undefined && badge > 0 && (
                  <span
                    className={`
                      bg-primary text-white text-xs font-bold rounded-full
                      flex items-center justify-center flex-shrink-0
                      ${collapsed
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
            href="/auth/login"
            title={collapsed ? "Log Out" : undefined}
            className="
              flex items-center justify-center gap-2 w-full py-2.5
              bg-primary text-white rounded-lg
              text-sm font-semibold no-underline
              hover:brightness-90 transition-all overflow-hidden
            "
          >
            <LogOut size={16} strokeWidth={2.5} className="flex-shrink-0" />
            {!collapsed && <span className="whitespace-nowrap">Log Out</span>}
          </Link>
        </div>
      </aside>

      {/* ════════════════════════════════════════════
          MOBILE BOTTOM NAV
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
                  flex-1 flex items-center justify-center
                  text-xs font-medium no-underline transition-all duration-300
                  ${isActive ? "text-primary" : "text-gray-400"}
                `}
              >
                <div
                  className={`
                    flex items-center justify-center gap-1.5
                    transition-all duration-300
                    ${isActive
                      ? "bg-primary/10 text-primary rounded-full px-2 py-1.5"
                      : "py-1.5"
                    }
                  `}
                >
                  {icon}

                  {/* ✅ Show label ONLY if active */}
                  {isActive && (
                    <span className="text-sm font-medium whitespace-nowrap">
                      {label}
                    </span>
                  )}
                </div>
              </Link>
            );
          }
        )}
      </nav>
    </>
  );
}