"use client";

import { useState } from "react";

type TabKey = "chat" | "polls" | "quiz";

const SCHEDULE = [
  { time: "03:00 – 03:45 PM", topic: "Diabetic Neuropathy Progression: From Detecting of Diabetes To Diagnosis of Diabetic foot ulcer", speaker: "Dr. Ashu Rastogi" },
  { time: "03:45 – 04:30 PM", topic: "Spectrum of Neuropathy, Clinical Presentation: Small fiber + Autonomic neuropathy", speaker: "Dr. Sanjeev Kelkar" },
  { time: "04:30 – 05:15 PM", topic: "Diagnostic Points – Progression of Neuropathy from Small nerve fiber damage to large nerve fibers", speaker: "Dr. David Chandy" },
  { time: "05:15 – 05:30 PM", topic: "Tea Break", speaker: null },
  { time: "05:30 – 06:15 PM", topic: "Diabetic Peripheral Neuropathy, Impact on foot leading to foot ulcer. How to prevent it", speaker: "Dr. Arun Bai" },
  { time: "06:15 – 07:00 PM", topic: "Panel Discussion and Q&A", speaker: null },
];

const SPEAKERS   = [{ name: "Dr. Arun Bai" }, { name: "Dr. Ashu Rastogi" }];
const PANELISTS  = [{ name: "Dr. David Chandy" }, { name: "Dr. Sanjeev Kelkar" }];
const MODERATORS = [{ name: "Dr. Rajesh" }, { name: "Dr. Vikram" }];

// ─── Topbar height from your layout: mt-[80px] means topbar = 80px ───────────
// Sticky top = topbar height + a small breathing gap (8px)
const STICKY_TOP = "88px"; // 80px topbar + 8px gap
// Panel height = full viewport minus topbar, minus top gap, minus bottom gap

const PANEL_HEIGHT  = "calc(100vh - 104px)"; // = calc(100vh - 104px)
// ─────────────────────────────────────────────────────────────────────────────

function Avatar({ name }: { name: string }) {
  const initials = name.split(" ").map((w) => w[0]).slice(0, 2).join("");
  return (
    <div className="w-14 h-14 rounded-full bg-lightBg border border-gray-200 flex items-center justify-center">
      <span className="text-secondary font-bold text-sm">{initials}</span>
    </div>
  );
}

function PersonCard({ name }: { name: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5 w-[72px]">
      <Avatar name={name} />
      <p className="text-[0.65rem] text-center text-gray-600 leading-tight font-medium">{name}</p>
    </div>
  );
}

