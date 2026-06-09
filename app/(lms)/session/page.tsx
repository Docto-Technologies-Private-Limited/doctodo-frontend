"use client";
import {
  Mic2, Users, UserCheck, Calendar, CalendarDays, Clock,
  AlertTriangle, MessageCircle, BarChart2, HelpCircle,
} from "lucide-react";
import { useState } from "react";

type TabKey = "chat" | "polls" | "quiz";

const SCHEDULE = [
  { time: "03:00 – 03:45 PM", topic: "Diabetic Neuropathy Progression: From Detecting of Diabetes To Diagnosis of Diabetic foot ulcer", speaker: "Dr. Ashu Rastogi" },
  { time: "03:45 – 04:30 PM", topic: "Spectrum of Neuropathy, Clinical Presentation: Small fiber + Autonomic neuropathy", speaker: "Dr. Sanjeev Kelkar" },
  { time: "04:30 – 05:15 PM", topic: "Diagnostic Points – Progression of Neuropathy from Small nerve fiber damage to large nerve fibers", speaker: "Dr. David Chandy" },
  { time: "05:15 – 05:30 PM", topic: "Tea Break", speaker: null },
  { time: "05:30 – 06:15 PM", topic: "Diabetic Peripheral Neuropathy, Impact on foot leading to foot ulcer. How to prevent it", speaker: "Dr. Arun Bal" },
  { time: "06:15 – 07:00 PM", topic: "Panel Discussion and Q&A", speaker: null },
];

const SPEAKERS = [{ name: "Dr. Arun Bal" }, { name: "Dr. Ashu Rastogi" }];
const PANELISTS = [{ name: "Dr. David Chandy" }, { name: "Dr. Sanjeev Kelkar" }];
const MODERATORS = [{ name: "Dr. Rajesh" }, { name: "Dr. Vikram" }];

// ── Doctor Avatar ──────────────────────────────────────────────────────────────
function DoctorAvatar({ name }: { name: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-[64px] h-[64px] sm:w-[72px] sm:h-[72px] rounded-xl overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
        <img
          src="/images/faculty/demo_faculty.jpg"
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      <span className="text-xs text-textSecondary font-medium text-center leading-tight max-w-[80px]">
        {name}
      </span>
    </div>
  );
}

// ── Chat & Polls Panel ─────────────────────────────────────────────────────────
function ChatPollsPanel() {
  const [activeTab, setActiveTab] = useState<TabKey>("chat");
  const tabs: { key: TabKey; label: string }[] = [
    { key: "chat",  label: "Chat"  },
    { key: "polls", label: "Polls" },
    { key: "quiz",  label: "Quiz"  },
  ];

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 flex-shrink-0">
        <MessageCircle size={16} className="text-secondary" strokeWidth={2} />
        <span className="text-sm font-bold text-secondary">Chat &amp; Polls</span>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 flex-shrink-0">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex-1 py-2 text-xs font-semibold transition-colors ${
              activeTab === key
                ? "text-secondary border-b-2 border-secondary"
                : "text-textSecondary hover:text-textSecondary"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center gap-3 p-4 text-center">
        {activeTab === "chat" && (
          <>
            <div className="w-10 h-10 rounded-full bg-lightBg flex items-center justify-center">
              <MessageCircle size={18} className="text-secondary" strokeWidth={1.5} />
            </div>
            <p className="text-xs text-textSecondary leading-relaxed max-w-[180px]">
              Join the audience to participate in chat, polls, and quizzes
            </p>
            <div className="w-full mt-2 space-y-2">
              <input
                type="text"
                placeholder="Name"
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-xs focus:outline-none focus:border-secondary placeholder:text-textSecondary text-textSecondary"
              />
              <button className="w-full bg-secondary text-white text-xs font-semibold py-2 rounded-md hover:brightness-90 transition-all">
                Join audience
              </button>
              <p className="text-[10px] text-textSecondary leading-tight">
                Or <button className="text-secondary underline">Log in with Vimeo</button>
              </p>
              <p className="text-[9px] text-textSecondary leading-tight">
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
              <BarChart2 size={18} className="text-secondary" strokeWidth={1.5} />
            </div>
            <p className="text-xs text-textSecondary">Polls will appear here during the session</p>
          </>
        )}
        {activeTab === "quiz" && (
          <>
            <div className="w-10 h-10 rounded-full bg-lightBg flex items-center justify-center">
              <HelpCircle size={18} className="text-secondary" strokeWidth={1.5} />
            </div>
            <p className="text-xs text-textSecondary">Quizzes will appear here during the session</p>
          </>
        )}
      </div>
    </div>
  );
}

