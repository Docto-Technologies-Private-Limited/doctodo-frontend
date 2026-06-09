"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Clock, Trash2, Search, Bell, CheckCheck, AlertTriangle } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type TabKey = "all" | "unread" | "read";

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
  { id: 1,  title: "Live Now: Neuropathy Management – Module 1",  body: "Dr. Rajesh Kumar has started the live session. Join now to participate.", time: "5 Mins ago",  read: false, dot: "success" },
  { id: 2,  title: "Reminder: Live Session Starts in 30 Minutes", body: "Dr. Rajesh Kumar has started the live session. Join now to participate.", time: "12 Mins ago", read: false, dot: "success" },
  { id: 3,  title: "Session Rescheduled",                         body: 'The session "Clinical Case Discussions – Neuropathy" has been moved to 14th Feb, 7:30 PM IST.', time: "18 Mins ago", read: true,  dot: "grey"  },
  { id: 4,  title: "New Programme Available",                     body: 'A new CME programme on "Peripheral Neuropathy Diagnosis" is now open for registration.',   time: "25 Mins ago", read: false, dot: "success" },
  { id: 5,  title: "Registration Successful",                     body: 'You have successfully registered for "Neuropathy Masterclass – Batch 3".', time: "1 hr ago",   read: false, dot: "success" },
  { id: 6,  title: "Session Completed",                           body: '"Pain Management in Neuropathy" has ended. Recording will be available shortly.',            time: "2 hrs ago",  read: true,  dot: "grey"  },
  { id: 7,  title: "Certificate Ready for Download",              body: 'Your participation certificate for "Neuropathy Clinical Training" is now available.',        time: "5 hrs ago",  read: false, dot: "success" },
  { id: 8,  title: "Guest Speaker Announced",                     body: 'Dr. Anjali Mehta will lead the upcoming session on "Advanced Nerve Conduction Studies".',    time: "12 hrs ago", read: true,  dot: "grey"  },
  { id: 9,  title: "Programme Content Updated",                   body: 'New case studies have been added to "Comprehensive Neuropathy Management".',                  time: "12 hrs ago", read: false, dot: "success" },
];

const PAGE_SIZE = 5;

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
      ? "bg-success text-white"
      : "bg-alert text-white";

  const iconBg =
    confirmStyle === "success" ? "bg-successLight text-success" : "bg-alertLight text-alert";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-auto overflow-hidden">
        <div className="p-6 flex flex-col items-center text-center gap-3">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${iconBg}`}>
            <AlertTriangle size={22} />
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
        <Bell size={36} stroke="#0A3458" strokeWidth={1.4} />
      </div>
      <p className="text-base font-bold text-gray-700 mb-1">{title}</p>
      <p className="text-sm text-gray-400 text-center max-w-xs leading-relaxed px-4">{subtitle}</p>
    </div>
  );
}

// ─── Notification Row ─────────────────────────────────────────────────────────
function NotifRow({
  notif,
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
        rounded-2xl border border-gray-200 shadow-sm
        transition-colors duration-150 cursor-pointer
        ${notif.read ? "bg-white hover:bg-gray-50" : "bg-blue-50/60 hover:bg-blue-50"}
      `}
    >
      {/* Status dot */}
      <span
        className={`
          mt-[7px] flex-shrink-0 w-2.5 h-2.5 rounded-full
          ${notif.dot === "success" ? "bg-success" : "bg-slate-400"}
        `}
      />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-xs md:text-sm lg:text-sm font-semibold text-textPrimary leading-snug">
          {notif.title}
        </p>
        <p className="text-xs md:text-sm lg:text-sm text-textSecondary mt-0.5 leading-relaxed line-clamp-1">
          {notif.body}
        </p>
        <div className="flex items-center gap-1 mt-1.5 text-gray-400">
          <Clock size={13} />
          <span className="text-xs md:text-sm lg:text-sm text-textSecondary">{notif.time}</span>
        </div>
      </div>

      {/* Delete button */}
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(notif.id); }}
        className="
          flex-shrink-0 w-8 h-8 rounded-lg
          bg-alertLight
          flex items-center justify-center
          text-alert
          transition-colors duration-150
          mt-0.5
        "
        aria-label="Delete notification"
      >
        <Trash2 size={15} />
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
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Confirm modal state
  const [confirmModal, setConfirmModal] = useState<null | {
    title: string;
    message: string;
    confirmLabel: string;
    confirmStyle?: "danger" | "success";
    onConfirm: () => void;
  }>(null);

  // Sentinel ref for IntersectionObserver
  const sentinelRef = useRef<HTMLDivElement | null>(null);

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

  // ── IntersectionObserver — load more when sentinel enters viewport ──
  const loadMore = useCallback(() => {
    if (!hasMore || isLoadingMore) return;
    setIsLoadingMore(true);
    // Tiny delay so the spinner is visible; remove setTimeout for instant load
    setTimeout(() => {
      setVisibleCount((c) => c + PAGE_SIZE);
      setIsLoadingMore(false);
    }, 400);
  }, [hasMore, isLoadingMore]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) loadMore(); },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

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
                    : "text-textPrimary hover:text-gray-700 bg-transparent"
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
              <span className="text-gray-400 flex-shrink-0"><Search size={15} /></span>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search"
                className="text-xs text-textSecondary bg-transparent border-none w-full placeholder-gray-400 focus:outline-none"
              />
            </div>

            {/* Mark all as Read — Unread tab only */}
            {activeTab === "unread" && (
              <button
                onClick={handleMarkAllAsRead}
                className="
                  flex items-center gap-1.5
                  text-xs font-semibold
                  text-textPrimary border border-gray-300
                  rounded-lg px-3 py-2
                  whitespace-nowrap
                "
              >
                <span className="text-success"><CheckCheck size={14} strokeWidth={2.5} /></span>
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
                  text-xs font-semibold
                  text-alert bg-white border border-alert-300
                  rounded-lg px-3 py-2
                  transition-colors duration-150
                  whitespace-nowrap
                "
              >
                <span className="text-alert"><Trash2 size={15} /></span>
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* ── Notifications List ── */}
        {visible.length > 0 ? (
          <div className="flex flex-col gap-3">
            {visible.map((notif, idx) => (
              <NotifRow
                key={notif.id}
                notif={notif}
                isLast={idx === visible.length - 1}
                onDelete={handleDelete}
                onClick={handleRowClick}
              />
            ))}

            {/* Sentinel — observed to trigger next page */}
            <div ref={sentinelRef} className="h-1" aria-hidden="true" />

            {/* Spinner shown while loading */}
            {isLoadingMore && (
              <div className="flex justify-center py-4">
                <span className="w-5 h-5 rounded-full border-2 border-secondary border-t-transparent animate-spin" />
              </div>
            )}
          </div>
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