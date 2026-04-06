"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Tab = "live" | "archived";

// ─── Live Sessions Data ───────────────────────────────────────────────────────
const LIVE_SESSIONS = [
  {
    id: 1,
    title: "Clinical Case Studies on Neuropathy",
    monthYear: "Feb 2026",
    day: "12",
    dayLabel: "Thursday",
    timeRange: "03:00 PM – 07:00 PM IST",
    agenda: [
      { id: 1, time: "03:00 – 03:45 PM", title: "Diabetic Neuropathy Progression: From Detecting of Diabetes To Diagnosis of Diabetic foot ulcer", speaker: "Dr. Ashu Rastogi" },
      { id: 2, time: "03:45 – 04:30 PM", title: "Spectrum of Neuropathy, Clinical Presentation: Small fiber + Autonomic neuropathy", speaker: "Dr. Sanjeev Kelkar" },
      { id: 3, time: "04:30 – 05:15 PM", title: "Diagnostic Points – Progression of Neuropathy from Small nerve fiber damage to large nerve fibers", speaker: "Dr. David Chandy" },
      { id: 4, time: "05:15 – 05:30 PM", title: "Tea Break", speaker: null },
      { id: 5, time: "05:30 – 06:15 PM", title: "Diabetic Peripheral Neuropathy, Impact on foot leading to foot ulcer. How to prevent it", speaker: "Dr. Arun Bal" },
      { id: 6, time: "06:15 – 07:00 PM", title: "Panel Discussion and Q&A", speaker: null },
    ],
    speakers: [
      { id: 1, name: "Dr. Arun Bal",     photo: "/images/doctors/arun-bal.jpg" },
      { id: 2, name: "Dr. Ashu Rastogi", photo: "/images/doctors/ashu-rastogi.jpg" },
    ],
    panelists: [
      { id: 1, name: "Dr. David Chandy",   photo: "/images/doctors/david-chandy.jpg" },
      { id: 2, name: "Dr. Sanjeev Kelkar", photo: "/images/doctors/sanjeev-kelkar.jpg" },
    ],
  },
  {
    id: 2,
    title: "Advanced Neuropathy Diagnosis",
    monthYear: "Feb 2026",
    day: "13",
    dayLabel: "Friday",
    timeRange: "04:30 PM – 06:30 PM IST",
    agenda: [
      { id: 7, time: "04:30 – 05:15 PM", title: "Diagnostic Points – Progression of Neuropathy from Small nerve fiber damage to large nerve fibers", speaker: "Dr. David Chandy" },
      { id: 8, time: "05:15 – 05:30 PM", title: "Tea Break", speaker: null },
      { id: 9, time: "05:30 – 06:30 PM", title: "Case-Based Learning: Neuropathy in Clinical Practice", speaker: "Dr. Sanjeev Kelkar" },
    ],
    speakers: [
      { id: 3, name: "Dr. David Chandy", photo: "/images/doctors/david-chandy.jpg" },
    ],
    panelists: [
      { id: 4, name: "Dr. Sanjeev Kelkar", photo: "/images/doctors/sanjeev-kelkar.jpg" },
    ],
  },
  {
    id: 3,
    title: "Diabetic Foot & Prevention",
    monthYear: "Feb 2026",
    day: "14",
    dayLabel: "Saturday",
    timeRange: "05:30 PM – 07:00 PM IST",
    agenda: [
      { id: 10, time: "05:30 – 06:15 PM", title: "Diabetic Peripheral Neuropathy, Impact on foot leading to foot ulcer. How to prevent it", speaker: "Dr. Arun Bal" },
      { id: 11, time: "06:15 – 07:00 PM", title: "Panel Discussion and Q&A", speaker: null },
    ],
    speakers: [
      { id: 5, name: "Dr. Arun Bal", photo: "/images/doctors/arun-bal.jpg" },
    ],
    panelists: [
      { id: 6, name: "Dr. Sanjeev Kelkar", photo: "/images/doctors/sanjeev-kelkar.jpg" },
      { id: 7, name: "Dr. David Chandy",   photo: "/images/doctors/david-chandy.jpg" },
    ],
  },
];

