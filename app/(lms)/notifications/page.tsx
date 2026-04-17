"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────
type TabKey = "all" | "unread" | "read";

interface Notification {
  id: number;
  title: string;
  body: string;
  time: string;
  read: boolean;
  dot: "green" | "grey";
}

// ─── Seed Data ────────────────────────────────────────────────────────────────
const SEED: Notification[] = [
  { id: 1,  title: "Live Now: Neuropathy Management – Module 1",  body: "Dr. Rajesh Kumar has started the live session. Join now to participate.", time: "5 Mins ago",  read: false, dot: "green" },
  { id: 2,  title: "Reminder: Live Session Starts in 30 Minutes", body: "Dr. Rajesh Kumar has started the live session. Join now to participate.", time: "12 Mins ago", read: false, dot: "green" },
  { id: 3,  title: "Session Rescheduled",                         body: 'The session "Clinical Case Discussions – Neuropathy" has been moved to 14th Feb, 7:30 PM IST.', time: "18 Mins ago", read: true,  dot: "grey"  },
  { id: 4,  title: "New Programme Available",                     body: 'A new CME programme on "Peripheral Neuropathy Diagnosis" is now open for registration.',   time: "25 Mins ago", read: false, dot: "green" },
  { id: 5,  title: "Registration Successful",                     body: 'You have successfully registered for "Neuropathy Masterclass – Batch 3".', time: "1 hr ago",   read: false, dot: "green" },
  { id: 6,  title: "Session Completed",                           body: '"Pain Management in Neuropathy" has ended. Recording will be available shortly.',            time: "2 hrs ago",  read: true,  dot: "grey"  },
  { id: 7,  title: "Certificate Ready for Download",              body: 'Your participation certificate for "Neuropathy Clinical Training" is now available.',        time: "5 hrs ago",  read: false, dot: "green" },
  { id: 8,  title: "Guest Speaker Announced",                     body: 'Dr. Anjali Mehta will lead the upcoming session on "Advanced Nerve Conduction Studies".',    time: "12 hrs ago", read: true,  dot: "grey"  },
  { id: 9,  title: "Programme Content Updated",                   body: 'New case studies have been added to "Comprehensive Neuropathy Management".',                  time: "12 hrs ago", read: false, dot: "green" },
];

const PAGE_SIZE = 5;

// ─── Icons ────────────────────────────────────────────────────────────────────
function IconClock() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
function IconTrash() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4h6v2" />
    </svg>
  );
}
function IconSearch() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
function IconBell() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#0A3458" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11a6.002 6.002 0 0 0-4-5.659V4a2 2 0 1 0-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 1 1-6 0v-1m6 0H9" />
    </svg>
  );
}
function IconCheck() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
function IconWarning() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