function ChatPollsPanel() {
  const [activeTab, setActiveTab] = useState<TabKey>("chat");
  const tabs: { key: TabKey; label: string }[] = [
    { key: "chat",  label: "Chat"  },
    { key: "polls", label: "Polls" },
    { key: "quiz",  label: "Quiz"  },
  ];

  return (
    // h-full is critical — it fills the height given by the sticky container
    <div className="flex flex-col h-full bg-white rounded-xl border border-gray-200 overflow-hidden">

      {/* Header — never scrolls */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 flex-shrink-0">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0A3458" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <span className="text-sm font-bold text-secondary">Chat &amp; Polls</span>
      </div>

      {/* Tabs — never scroll */}
      <div className="flex border-b border-gray-100 flex-shrink-0">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex-1 py-2 text-xs font-semibold transition-colors ${
              activeTab === key
                ? "text-secondary border-b-2 border-secondary"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Body — the ONLY part that scrolls if content overflows */}
      <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center gap-3 p-4 text-center">
        {activeTab === "chat" && (
          <>
            <div className="w-10 h-10 rounded-full bg-lightBg flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0A3458" strokeWidth="1.5">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed max-w-[180px]">
              Join the audience to participate in chat, polls, and quizzes
            </p>
            <div className="w-full mt-2 space-y-2">
              <input
                type="text"
                placeholder="Name"
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-xs focus:outline-none focus:border-secondary"
              />
              <button className="w-full bg-secondary text-white text-xs font-semibold py-2 rounded-md hover:brightness-90 transition-all">
                Join audience
              </button>
              <p className="text-[10px] text-gray-400 leading-tight">
                Or <button className="text-secondary underline">Log in with Vimeo</button>
              </p>
              <p className="text-[9px] text-gray-400 leading-tight">
                Comment you submit through chat is subject to the{" "}
                <span className="text-secondary underline cursor-pointer">Terms of Service</span> and{" "}
                <span className="text-secondary underline cursor-pointer">Privacy Policy</span>.
              </p>
            </div>
          </>
        )}
        {activeTab === "polls" && (
          <>
            <div className="w-10 h-10 rounded-full bg-lightBg flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0A3458" strokeWidth="1.5">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6"  y1="20" x2="6"  y2="14" />
              </svg>
            </div>
            <p className="text-xs text-gray-500">Polls will appear here during the session</p>
          </>
        )}
        {activeTab === "quiz" && (
          <>
            <div className="w-10 h-10 rounded-full bg-lightBg flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0A3458" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <p className="text-xs text-gray-500">Quizzes will appear here during the session</p>
          </>
        )}
      </div>
    </div>
  );
}

export default function LiveSessionPage() {
  return (
    <div className="space-y-4">

      {/* Warning Banner */}
      <div className="flex items-center justify-between gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5">
        <div className="flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <p className="text-xs font-semibold text-amber-700">
            <span className="font-bold">Warning Message: </span>
            Capturing this video to a local machine is Illegal!
          </p>
        </div>
        <button className="flex-shrink-0 bg-amber-500 text-white text-[10px] font-bold px-3 py-1 rounded-md hover:bg-amber-600 transition-colors">
          Got it
        </button>
      </div>

      {/*
        ═══════════════════════════════════════════════════════════════════════
        TWO-COLUMN ROW
        ═══════════════════════════════════════════════════════════════════════
        YOUR LAYOUT: body/html scrolls, <main> has no overflow.
        This means position:sticky works correctly — it scrolls relative
        to the viewport, which IS the body scroll container.

        WHY items-start IS MANDATORY:
        Without it, flexbox stretches both columns to the same height
        (the taller left column). A stretched right column has no room
        to "stick" because it's already as tall as its parent. With
        `items-start`, the right column is only as tall as the sticky
        container itself, so sticky has room to operate.
        ═══════════════════════════════════════════════════════════════════════
      */}
      <div className="flex flex-col lg:flex-row gap-4 lg:items-start">

        {/* ── LEFT: long scrollable content ── */}
        <div className="flex-1 min-w-0 space-y-4">

          {/* Session Header */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h1 className="text-base sm:text-lg font-bold text-gray-900 leading-snug">
                  Clinical Case Studies on Neuropathy
                </h1>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <span className="flex items-center gap-1.5 text-xs text-gray-500">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8"  y1="2" x2="8"  y2="6"/>
                      <line x1="3"  y1="10" x2="21" y2="10"/>
                    </svg>
                    12 Feb 2026
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-gray-500">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    03:00 PM IST – 07:00 PM IST
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 rounded-full px-3 py-1 flex-shrink-0 self-start">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-xs font-bold text-primary">Live Now</span>
              </div>
            </div>
          </div>

          {/* Video Player */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <div className="relative w-full bg-gray-900 flex items-center justify-center" style={{ aspectRatio: "16/9" }}>
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900" />
              <button className="relative z-10 w-14 h-14 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-200 group">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white" className="ml-1 group-hover:scale-110 transition-transform">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </button>
              <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-primary/90 backdrop-blur-sm rounded-full px-2.5 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span className="text-[10px] font-bold text-white uppercase tracking-wide">Live</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 z-10 h-1 bg-white/10">
                <div className="h-full w-[35%] bg-primary rounded-full" />
              </div>
            </div>
          </div>

          {/* Main Banner — desktop */}
          <div className="hidden md:block w-full rounded-xl overflow-hidden border border-gray-100">
            <div className="w-full h-[110px] bg-gradient-to-r from-lightBg via-blue-50 to-lightBg flex items-center justify-between px-8 rounded-xl">
              <p className="text-xs text-gray-500">
                Your <strong className="text-secondary">Trusted Partner</strong> in the management of Neuropathy
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <span className="text-base font-black text-secondary">neuron</span>
                  <span className="text-xs font-extrabold text-primary bg-red-100 px-1 py-0.5 rounded">NT</span>
                </div>
                <div className="h-6 w-px bg-gray-300" />
                <p className="text-xs font-bold text-secondary">Meganeuron OD+</p>
              </div>
            </div>
          </div>

          {/* Main Banner — mobile */}
          <div className="block md:hidden w-full rounded-xl overflow-hidden border border-gray-100">
            <div className="w-full h-[80px] bg-gradient-to-r from-lightBg to-blue-50 flex items-center justify-center px-4 rounded-xl">
              <p className="text-xs text-gray-500 text-center">
                Your <strong className="text-secondary">Trusted Partner</strong> in the management of Neuropathy
              </p>
            </div>
          </div>

          {/* Session Schedule */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0A3458" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8"  y1="2" x2="8"  y2="6"/>
                <line x1="3"  y1="10" x2="21" y2="10"/>
              </svg>
              <h2 className="text-sm font-bold text-gray-800">Session Schedule</h2>
            </div>
            <div className="flex flex-col gap-0">
              {SCHEDULE.map(({ time, topic, speaker }, i) => {
                const isBreak = speaker === null && topic === "Tea Break";
                return (
                  <div key={i} className={`flex gap-4 py-3 ${i < SCHEDULE.length - 1 ? "border-b border-gray-100" : ""}`}>
                    <span className="text-[0.7rem] font-semibold text-secondary whitespace-nowrap pt-0.5 w-[110px] flex-shrink-0">
                      {time}
                    </span>
                    <div className="flex-1 min-w-0">
                      {isBreak ? (
                        <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 text-[0.7rem] font-semibold px-2.5 py-1 rounded-full border border-amber-200">
                          ☕ {topic}
                        </span>
                      ) : (
                        <>
                          <p className="text-[0.78rem] text-gray-800 font-medium leading-snug">{topic}</p>
                          {speaker && <p className="text-[0.7rem] text-gray-400 mt-0.5 italic">– {speaker}</p>}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* People */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-6">
            {/* Speakers */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0A3458" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                <h3 className="text-sm font-bold text-gray-800">Speakers</h3>
              </div>
              <div className="flex flex-wrap gap-4">
                {SPEAKERS.map((s) => <PersonCard key={s.name} name={s.name} />)}
              </div>
            </div>
            <div className="border-t border-gray-100" />
            {/* Panelists */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0A3458" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <line x1="23" y1="11" x2="17" y2="11"/>
                  <line x1="20" y1="8"  x2="20" y2="14"/>
                </svg>
                <h3 className="text-sm font-bold text-gray-800">Panelists</h3>
              </div>
              <div className="flex flex-wrap gap-4">
                {PANELISTS.map((p) => <PersonCard key={p.name} name={p.name} />)}
              </div>
            </div>
            <div className="border-t border-gray-100" />
            {/* Moderators */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0A3458" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                <h3 className="text-sm font-bold text-gray-800">Moderator</h3>
              </div>
              <div className="flex flex-wrap gap-4">
                {MODERATORS.map((m) => <PersonCard key={m.name} name={m.name} />)}
              </div>
            </div>
          </div>

        </div>
        {/* END LEFT */}

        {/* ── RIGHT: sticky sidebar ── */}
        {/*
          position:sticky works here because:
            ✅ Body/html is the scroll container (you confirmed this)
            ✅ No ancestor has overflow:auto / overflow:hidden / overflow:scroll
            ✅ Parent row has `lg:items-start` so this column isn't
               stretched to match the left column's height

          STICKY_TOP = 88px  → clears the 80px fixed topbar + 8px gap
          PANEL_HEIGHT = calc(100vh - 104px)
            = 100vh
            - 80px  (topbar)
            - 8px   (top gap, same as STICKY_TOP overshoot)
            - 16px  (bottom breathing room)

          Inside the sticky div, a flex-col layout:
            • Ad banner    → flex-shrink-0  (fixed height, never compressed)
            • Chat wrapper → flex-1 min-h-0 overflow-hidden
              └─ ChatPollsPanel → h-full flex-col
                   • Header + Tabs → flex-shrink-0
                   • Body          → flex-1 overflow-y-auto  ← only this scrolls
        */}
        <div className="hidden lg:block w-[300px] xl:w-[320px] flex-shrink-0">
          <div
            className="sticky flex flex-col gap-3"
            style={{
              top:    STICKY_TOP,
              height: PANEL_HEIGHT,
            }}
          >

            {/* Ad banner — fixed height, never compresses */}
            <div className="flex-shrink-0 rounded-xl overflow-hidden border border-gray-100">
              <div className="w-full h-[94px] bg-gradient-to-br from-lightBg to-blue-100 flex items-center justify-center px-4">
                <div className="text-center">
                  <p className="text-[9px] font-semibold text-secondary/60 uppercase tracking-widest">Your Trusted Partner</p>
                  <p className="text-[9px] text-secondary/50 mt-0.5">in the management of Neuropathy</p>
                  <div className="flex items-center justify-center gap-1.5 mt-2">
                    <span className="text-sm font-black text-secondary">neuron</span>
                    <span className="text-[10px] font-extrabold text-white bg-primary px-1.5 py-0.5 rounded">NT</span>
                  </div>
                </div>
              </div>
            </div>

            {/*
              flex-1   → fills all remaining height after the ad banner
              min-h-0  → CRITICAL: without this a flex child ignores the
                         parent's constrained height and overflows
              overflow-hidden → hard clips the child panel
            */}
            <div className="flex-1 min-h-0 overflow-hidden">
              <ChatPollsPanel />
            </div>

          </div>
        </div>
        {/* END RIGHT */}

        {/* Mobile: inline below left content */}
        <div className="block lg:hidden w-full space-y-3">
          <div className="flex-shrink-0 rounded-xl overflow-hidden border border-gray-100">
            <div className="w-full h-[94px] bg-gradient-to-br from-lightBg to-blue-100 flex items-center justify-center px-4">
              <div className="text-center">
                <p className="text-[9px] font-semibold text-secondary/60 uppercase tracking-widest">Your Trusted Partner</p>
                <div className="flex items-center justify-center gap-1.5 mt-2">
                  <span className="text-sm font-black text-secondary">neuron</span>
                  <span className="text-[10px] font-extrabold text-white bg-primary px-1.5 py-0.5 rounded">NT</span>
                </div>
              </div>
            </div>
          </div>
          <div style={{ height: "420px" }}>
            <ChatPollsPanel />
          </div>
        </div>

      </div>
    </div>
  );
}