// ─── Archive Sessions Data ────────────────────────────────────────────────────
const ARCHIVE_SESSIONS = [
  {
    id: 101,
    title: "Foundations of Neuropathy Care",
    monthYear: "Jan 2026",
    day: "18",
    dayLabel: "Sunday",
    timeRange: "03:00 PM – 06:00 PM IST",
    agenda: [
      { id: 201, time: "03:00 – 03:45 PM", title: "Understanding Peripheral Neuropathy: Causes and Pathophysiology", speaker: "Dr. Arun Bal" },
      { id: 202, time: "03:45 – 04:30 PM", title: "Early Diagnosis and Screening Tools for Neuropathy", speaker: "Dr. Ashu Rastogi" },
      { id: 203, time: "04:30 – 04:45 PM", title: "Tea Break", speaker: null },
      { id: 204, time: "04:45 – 06:00 PM", title: "Panel Discussion: Challenges in Real-World Neuropathy Management", speaker: null },
    ],
    speakers: [
      { id: 101, name: "Dr. Arun Bal",     photo: "/images/doctors/arun-bal.jpg" },
      { id: 102, name: "Dr. Ashu Rastogi", photo: "/images/doctors/ashu-rastogi.jpg" },
    ],
    panelists: [
      { id: 103, name: "Dr. David Chandy",   photo: "/images/doctors/david-chandy.jpg" },
      { id: 104, name: "Dr. Sanjeev Kelkar", photo: "/images/doctors/sanjeev-kelkar.jpg" },
    ],
  },
  {
    id: 102,
    title: "Neuropathic Pain Management",
    monthYear: "Dec 2025",
    day: "14",
    dayLabel: "Sunday",
    timeRange: "02:00 PM – 05:00 PM IST",
    agenda: [
      { id: 205, time: "02:00 – 02:45 PM", title: "Pharmacological Approaches to Neuropathic Pain", speaker: "Dr. Sanjeev Kelkar" },
      { id: 206, time: "02:45 – 03:30 PM", title: "Non-Pharmacological Strategies: Physiotherapy and Lifestyle", speaker: "Dr. David Chandy" },
      { id: 207, time: "03:30 – 05:00 PM", title: "Interactive Case Reviews and Q&A", speaker: null },
    ],
    speakers: [
      { id: 105, name: "Dr. Sanjeev Kelkar", photo: "/images/doctors/sanjeev-kelkar.jpg" },
    ],
    panelists: [
      { id: 106, name: "Dr. David Chandy", photo: "/images/doctors/david-chandy.jpg" },
    ],
  },
];

// ─── DoctorAvatar, PlayIcon, EmptyState, SessionCard, SessionsTab ─────────────
 
// ─── Doctor Avatar ────────────────────────────────────────────────────────────
function DoctorAvatar({ photo, name }: { photo: string; name: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-[72px] h-[72px] sm:w-[80px] sm:h-[80px] rounded-xl overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
        <Image
          src={photo}
          alt={name}
          width={80}
          height={80}
          className="w-full h-full object-cover"
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
        />
      </div>
      <span className="text-[0.65rem] sm:text-[0.72rem] text-gray-700 font-medium text-center leading-tight max-w-[80px]">
        {name}
      </span>
    </div>
  );
}

// ─── Play Icon ────────────────────────────────────────────────────────────────
const PlayIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="12" r="10" fill="white" fillOpacity="0.25" />
    <polygon points="10,8 17,12 10,16" fill="white" />
  </svg>
);

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 8v13H3V8" />
        <path d="M1 3h22v5H1z" />
        <path d="M10 12h4" />
      </svg>
      <p className="mt-3 text-xs sm:text-sm font-medium">No {label} found</p>
    </div>
  );
}

// ─── Session Card ─────────────────────────────────────────────────────────────
type SessionType = typeof LIVE_SESSIONS[0];