// ─── Confirm Modal ────────────────────────────────────────────────────────────
interface ConfirmModalProps {
  title: string;
  message: string;
  confirmLabel: string;
  confirmStyle?: "danger" | "success";
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmModal({
  title,
  message,
  confirmLabel,
  confirmStyle = "danger",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const confirmClass =
    confirmStyle === "success"
      ? "bg-green-600 hover:bg-green-700 text-white"
      : "bg-red-600 hover:bg-red-700 text-white";

  const iconBg =
    confirmStyle === "success" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-auto overflow-hidden">
        <div className="p-6 flex flex-col items-center text-center gap-3">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${iconBg}`}>
            <IconWarning />
          </div>
          <h2 className="text-base font-bold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-500 leading-relaxed">{message}</p>
        </div>
        <div className="border-t border-gray-100 flex">
          <button
            onClick={onCancel}
            className="flex-1 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors duration-150 border-r border-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-3 text-sm font-semibold transition-colors duration-150 ${confirmClass}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState({ tab }: { tab: TabKey }) {
  const title    = tab === "unread" ? "All Caught up!"    : "No Notifications";
  const subtitle = tab === "unread"
    ? "All notifications have been marked as read."
    : "You are all caught up! We will notify you when something new happens.";

  return (
    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-200">
      <div className="w-20 h-20 rounded-full bg-lightBg flex items-center justify-center mb-5">
        <IconBell />
      </div>
      <p className="text-base font-bold text-gray-700 mb-1">{title}</p>
      <p className="text-sm text-gray-400 text-center max-w-xs leading-relaxed px-4">{subtitle}</p>
    </div>
  );
}

// ─── Notification Row ─────────────────────────────────────────────────────────
function NotifRow({
  notif,
  isLast,
  onDelete,
  onClick,
}: {
  notif: Notification;
  isLast: boolean;
  onDelete: (id: number) => void;
  onClick: (notif: Notification) => void;
}) {
  return (
    <div
      onClick={() => onClick(notif)}
      className={`
        group flex items-start gap-3 px-4 sm:px-5 py-4
        transition-colors duration-150 cursor-pointer
        ${notif.read ? "bg-white hover:bg-gray-50" : "bg-blue-50/60 hover:bg-blue-50"}
        ${!isLast ? "border-b border-gray-100" : ""}
      `}
    >
      {/* Status dot */}
      <span
        className={`
          mt-[7px] flex-shrink-0 w-2.5 h-2.5 rounded-full
          ${notif.dot === "green" ? "bg-green-500" : "bg-slate-400"}
        `}
      />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 leading-snug">{notif.title}</p>
        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed line-clamp-1">{notif.body}</p>
        <div className="flex items-center gap-1 mt-1.5 text-gray-400">
          <IconClock />
          <span className="text-xs">{notif.time}</span>
        </div>
      </div>

      {/* Delete button */}
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(notif.id); }}
        className="
          flex-shrink-0 w-8 h-8 rounded-lg
          bg-red-50 hover:bg-red-100
          flex items-center justify-center
          text-red-400 hover:text-red-500
          transition-colors duration-150
          mt-0.5
        "
        aria-label="Delete notification"
      >
        <IconTrash />
      </button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function NotificationsPage() {
  const router = useRouter();

  const [notifications, setNotifications] = useState<Notification[]>(SEED);
  const [activeTab, setActiveTab]         = useState<TabKey>("all");
  const [searchQuery, setSearchQuery]     = useState("");
  const [visibleCount, setVisibleCount]   = useState(PAGE_SIZE);

  // Confirm modal state
  const [confirmModal, setConfirmModal] = useState<null | {
    title: string;
    message: string;
    confirmLabel: string;
    confirmStyle?: "danger" | "success";
    onConfirm: () => void;
  }>(null);

  // ── Derived list ──
  const filtered = useMemo(() => {
    let list = notifications;
    if (activeTab === "unread") list = list.filter((n) => !n.read);
    if (activeTab === "read")   list = list.filter((n) =>  n.read);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (n) => n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q)
      );
    }
    return list;
  }, [notifications, activeTab, searchQuery]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = filtered.length > visibleCount;

  // ── Handlers ──
  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    setVisibleCount(PAGE_SIZE);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setVisibleCount(PAGE_SIZE);
  };

  const handleDelete = (id: number) => {
    setConfirmModal({
      title: "Delete Notification",
      message: "Are you sure you want to delete this notification? This action cannot be undone.",
      confirmLabel: "Delete",
      confirmStyle: "danger",
      onConfirm: () => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        setConfirmModal(null);
      },
    });
  };

  const handleMarkAllAsRead = () => {
    setConfirmModal({
      title: "Mark All as Read",
      message: "Are you sure you want to mark all notifications as read?",
      confirmLabel: "Mark as Read",
      confirmStyle: "success",
      onConfirm: () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        setConfirmModal(null);
      },
    });
  };

  const handleClearAll = () => {
    setConfirmModal({
      title: "Clear All Notifications",
      message: "Are you sure you want to clear all read notifications? This action cannot be undone.",
      confirmLabel: "Clear All",
      confirmStyle: "danger",
      onConfirm: () => {
        setNotifications((prev) => prev.filter((n) => !n.read));
        setConfirmModal(null);
      },
    });
  };

  const handleRowClick = (notif: Notification) => {
    // Mark as read when opening
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
    );
    router.push(`/notifications/${notif.id}`);
  };

  // ── Tab config ──
  const tabs: { key: TabKey; label: string }[] = [
    { key: "all",    label: "All"    },
    { key: "unread", label: "Unread" },
    { key: "read",   label: "Read"   },
  ];

  return (
    <>
      <div className="space-y-4 sm:space-y-5">

        {/* ── Page Header ── */}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            Notifications
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Stay updated with your latest activity
          </p>
        </div>

        {/* ── Controls Row ── */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">

          {/* Tabs */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 w-fit bg-lightBg">
            {tabs.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => handleTabChange(key)}
                className={`
                  px-4 py-1.5 rounded-md text-sm font-semibold transition-all duration-150
                  ${activeTab === key
                    ? "bg-secondary text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700 bg-transparent"
                  }
                `}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Search + Action buttons */}
          <div className="flex items-center gap-2 flex-1 sm:justify-end flex-wrap">

            {/* Search */}
            <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 bg-white flex-1 sm:flex-none sm:w-52 md:w-64 focus-within:border-secondary transition-colors duration-150">
              <span className="text-gray-400 flex-shrink-0"><IconSearch /></span>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search"
                className="text-sm text-gray-700 bg-transparent border-none w-full placeholder-gray-400 focus:outline-none"
              />
            </div>

            {/* Mark all as Read — Unread tab only */}
            {activeTab === "unread" && (
              <button
                onClick={handleMarkAllAsRead}
                className="
                  flex items-center gap-1.5
                  text-xs sm:text-sm font-semibold
                  text-green-700 bg-green-50 border border-green-200
                  rounded-lg px-3 py-2
                  hover:bg-green-100 transition-colors duration-150
                  whitespace-nowrap
                "
              >
                <span className="text-green-600"><IconCheck /></span>
                <span className="hidden xs:inline sm:inline">Mark all as Read</span>
                <span className="xs:hidden sm:hidden">Mark Read</span>
              </button>
            )}

            {/* Clear All — Read tab only */}
            {activeTab === "read" && (
              <button
                onClick={handleClearAll}
                className="
                  flex items-center gap-1.5
                  text-xs sm:text-sm font-semibold
                  text-gray-600 bg-white border border-gray-300
                  rounded-lg px-3 py-2
                  hover:bg-red-50 hover:border-red-300 hover:text-red-600
                  transition-colors duration-150
                  whitespace-nowrap
                "
              >
                <span className="text-primary"><IconTrash /></span>
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* ── Notifications List ── */}
        {visible.length > 0 ? (
          <>
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              {visible.map((notif, idx) => (
                <NotifRow
                  key={notif.id}
                  notif={notif}
                  isLast={idx === visible.length - 1}
                  onDelete={handleDelete}
                  onClick={handleRowClick}
                />
              ))}
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="flex justify-center pt-1">
                <button
                  onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                  className="
                    px-8 py-2.5 rounded-xl
                    bg-secondary text-white
                    text-sm font-semibold
                    hover:brightness-90 transition-all duration-150
                    shadow-sm
                  "
                >
                  Load More
                </button>
              </div>
            )}
          </>
        ) : (
          <EmptyState tab={activeTab} />
        )}

      </div>

      {/* ── Confirm Modal ── */}
      {confirmModal && (
        <ConfirmModal
          title={confirmModal.title}
          message={confirmModal.message}
          confirmLabel={confirmModal.confirmLabel}
          confirmStyle={confirmModal.confirmStyle}
          onConfirm={confirmModal.onConfirm}
          onCancel={() => setConfirmModal(null)}
        />
      )}
    </>
  );
}