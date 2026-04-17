"use client";

import Link from "next/link";
import Image from "next/image";
import {
  WelcomeModal,
  CompleteProfileModal,
  useDashboardModals,
} from "@/app/component/DashboardModal";

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

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const modals = useDashboardModals();

  return (
    <>
      {/* ── Content Wrapper ── */}
      <div className="space-y-6 ">

           {/* ── Welcome ── */}
        <div>
          <p className="text-base font-semibold text-gray-800">
            Welcome Back, <strong className="text-secondary">David Joe</strong>
          </p>
          <p className="text-sm text-gray-500 mt-0.5">
            Here&apos;s a list of the upcoming Programmes on Neuropathy Management.
          </p>
        </div>

        {/* ── Ad Banner ── */}
        <div className="w-full rounded-[15px] overflow-hidden">
          {/* Desktop & Tablet */}
          <Image
            src="/images/ads/desktop_banner.jpg"
            alt="Meganeuron – Your Trusted Partner in the management of Neuropathy"
            width={1200}
            height={250}
            priority
            className="hidden md:block w-full h-[220px] object-cover"
          />
          {/* Mobile */}
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

      <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-6 mt-5">
       
        {/* ── Upcoming Live Sessions ── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-800">Upcoming Live Sessions</h2>
            <Link href="/sessions" className="text-sm font-semibold text-secondary no-underline hover:underline">
              View All
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            {SESSIONS.map(({ id, monthYear, day, dayLabel, title, timeRange }) => (
              <div
                key={id}
                className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 px-4 py-3.5 bg-white border border-gray-200 rounded-xl transition-shadow duration-200 hover:shadow-md"
              >
                {/* Date badge + Info row */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {/* Date badge */}
                  <div className="w-[62px] min-w-[62px] h-[68px] bg-secondary rounded-lg flex flex-col items-center justify-center flex-shrink-0">
                    <span className="text-[0.65rem] font-semibold text-white/75 tracking-wider uppercase">
                      {monthYear}
                    </span>
                    <span className="text-[1.6rem] font-extrabold text-white leading-none font-display">
                      {day}
                    </span>
                    <span className="text-[0.65rem] font-semibold text-white/65 tracking-wider uppercase">
                      {dayLabel}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[0.9rem] font-semibold text-gray-900 leading-snug">
                      {title}
                    </p>
                   <span className="inline-flex items-center gap-1.5 mt-1.5 bg-lightBg rounded-full 
                    px-2 py-1 text-xs 
                    sm:px-2.5 sm:py-1 sm:text-[0.72rem] 
                    text-secondary font-medium whitespace-nowrap">
                      
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>

                      {timeRange}
                    </span>
                  </div>
                </div>

                {/* CTA */}
                <Link
                  href="#"
                  className="block text-center bg-primary text-white font-semibold no-underline hover:brightness-90 transition-all rounded-lg sm:rounded-md w-full sm:w-auto px-5 py-2.5 sm:py-2 text-sm sm:text-[0.82rem] flex-shrink-0"
                >
                  View
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* ── Modal triggers ── */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-gray-200">
          <span className="text-xs text-gray-400">Modals:</span>
          <button
            suppressHydrationWarning
            onClick={modals.openWelcome}
            className="text-xs text-secondary underline hover:no-underline"
          >
            Open Welcome Modal
          </button>
          <span className="text-gray-300 text-xs">|</span>
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