function SessionCard({
  session,
  isOpen,
  onToggle,
  ctaLabel,
}: {
  session: SessionType;
  isOpen: boolean;
  onToggle: () => void;
  ctaLabel: string;
}) {
  return (
    <div className="rounded-2xl overflow-hidden transition-all duration-200 border border-gray-200">
      {/* ── Clickable header row ── */}
      <div
        onClick={onToggle}
        className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-5 cursor-pointer select-none"
      >
        {/* Date badge + title */}
        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
          {/* Date badge */}
          <div className="w-[60px] min-w-[60px] h-[68px] sm:w-[68px] sm:min-w-[68px] sm:h-[76px] bg-secondary rounded-xl flex flex-col items-center justify-center flex-shrink-0 p-1.5">
            <span className="text-[0.52rem] sm:text-[0.58rem] font-semibold text-white/70 tracking-wider uppercase leading-none">
              {session.monthYear}
            </span>
            <span className="text-[1.75rem] sm:text-[2rem] font-extrabold text-white leading-none mt-0.5 font-display">
              {session.day}
            </span>
            <span className="text-[0.52rem] sm:text-[0.58rem] font-semibold text-white/70 tracking-wider uppercase leading-none mt-0.5">
              {session.dayLabel}
            </span>
          </div>

          {/* Title + time pill */}
          <div className="flex-1 min-w-0">
            <h3 className="text-[0.82rem] sm:text-[0.95rem] font-bold text-gray-900 leading-snug">
              {session.title}
            </h3>
            <span className="inline-flex items-center gap-1.5 mt-1.5 bg-blue-50 rounded-full px-2 sm:px-2.5 py-1 text-[0.65rem] sm:text-[0.72rem] text-blue-500 font-medium whitespace-nowrap">
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              {session.timeRange}
            </span>
          </div>
        </div>

        {/* CTA */}
        <div
          className="w-full sm:w-auto flex-shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <Link
            href="#"
            className="
              flex items-center justify-center gap-2
              w-full sm:w-auto
              px-4 py-2 sm:px-5 sm:py-2.5
              bg-primary text-white rounded-lg
              text-xs sm:text-sm font-bold no-underline
              hover:brightness-90 transition-all whitespace-nowrap
            "
          >
            <PlayIcon />
            {ctaLabel}
          </Link>
        </div>
      </div>

      {/* ── Expandable body ── */}
      {isOpen && (
        <div className="px-3 sm:px-5 pb-4 sm:pb-5 pt-1 space-y-4 sm:space-y-5 border-t border-gray-100">

          {/* Agenda Timeline */}
          <div className="relative pt-4">
            <div className="absolute left-[5px] top-6 bottom-0 w-px bg-gray-200" />
            <div className="space-y-0">
              {session.agenda.map(({ id, time, title, speaker }) => (
                <div key={id} className="relative flex gap-3 sm:gap-5 pb-4 sm:pb-5 last:pb-0">
                  <div className="mt-[5px] flex-shrink-0">
                    <div className="w-[11px] h-[11px] rounded-full bg-secondary border-2 border-white ring-1 ring-secondary z-2 relative" />
                  </div>
                  <div className="flex flex-col sm:flex-row sm:gap-6 flex-1 min-w-0">
                    <span className="text-[0.7rem] sm:text-[0.78rem] font-semibold text-gray-500 whitespace-nowrap sm:w-[128px] flex-shrink-0 leading-snug">
                      {time}
                    </span>
                    <div className="mt-0.5 sm:mt-0 flex-1">
                      <p className="text-[0.78rem] sm:text-[0.85rem] font-semibold text-gray-900 leading-snug">{title}</p>
                      {speaker && (
                        <p className="text-[0.7rem] sm:text-[0.78rem] text-gray-500 mt-0.5">– {speaker}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Speakers & Panelists */}
          <div className="border border-gray-200 rounded-xl p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">

              {/* Speakers */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ED1C24" strokeWidth="2" strokeLinecap="round">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" y1="19" x2="12" y2="23" />
                    <line x1="8" y1="23" x2="16" y2="23" />
                  </svg>
                  <span className="text-xs sm:text-sm font-bold text-gray-800">Speakers</span>
                </div>
                <div className="flex flex-wrap gap-3 sm:gap-4">
                  {session.speakers.map((s) => <DoctorAvatar key={s.id} {...s} />)}
                </div>
              </div>

              {session.panelists.length > 0 && (
                <>
                  <div className="hidden sm:block w-px bg-gray-100 self-stretch" />
                  <div className="sm:hidden h-px bg-gray-100" />

                  {/* Panelists */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ED1C24" strokeWidth="2" strokeLinecap="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                      <span className="text-xs sm:text-sm font-bold text-gray-800">Panelists</span>
                    </div>
                    <div className="flex flex-wrap gap-3 sm:gap-4">
                      {session.panelists.map((p) => <DoctorAvatar key={p.id} {...p} />)}
                    </div>
                  </div>
                </>
              )}

            </div>
          </div>

        </div>
      )}
    </div>
  );
}

// ─── Sessions Tab ─────────────────────────────────────────────────────────────
function SessionsTab({
  heading,
  sessions,
  ctaLabel,
  emptyLabel,
}: {
  heading: string;
  sessions: SessionType[];
  ctaLabel: string;
  emptyLabel: string;
}) {
  const [openId, setOpenId] = useState<number | null>(sessions[0]?.id ?? null);

  return (
    <div className="space-y-3 sm:space-y-4">
      <h2 className="text-sm sm:text-base font-bold text-gray-800">{heading}</h2>

      {sessions.length === 0 ? (
        <EmptyState label={emptyLabel} />
      ) : (
        <div className="space-y-2 sm:space-y-3">
          {sessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              isOpen={openId === session.id}
              onToggle={() => setOpenId(openId === session.id ? null : session.id)}
              ctaLabel={ctaLabel}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ProgrammePage() {
  const [activeTab, setActiveTab] = useState<Tab>("live");

  return (
    
      <div className="bg-white border border-gray-200 rounded-2xl p-3 sm:p-5 space-y-4 sm:space-y-5">

        <h1 className="text-base sm:text-xl font-bold text-gray-900">Programme</h1>

        <div className="inline-flex rounded-xl bg-lightBg p-1 gap-1">
          <button
            suppressHydrationWarning
            onClick={() => setActiveTab("live")}
            className={`px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 ${
              activeTab === "live"
                ? "bg-secondary text-white shadow-sm"
                : "text-gray-600 hover:text-gray-800 bg-transparent"
            }`}
          >
            Live Sessions
          </button>
          <button
            suppressHydrationWarning
            onClick={() => setActiveTab("archived")}
            className={`px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 ${
              activeTab === "archived"
                ? "bg-secondary text-white shadow-sm"
                : "text-gray-600 hover:text-gray-800 bg-transparent"
            }`}
          >
            archived Sessions
          </button>
        </div>

        {activeTab === "live" ? (
          <SessionsTab
            heading="Live Sessions"
            sessions={LIVE_SESSIONS}
            ctaLabel="Watch Live Now"
            emptyLabel="live sessions"
          />
        ) : (
          <SessionsTab
            heading="Archived Sessions"
            sessions={ARCHIVE_SESSIONS}
            ctaLabel="Watch Recording"
            emptyLabel="archive sessions"
          />
        )}

      </div> 
  );
}