// ── Ad Banners ─────────────────────────────────────────────────────────────────
function AdBannerSide() {
  return (
    <div className="flex-shrink-0 rounded-xl overflow-hidden border border-gray-100">
      <div className="w-full h-[88px] bg-gradient-to-br from-lightBg to-blue-100 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-[9px] font-semibold text-secondary/60 uppercase tracking-widest">
            Your Trusted Partner
          </p>
          <p className="text-[9px] text-secondary/50 mt-0.5">
            in the management of Neuropathy
          </p>
          <div className="flex items-center justify-center gap-1.5 mt-2">
            <span className="text-sm font-black text-secondary">neuron</span>
            <span className="text-[10px] font-extrabold text-white bg-primary px-1.5 py-0.5 rounded">NT</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdBannerWide() {
  return (
    <div className="w-full rounded-xl overflow-hidden border border-gray-100">
      <div className="w-full h-[72px] bg-gradient-to-r from-lightBg via-blue-50 to-lightBg flex items-center justify-between px-6">
        <p className="text-[10px] text-textSecondary hidden sm:block">
          Your <strong className="text-secondary">Trusted Partner</strong> in the management of Neuropathy
        </p>
        <div className="flex items-center divide-x divide-gray-200 overflow-hidden">
          <div className="flex items-center gap-1 px-4">
            <span className="text-sm font-black text-secondary">neuron</span>
            <span className="text-[10px] font-extrabold text-white bg-primary px-1 py-0.5 rounded">NT</span>
          </div>
          <div className="flex items-center gap-1.5 px-4">
            <span className="text-sm font-black text-secondary">Meganeuron OD</span>
            <span className="text-xs font-extrabold text-primary">+</span>
          </div>
          <div className="flex items-center px-4">
            <span className="text-sm font-bold text-secondary/70 italic">Syn</span>
            <span className="text-xs text-primary font-bold">•</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function LiveSessionPage() {
  return (
    <div className="space-y-4">

      {/* ── Warning Banner ── */}
      <div className="flex items-center justify-between gap-3 bg-warningLight border border-warning/30 rounded-xl px-4 py-3">
        <div className="flex items-center gap-2.5">
          <AlertTriangle size={20} className="text-warning flex-shrink-0" strokeWidth={2} />
          <p className="text-xs md:text-sm font-semibold text-warning">
            <span className="font-bold">Warning Message: </span>
            <span className="font-bold text-textPrimary">Capturing this video to a local machine is Illegal!</span>
          </p>
        </div>
        <button className="flex-shrink-0 bg-warning text-white text-xs md:text-sm font-bold px-4 py-2 rounded-lg hover:brightness-90 transition-all whitespace-nowrap">
          Got it
        </button>
      </div>

      {/* ── Two-column layout ── */}
      <div className="flex flex-col lg:flex-row lg:items-start gap-4">

        {/* ════ LEFT COLUMN ════ */}
        <div className="flex-1 min-w-0 space-y-4">

          {/* Session Header */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h1 className="text-base md:text-xl lg:text-xl font-semibold text-textPrimary leading-snug">
                  Clinical Case Studies on Neuropathy
                </h1>

                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-secondary">
                    <CalendarDays className="text-primary" size={14} strokeWidth={2} />
                    12 Feb 2026
                  </span>

                  <span className="flex items-center gap-1.5 text-xs font-semibold text-secondary">
                    <Clock className="text-primary" size={14} strokeWidth={2} />
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
            <div className="relative w-full bg-black" style={{ aspectRatio: "16/9" }}>
              <iframe
                src="https://player.vimeo.com/video/24133271"
                className="absolute inset-0 w-full h-full"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title="Vimeo Video"
              />
              <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-primary/90 backdrop-blur-sm rounded-full px-2.5 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span className="text-[10px] font-bold text-white uppercase tracking-wide">Live</span>
              </div>
            </div>
          </div>

          {/* Wide Ad Banner */}
          <AdBannerWide />

          {/* Session Schedule */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="text-primary" size={18} strokeWidth={2} />
              <h2 className="text-base md:text-xl lg:text-xl font-semibold text-textPrimary">Session Schedule</h2>
            </div>
            <div className="flex flex-col">
              {SCHEDULE.map(({ time, topic, speaker }, i) => {
                const isLast = i === SCHEDULE.length - 1;
                return (
                  <div key={i} className="relative flex gap-3 sm:gap-4 pb-4 last:pb-0">
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div className="mt-[3px] w-[11px] h-[11px] rounded-full bg-secondary border-2 border-white ring-1 ring-secondary relative z-10 flex-shrink-0" />
                      {!isLast && <div className="w-px flex-1 bg-welcomeLight mt-0.5" />}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 flex-1 min-w-0">
                      <span className="text-xs md:text-sm lg:text-sm font-semibold text-secondary whitespace-nowrap pt-0.5 w-[120px] flex-shrink-0">
                        {time}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs md:text-sm lg:text-sm font-semibold text-textPrimary leading-snug">{topic}</p>
                        {speaker && (
                          <p className="text-xs text-textSecondary font-medium mt-0.5">– {speaker}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Speakers & Panelists */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row gap-5 sm:gap-6">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-3">
                  <Mic2 size={18} className="text-primary" />
                  <h3 className="text-sm font-semibold text-textSecondary">Speakers</h3>
                </div>
                <div className="flex flex-wrap gap-3 sm:gap-4">
                  {SPEAKERS.map((s) => <DoctorAvatar key={s.name} name={s.name} />)}
                </div>
              </div>
              <div className="hidden sm:block w-px bg-gray-100 self-stretch" />
              <div className="block sm:hidden h-px bg-gray-100" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-3">
                  <Users size={18} className="text-primary" />
                  <h3 className="text-sm font-semibold text-textSecondary">Panelists</h3>
                </div>
                <div className="flex flex-wrap gap-3 sm:gap-4">
                  {PANELISTS.map((p) => <DoctorAvatar key={p.name} name={p.name} />)}
                </div>
              </div>
            </div>
          </div>

          {/* Moderator */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-3">
              <UserCheck size={18} className="text-primary" />
              <h3 className="text-sm font-semibold text-textSecondary">Moderator</h3>
            </div>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              {MODERATORS.map((m) => <DoctorAvatar key={m.name} name={m.name} />)}
            </div>
          </div>

        </div>
        {/* END LEFT COLUMN */}

        {/* ════ RIGHT COLUMN — desktop ════ */}
        <div className="hidden lg:flex flex-col gap-3 w-[300px] xl:w-[320px] flex-shrink-0 sticky top-[104px] self-start">
          <AdBannerSide />
          <div style={{ height: "calc(100vh - 220px)" }}>
            <ChatPollsPanel />
          </div>
        </div>

        {/* ════ MOBILE / TABLET ════ */}
        <div className="block lg:hidden w-full space-y-3">
          <AdBannerSide />
          <div style={{ height: "420px" }}>
            <ChatPollsPanel />
          </div>
        </div>

      </div>
    </div>
  );
}