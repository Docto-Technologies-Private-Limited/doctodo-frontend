"use client";
import { Mic2, Users, UserCheck, PlayCircle, Clock, Archive } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

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
      { id: 1, name: "Dr. Arun Bal",     photo: "/images/faculty/demo_faculty.jpg" },
      { id: 2, name: "Dr. Ashu Rastogi", photo: "/images/faculty/demo_faculty.jpg" },
    ],
    panelists: [
      { id: 1, name: "Dr. David Chandy",   photo: "/images/faculty/demo_faculty.jpg" },
      { id: 2, name: "Dr. Sanjeev Kelkar", photo: "/images/faculty/demo_faculty.jpg" },
    ],
    moderatorlists: [
      { id: 1, name: "Dr. David Chandy",   photo: "/images/faculty/demo_faculty.jpg" },
      { id: 2, name: "Dr. Sanjeev Kelkar", photo: "/images/faculty/demo_faculty.jpg" },
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
      { id: 3, name: "Dr. David Chandy", photo: "/images/faculty/demo_faculty.jpg" },
    ],
    panelists: [
      { id: 4, name: "Dr. Sanjeev Kelkar", photo: "/images/faculty/demo_faculty.jpg" },
    ],
    moderatorlists: [],
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
      { id: 5, name: "Dr. Arun Bal", photo: "/images/faculty/demo_faculty.jpg" },
    ],
    panelists: [
      { id: 6, name: "Dr. Sanjeev Kelkar", photo: "/images/faculty/demo_faculty.jpg" },
      { id: 7, name: "Dr. David Chandy",   photo: "/images/faculty/demo_faculty.jpg" },
    ],
    moderatorlists: [],
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
      { id: 101, name: "Dr. Arun Bal",     photo: "/images/faculty/demo_faculty.jpg" },
      { id: 102, name: "Dr. Ashu Rastogi", photo: "/images/faculty/demo_faculty.jpg" },
    ],
    panelists: [
      { id: 103, name: "Dr. David Chandy",   photo: "/images/faculty/demo_faculty.jpg" },
      { id: 104, name: "Dr. Sanjeev Kelkar", photo: "/images/faculty/demo_faculty.jpg" },
    ],
    moderatorlists: [],
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
      { id: 105, name: "Dr. Sanjeev Kelkar", photo: "/images/faculty/demo_faculty.jpg" },
    ],
    panelists: [
      { id: 106, name: "Dr. David Chandy", photo: "/images/faculty/demo_faculty.jpg" },
    ],
    moderatorlists: [],
  },
];

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
      <span className="text-xs text-textSecondary font-medium text-center leading-tight max-w-[80px]">
        {name}
      </span>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-textSecondary">
      <Archive size={48} strokeWidth={1.5} />
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
  activeTab,
}: {
  session: SessionType;
  isOpen: boolean;
  onToggle: () => void;
  ctaLabel: string;
  activeTab: Tab;
}) {
  return (
    <div className="rounded-2xl overflow-hidden border border-gray-200 transition-shadow duration-200">

      {/* ── Clickable header row ── */}
      <div
        onClick={onToggle}
        className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-5 cursor-pointer select-none"
      >
        {/* Date badge + title */}
        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">

          {/* Date badge */}
          <div className="flex-shrink-0 w-[80px] h-[84px] bg-secondary rounded-xl flex flex-col items-center justify-center flex-shrink-0 p-2.5">
            <span className="text-xs font-semibold text-white/70 tracking-wide leading-none">
              {session.monthYear}
            </span>
            <span className="text-2xl font-extrabold text-white leading-tight mt-0.5">
              {session.day}
            </span>
            <span className="text-xs font-bold text-white/70 tracking-widest uppercase leading-none mt-0.5">
              {session.dayLabel}
            </span>
          </div>

          {/* Title + time pill */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm md:text-base lg:text-base font-semibold text-textSecondary leading-snug">
              {session.title}
            </h3>
            <span className="inline-flex items-center gap-1.5 mt-1.5 bg-welcomeLight rounded-full px-2 sm:px-2.5 py-1 text-[9px] md:text-xs lg:text-xs text-secondary font-medium whitespace-nowrap">
              <Clock size={10} />
              {session.timeRange}
            </span>
          </div>
        </div>

        {/* Right side: CTA + chevron */}
        <div className="flex items-center gap-2 flex-shrink-0 flex-row-reverse sm:flex-row">
          <div onClick={(e) => e.stopPropagation()}>
            <Link
              href={`/session?tab=${activeTab}`}
              className="
                flex items-center justify-center gap-2
                w-full sm:w-auto
                px-4 py-2 sm:px-5 sm:py-2.5
                bg-primary text-white rounded-lg
                text-xs sm:text-sm font-bold no-underline
                hover:brightness-90 transition-all whitespace-nowrap
              "
            >
              <PlayCircle size={16} />
              {ctaLabel}
            </Link>
          </div>
        </div>

      </div>

      {/* ── Expandable body ── */}
      <div
        className={`
          grid transition-all duration-300 ease-in-out
          ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}
        `}
      >
        <div className="overflow-hidden">
          <div className="px-3 sm:px-5 pb-4 sm:pb-5 pt-1 space-y-4 sm:space-y-5 border-t border-gray-100">

            {/* Agenda Timeline */}
            <div className="relative pt-4">
              <div className="absolute left-[5px] top-6 bottom-0 w-px bg-lightBg" />
              <div className="space-y-0">
                {session.agenda.map(({ id, time, title, speaker }) => (
                  <div key={id} className="relative flex gap-3 sm:gap-5 pb-4 sm:pb-5 last:pb-0">
                    <div className="mt-[5px] flex-shrink-0">
                      <div className="w-[11px] h-[11px] rounded-full bg-secondary border-2 border-white ring-1 ring-secondary relative z-10" />
                    </div>
                    <div className="flex flex-col sm:flex-row sm:gap-6 flex-1 min-w-0">
                      <span className="text-xs md:text-sm lg:text-sm text-secondary whitespace-nowrap sm:w-[128px] flex-shrink-0 leading-snug">
                        {time}
                      </span>
                      <div className="mt-0.5 sm:mt-0 flex-1">
                        <p className="text-xs md:text-sm lg:text-sm font-semibold text-textPrimary leading-snug">{title}</p>
                        {speaker && (
                          <p className="text-xs text-textSecondary font-medium mt-0.5">– {speaker}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Speakers & Panelists */}
            <div className="border border-lightBg rounded-xl p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">

                {/* Speakers */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <Mic2 size={18} className="text-primary" />
                    <span className="text-sm md:text-sm lg:text-sm font-semibold text-textSecondary">Speakers</span>
                  </div>
                  <div className="flex flex-wrap gap-3 sm:gap-4">
                    {session.speakers.map((s) => <DoctorAvatar key={s.id} {...s} />)}
                  </div>
                </div>

                {session.panelists.length > 0 && (
                  <>
                    <div className="hidden sm:block w-px bg-lightBg self-stretch" />
                    <div className="sm:hidden h-px bg-lightBg" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <Users size={18} className="text-primary" />
                        <span className="text-sm md:text-sm lg:text-sm font-semibold text-textSecondary">Panel List</span>
                      </div>
                      <div className="flex flex-wrap gap-3 sm:gap-4">
                        {session.panelists.map((p) => <DoctorAvatar key={p.id} {...p} />)}
                      </div>
                    </div>
                  </>
                )}

                {session.moderatorlists.length > 0 && (
                  <>
                    <div className="hidden sm:block w-px bg-lightBg self-stretch" />
                    <div className="sm:hidden h-px bg-lightBg" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <UserCheck size={18} className="text-primary" />
                        <span className="text-sm md:text-sm lg:text-sm font-semibold text-textSecondary">Moderator</span>
                      </div>
                      <div className="flex flex-wrap gap-3 sm:gap-4">
                        {session.moderatorlists.map((p) => <DoctorAvatar key={p.id} {...p} />)}
                      </div>
                    </div>
                  </>
                )}

              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}

// ─── Sessions Tab ─────────────────────────────────────────────────────────────
function SessionsTab({
  sessions,
  ctaLabel,
  emptyLabel,
  activeTab,
}: {
  sessions: SessionType[];
  ctaLabel: string;
  emptyLabel: string;
  activeTab: Tab;
}) {
  const [openId, setOpenId] = useState<number | null>(sessions[0]?.id ?? null);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-3 sm:p-5 space-y-4 sm:space-y-5">
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
              activeTab={activeTab}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ProgrammePage() {
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState<Tab>(() => {
    const t = searchParams.get("tab");
    return t === "archived" ? "archived" : "live";
  });

  return (
    <>
      <div className="inline-flex rounded-sm bg-lightBg p-1 gap-1 mb-8 border border-gray-500">
        <button
          suppressHydrationWarning
          onClick={() => setActiveTab("live")}
          className={`px-4 sm:px-5 py-1.5 sm:py-2 text-xs md:text-sm font-semibold rounded-sm transition-all duration-200 ${
            activeTab === "live"
              ? "bg-secondary text-white shadow-sm"
              : "text-textPrimary hover:text-textPrimary bg-transparent"
          }`}
        >
          Live Sessions
        </button>
        <button
          suppressHydrationWarning
          onClick={() => setActiveTab("archived")}
          className={`px-4 sm:px-5 py-1.5 sm:py-2 text-xs md:text-sm font-semibold rounded-sm transition-all duration-200 ${
            activeTab === "archived"
              ? "bg-secondary text-white shadow-sm"
              : "text-textPrimary hover:text-textPrimary bg-transparent"
          }`}
        >
          Archived Sessions
        </button>
      </div>

      {activeTab === "live" ? (
        <>
          <h2 className="text-base md:text-xl lg:text-xl font-semibold text-textPrimary py-4">Live Sessions</h2>
          <SessionsTab
            sessions={LIVE_SESSIONS}
            ctaLabel="Watch Live Now"
            emptyLabel="live sessions"
            activeTab={activeTab}
          />
        </>
      ) : (
        <>
          <h2 className="text-base md:text-xl lg:text-xl font-semibold text-textPrimary py-4">Archived Sessions</h2>
          <SessionsTab
            sessions={ARCHIVE_SESSIONS}
            ctaLabel="Watch Recording"
            emptyLabel="archive sessions"
            activeTab={activeTab}
          />
        </>
      )}
    </>
  );
}