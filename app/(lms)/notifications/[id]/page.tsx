"use client";

import { useRouter } from "next/navigation";
import { use } from "react";
import { ArrowLeft, Clock, BellOff } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Notification {
  id: number;
  title: string;
  body: string;
  time: string;
  read: boolean;
  dot: "success" | "grey";
}

// ─── Seed Data ────────────────────────────────────────────────────────────────
const SEED: Notification[] = [
  { id: 1,  title: "Live Now: Neuropathy Management – Module 1",  body: "Dr. Rajesh Kumar has started the live session. Join now to participate and engage with the expert panel. This is a rare opportunity to get your questions answered in real time.", time: "5 Mins ago",  read: false, dot: "success" },
  { id: 2,  title: "Reminder: Live Session Starts in 30 Minutes", body: "Dr. Rajesh Kumar has started the live session. Join now to participate and engage with the expert panel. Make sure your audio and video are ready before joining.", time: "12 Mins ago", read: false, dot: "success" },
  { id: 3,  title: "Session Rescheduled",                         body: 'The session "Clinical Case Discussions – Neuropathy" has been moved to 14th Feb, 7:30 PM IST. Please update your calendar accordingly and ensure you join on time.', time: "18 Mins ago", read: true,  dot: "grey"  },
  { id: 4,  title: "New Programme Available",                     body: 'A new CME programme on "Peripheral Neuropathy Diagnosis" is now open for registration. Enroll now to secure your spot as seats are limited.',   time: "25 Mins ago", read: false, dot: "success" },
  { id: 5,  title: "Registration Successful",                     body: 'You have successfully registered for "Neuropathy Masterclass – Batch 3". Your seat has been confirmed. You will receive a calendar invite shortly.', time: "1 hr ago",   read: false, dot: "success" },
  { id: 6,  title: "Session Completed",                           body: '"Pain Management in Neuropathy" has ended. The recording will be available in your dashboard within 24 hours for replay.',            time: "2 hrs ago",  read: true,  dot: "grey"  },
  { id: 7,  title: "Certificate Ready for Download",              body: 'Your participation certificate for "Neuropathy Clinical Training" is now available. Download it from the Certificates section in your account.',        time: "5 hrs ago",  read: false, dot: "success" },
  { id: 8,  title: "Guest Speaker Announced",                     body: 'Dr. Anjali Mehta will lead the upcoming session on "Advanced Nerve Conduction Studies". She brings over 20 years of clinical experience in neurology.',    time: "12 hrs ago", read: true,  dot: "grey"  },
  { id: 9,  title: "Programme Content Updated",                   body: 'New case studies have been added to "Comprehensive Neuropathy Management". Review the updated materials before the next live session.',                  time: "12 hrs ago", read: false, dot: "success" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function NotificationViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const notif  = SEED.find((n) => n.id === Number(id));

  return (
    <div className="space-y-4 sm:space-y-5">

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
                  ${notif.dot === "success" ? "bg-success" : "bg-slate-400"}
                `}
              />
              <div className="flex-1 min-w-0">
                <h2 className="text-base md:text-xl lg:text-xl font-semibold text-textPrimary leading-snug">
                  {notif.title}
                </h2>
                <div className="flex items-center gap-1.5 mt-2 text-gray-400">
                  <Clock size={14} strokeWidth={2} />
                  <span className="text-xs md:text-sm lg:text-sm text-textSecondary">{notif.time}</span>
                  {/* Read badge */}
                  <span
                    className={`
                      ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold
                      ${notif.read
                        ? "bg-slate-100 text-slate-500"
                        : "bg-successLight text-success border border-success"
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
            <p className="text-xs md:text-sm lg:text-sm font-semibold text-textSecondary uppercase tracking-wide mb-3">
              Message
            </p>
            <div className="bg-gray-50 border border-gray-100 rounded-xl px-5 py-4">
              <p className="text-xs md:text-sm lg:text-sm text-secondary leading-relaxed">
                {notif.body}
              </p>
            </div>
          </div>

        </div>
      ) : (
        /* Not found state */
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-200">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-5">
            <BellOff size={40} className="text-slate-400" strokeWidth={1.4} />
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