"use client";

import { useRouter } from "next/navigation";
import { use } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Notification {
  id: number;
  title: string;
  body: string;
  time: string;
  read: boolean;
  dot: "green" | "grey";
}

// ─── Seed Data (shared — in a real app, fetch from API or context) ─────────────
const SEED: Notification[] = [
  { id: 1,  title: "Live Now: Neuropathy Management – Module 1",  body: "Dr. Rajesh Kumar has started the live session. Join now to participate and engage with the expert panel. This is a rare opportunity to get your questions answered in real time.", time: "5 Mins ago",  read: false, dot: "green" },
  { id: 2,  title: "Reminder: Live Session Starts in 30 Minutes", body: "Dr. Rajesh Kumar has started the live session. Join now to participate and engage with the expert panel. Make sure your audio and video are ready before joining.", time: "12 Mins ago", read: false, dot: "green" },
  { id: 3,  title: "Session Rescheduled",                         body: 'The session "Clinical Case Discussions – Neuropathy" has been moved to 14th Feb, 7:30 PM IST. Please update your calendar accordingly and ensure you join on time.', time: "18 Mins ago", read: true,  dot: "grey"  },
  { id: 4,  title: "New Programme Available",                     body: 'A new CME programme on "Peripheral Neuropathy Diagnosis" is now open for registration. Enroll now to secure your spot as seats are limited.',   time: "25 Mins ago", read: false, dot: "green" },
  { id: 5,  title: "Registration Successful",                     body: 'You have successfully registered for "Neuropathy Masterclass – Batch 3". Your seat has been confirmed. You will receive a calendar invite shortly.', time: "1 hr ago",   read: false, dot: "green" },
  { id: 6,  title: "Session Completed",                           body: '"Pain Management in Neuropathy" has ended. The recording will be available in your dashboard within 24 hours for replay.',            time: "2 hrs ago",  read: true,  dot: "grey"  },
  { id: 7,  title: "Certificate Ready for Download",              body: 'Your participation certificate for "Neuropathy Clinical Training" is now available. Download it from the Certificates section in your account.',        time: "5 hrs ago",  read: false, dot: "green" },
  { id: 8,  title: "Guest Speaker Announced",                     body: 'Dr. Anjali Mehta will lead the upcoming session on "Advanced Nerve Conduction Studies". She brings over 20 years of clinical experience in neurology.',    time: "12 hrs ago", read: true,  dot: "grey"  },
  { id: 9,  title: "Programme Content Updated",                   body: 'New case studies have been added to "Comprehensive Neuropathy Management". Review the updated materials before the next live session.',                  time: "12 hrs ago", read: false, dot: "green" },
];

// ─── Icons ────────────────────────────────────────────────────────────────────
function IconArrowLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}
function IconClock() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
function IconBellOff() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11a6.002 6.002 0 0 0-4-5.659V4a2 2 0 1 0-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 1 1-6 0v-1m6 0H9" />
    </svg>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function NotificationViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router   = useRouter();
  const { id }   = use(params);
  const notif    = SEED.find((n) => n.id === Number(id));

  return (
    <div className="space-y-4 sm:space-y-5">

      {/* ── Back Button ── */}
      <div>
        <button
          onClick={() => router.push("/notifications")}
          className="
            inline-flex items-center gap-2
            text-sm font-semibold text-gray-600
            bg-white border border-gray-200
            rounded-xl px-4 py-2
            hover:bg-gray-50 hover:border-gray-300
            transition-colors duration-150
            shadow-sm
          "
        >
          <IconArrowLeft />
          Back to Notifications
        </button>
      </div>

      {/* ── Page Header ── */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
          Notification Detail
        </h1>
        <p className="text-xs text-gray-400 mt-0.5">
          Full notification message
        </p>
      </div>

      {/* ── Content ── */}
      {notif ? (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

          {/* Card Header */}
          <div className="px-5 sm:px-6 py-5 border-b border-gray-100">
            <div className="flex items-start gap-3">
              {/* Dot */}
              <span
                className={`
                  mt-1.5 flex-shrink-0 w-2.5 h-2.5 rounded-full
                  ${notif.dot === "green" ? "bg-green-500" : "bg-slate-400"}
                `}
              />
              <div className="flex-1 min-w-0">
                <h2 className="text-base font-bold text-gray-900 leading-snug">
                  {notif.title}
                </h2>
                <div className="flex items-center gap-1.5 mt-2 text-gray-400">
                  <IconClock />
                  <span className="text-xs font-medium">{notif.time}</span>
                  {/* Read badge */}
                  <span
                    className={`
                      ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold
                      ${notif.read
                        ? "bg-slate-100 text-slate-500"
                        : "bg-green-50 text-green-600 border border-green-200"
                      }
                    `}
                  >
                    {notif.read ? "Read" : "Unread"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card Body — Message */}
          <div className="px-5 sm:px-6 py-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
              Message
            </p>
            <div className="bg-gray-50 border border-gray-100 rounded-xl px-5 py-4">
              <p className="text-sm text-gray-700 leading-relaxed">
                {notif.body}
              </p>
            </div>
          </div>

          

        </div>
      ) : (
        /* Not found state */
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-200">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-5">
            <IconBellOff />
          </div>
          <p className="text-base font-bold text-gray-700 mb-1">Notification Not Found</p>
          <p className="text-sm text-gray-400 text-center max-w-xs leading-relaxed px-4">
            This notification may have been deleted or does not exist.
          </p>
          
        </div>
      )}

    </div>
  );
}