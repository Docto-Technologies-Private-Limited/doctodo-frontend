"use client";

import Link from "next/link";
import Image from "next/image";
import {
  WelcomeModal,
  CompleteProfileModal,
  useDashboardModals,
} from "@/app/component/DashboardModal";
import { Clock } from "lucide-react";

// ─── Font scale (CSS variables → Tailwind) ────────────────────────────────────
// --text-xs:   12px → text-xs
// --text-sm:   14px → text-sm
// --text-base: 16px → text-base
// --text-lg:   18px → text-lg
// --text-xl:   20px → text-xl   ← TopBar page title (ceiling)
// --text-2xl:  24px → text-2xl
// --text-3xl:  30px → text-3xl

// ─── Session data ─────────────────────────────────────────────────────────────
const SESSIONS = [
  {
    id: 1,
    monthYear: "Jun 2024",
    day: 22,
    dayLabel: "SAT",
    title: "Clinical Case Studies on Neuropathy",
    timeRange: "03:00 PM – 07:00 PM IST",
  },
  {
    id: 2,
    monthYear: "Jun 2024",
    day: 29,
    dayLabel: "SAT",
    title: "Advances in Neuropathy Treatment",
    timeRange: "04:00 PM – 07:00 PM IST",
  },
  {
    id: 3,
    monthYear: "Jul 2024",
    day: 22,
    dayLabel: "SAT",
    title: "Diabetic Neuropathy Management",
    timeRange: "03:00 PM – 06:00 PM IST",
  },
];

// ─── Session Card ─────────────────────────────────────────────────────────────
function SessionCard({
  monthYear,
  day,
  dayLabel,
  title,
  timeRange,
}: Omit<(typeof SESSIONS)[number], "id">) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-200">

      {/* ── Top row: badge + info + view button (desktop/tablet) ── */}
      <div className="flex items-center gap-4 px-4 py-4">

        {/* Date badge — fixed dimensions, never squishes */}
        <div
          className="
            flex-shrink-0
            w-[72px] h-[76px]
            bg-secondary rounded-xl
            flex flex-col items-center justify-center gap-0
          "
        >
          {/* "Jun 2024" — fits on one line at text-xs */}
          <span className="text-xs font-semibold text-white/70 leading-none tracking-wide">
            {monthYear}
          </span>
          {/* Day number — dominant */}
          <span className="text-2xl font-extrabold text-white leading-tight mt-0.5">
            {day}
          </span>
          {/* Day of week */}
          <span className="text-xs font-bold text-white/70 leading-none tracking-widest uppercase mt-0.5">
            {dayLabel}
          </span>
        </div>

        {/* Info block — title + time chip */}
        <div className="flex-1 min-w-0 flex flex-col gap-1.5">
          <p className="text-sm md:text-base lg:text-base font-semibold text-textSecondary leading-snug">
            {title}
          </p>
          {/* Time chip */}
          <span className="
            inline-flex items-center gap-1.5
            self-start
            bg-welcomeLight rounded-full
            px-1.5 py-1
            text-[9px] md:text-xs lg:text-xs text-secondary
            whitespace-nowrap
          ">
            <Clock size={11} strokeWidth={2.5} className="flex-shrink-0" />
            {timeRange}
          </span>
        </div>

        {/* View button — visible on sm+ (desktop & tablet), hidden on mobile */}
        <Link
          href="#"
          className="
            hidden sm:inline-flex
            flex-shrink-0
            items-center justify-center
            bg-primary text-white
            text-sm font-semibold
            no-underline hover:brightness-90
            transition-all
            rounded-lg
            px-5 py-2.5
            whitespace-nowrap
          "
        >
          View
        </Link>
      </div>

      {/* ── Mobile-only: full-width "View Programme" button ── */}
      <div className="sm:hidden px-4 pb-4">
        <Link
          href="#"
          className="
            flex items-center justify-center w-full
            bg-primary text-white
            text-sm font-semibold
            no-underline hover:brightness-90
            transition-all rounded-lg
            py-3
          "
        >
          View Programme
        </Link>
      </div>

    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const modals = useDashboardModals();

  return (
    <>
      {/* ── Content Wrapper ── */}
      <div className="space-y-6">

        {/* ── Welcome ── */}
        <div>
          <p className="text-base md:text-xl lg:text-xl font-semibold text-textPrimary">
            Welcome Back, <strong className="text-secondary">David Joe</strong>
          </p>
          <p className="text-xs md:text-sm lg:text-sm text-textSecondary mt-0.5">
            Here&apos;s a list of the upcoming Programmes on Neuropathy Management.
          </p>
        </div>

        {/* ── Ad Banner ── */}
        <div className="w-full rounded-[15px] overflow-hidden">
          <Image
            src="/images/ads/desktop_banner.jpg"
            alt="Meganeuron – Your Trusted Partner in the management of Neuropathy"
            width={1200}
            height={250}
            priority
            className="hidden md:block w-full h-[220px] object-cover"
          />
          <Image
            src="/images/ads/mobile_banner.jpg"
            alt="Meganeuron – Your Trusted Partner in the management of Neuropathy"
            width={640}
            height={200}
            priority
            className="block md:hidden w-full h-[180px] object-cover"
          />
        </div>

      </div>

      {/* ── Sessions card ── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-3 mt-5">

        {/* Section header */}
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-base md:text-xl lg:text-xl font-semibold text-textPrimary">Upcoming Live Sessions</h2>
          <Link
            href="/programme"
            className="text-xs lg:text-sm font-semibold text-secondary no-underline hover:underline"
          >
            View All
          </Link>
        </div>

        {/* Cards */}
        <div className="flex flex-col gap-3">
          {SESSIONS.map(({ id, ...rest }) => (
            <SessionCard key={id} {...rest} />
          ))}
        </div>

        {/* ── Modal triggers (dev only) ── */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-gray-100">
          <span className="text-xs text-textSecondary">Modals:</span>
          <button
            suppressHydrationWarning
            onClick={modals.openWelcome}
            className="text-xs text-secondary underline hover:no-underline"
          >
            Open Welcome Modal
          </button>
          <span className="text-textSecondary text-xs">|</span>
          <button
            suppressHydrationWarning
            onClick={modals.openProfile}
            className="text-xs text-primary underline hover:no-underline"
          >
            Open Profile Modal
          </button>
        </div>

      </div>

      {/* ── Modals ── */}
      <WelcomeModal
        isOpen={modals.welcomeOpen}
        onClose={() => modals.setWelcomeOpen(false)}
        onContinue={modals.handleWelcomeContinue}
      />
      <CompleteProfileModal
        isOpen={modals.profileOpen}
        onClose={() => modals.setProfileOpen(false)}
        onSave={(data) => console.log("Profile saved:", data)}
      />
    </>
  );
}