"use client";

import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type TicketStatus = "Open" | "In-Progress" | "Resolved";

interface Ticket {
  id: string;
  subject: string;
  status: TicketStatus;
  date: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqSection {
  category: string;
  items: FaqItem[];
}

// ─── Seed Data ────────────────────────────────────────────────────────────────
const TICKETS: Ticket[] = [
  { id: "TK-001", subject: "Payment Issue",    status: "Open",        date: "16 Feb 2026" },
  { id: "TK-002", subject: "Payment Billing",  status: "In-Progress", date: "15 Feb 2026" },
  { id: "TK-003", subject: "Certificate Help", status: "Resolved",    date: "12 Feb 2026" },
];

const CATEGORIES = [
  "Programme Details",
  "Payment Details",
  "Account Details",
  "Certificate Details",
  "Technical Details",
];

const FAQ_SECTIONS: FaqSection[] = [
  {
    category: "Programme Details",
    items: [
      { question: "How do I enroll in a course?",           answer: "To enroll in a course, navigate to the Programme section, select your desired course, and click the 'Enroll Now' button. Follow the on-screen instructions to complete your registration." },
      { question: "Can I switch programs after enrollment?", answer: "Yes, you can switch programs within 7 days of enrollment at no additional cost. After 7 days, please raise a support ticket and our team will assist you." },
    ],
  },
  {
    category: "Payment Details",
    items: [
      { question: "What payments method do you accept?", answer: "We accept all major credit/debit cards (Visa, Mastercard, Rupay), UPI, Net Banking, and EMI options through various partner banks." },
      { question: "Is there a refund policy?",           answer: "Yes, we offer a 14-day money-back guarantee. If you are not satisfied with the course, you can request a full refund within 14 days of purchase." },
    ],
  },
  {
    category: "Account Details",
    items: [
      { question: "How do I reset my password?",       answer: "Click on 'Forgot Password' on the login page, enter your registered email address, and follow the link sent to your email to reset your password." },
      { question: "Can I change my email address?",    answer: "Yes, you can update your email address from the My Account section under Profile Settings. A verification link will be sent to your new email address." },
    ],
  },
  {
    category: "Certificate Details",
    items: [
      { question: "How do I download my certificate?",              answer: "Once you complete a programme, your certificate will be available in the My Account section under Certificates. Click the Download button to save it as a PDF." },
      { question: "Are these certificates recognized by employers?", answer: "Yes, our certificates are CME-accredited and recognized by major medical associations and healthcare institutions across India." },
    ],
  },
  {
    category: "Technical Details",
    items: [
      { question: "What are the system requirements?",                   answer: "Our platform works on any modern browser (Chrome, Firefox, Safari, Edge). For the best experience, we recommend a stable internet connection of at least 5 Mbps for live sessions." },
      { question: "I am experiencing technical issues. How do I get help?", answer: "Please raise a support ticket with a detailed description of the issue, including your device type, browser version, and screenshots if possible. Our technical team will respond within 24 hours." },
    ],
  },
];

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: TicketStatus }) {
  const styles: Record<TicketStatus, string> = {
    "Open":        "bg-amber-50  text-amber-600  border border-amber-200",
    "In-Progress": "bg-blue-50   text-blue-600   border border-blue-200",
    "Resolved":    "bg-green-50  text-green-600  border border-green-200",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[status]}`}>
      {status}
    </span>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────
function IconPlus() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
function IconChevron({ open }: { open: boolean }) {
  return (
    <svg
      width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
function IconX() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
function IconTicket() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}
function IconEmpty() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

// ─── FAQ Accordion Item ───────────────────────────────────────────────────────
function FaqAccordionItem({ item, isLast }: { item: FaqItem; isLast: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`${!isLast ? "border-b border-gray-100" : ""}`}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left hover:bg-gray-50 transition-colors duration-150 rounded-lg"
      >
        <span className="text-sm font-medium text-gray-800 leading-snug">{item.question}</span>
        <span className={`flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center transition-colors duration-150 ${open ? "bg-secondary text-white" : "bg-secondary text-white"}`}>
          <IconChevron open={open} />
        </span>
      </button>
      {open && (
        <div className="px-4 pb-4">
          <p className="text-sm text-gray-500 leading-relaxed">{item.answer}</p>
        </div>
      )}
    </div>
  );
}

// ─── FAQ Section ─────────────────────────────────────────────────────────────
function FaqSection({ section }: { section: FaqSection }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1 h-5 rounded-full bg-primary flex-shrink-0" />
        <h3 className="text-sm font-bold text-gray-800">{section.category}</h3>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {section.items.map((item, idx) => (
          <FaqAccordionItem key={idx} item={item} isLast={idx === section.items.length - 1} />
        ))}
      </div>
    </div>
  );
}

// ─── Raise Ticket Modal ───────────────────────────────────────────────────────
function RaiseTicketModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (ticket: { subject: string; category: string }) => void;
}) {
  const [category, setCategory]   = useState("");
  const [subject, setSubject]     = useState("");
  const [description, setDescription] = useState("");
  const [emailMe, setEmailMe]     = useState(false);
  const [errors, setErrors]       = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!category)    e.category    = "Please select a category.";
    if (!subject.trim())    e.subject    = "Subject is required.";
    if (!description.trim()) e.description = "Description is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({ subject: subject.trim(), category });
  };

  // Close on backdrop click
  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      onClick={handleBackdrop}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto overflow-hidden">

        {/* Modal Header */}
        <div className="flex items-start justify-between p-5 pb-4">
          <div>
            <h2 className="text-base font-bold text-gray-900">Raise a Support Ticket</h2>
            <p className="text-xs text-gray-400 mt-0.5">Get timely assistance from our support team.</p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-white hover:brightness-90 transition-all flex-shrink-0 mt-0.5"
          >
            <IconX />
          </button>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100" />

        {/* Modal Body */}
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">

          {/* Category */}
          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-0.5">
              Category <span className="text-primary">*</span>
            </label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => { setCategory(e.target.value); setErrors((p) => ({ ...p, category: "" })); }}
                className={`
                  w-full border rounded-lg px-3 py-2.5 text-sm text-gray-700 bg-white appearance-none
                  focus:outline-none focus:border-secondary transition-colors duration-150
                  ${errors.category ? "border-red-400" : "border-gray-200"}
                `}
              >
                <option value="">Select a Category</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
              </span>
            </div>
            {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
          </div>

          {/* Subject */}
          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-0.5">
              Subject <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => { setSubject(e.target.value); setErrors((p) => ({ ...p, subject: "" })); }}
              placeholder="Brief title of your issue"
              className={`
                w-full border rounded-lg px-3 py-2.5 text-sm text-gray-700 placeholder-gray-400
                focus:outline-none focus:border-secondary transition-colors duration-150
                ${errors.subject ? "border-red-400" : "border-gray-200"}
              `}
            />
            {errors.subject && <p className="text-xs text-red-500 mt-1">{errors.subject}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-0.5">
              Description <span className="text-primary">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => { setDescription(e.target.value); setErrors((p) => ({ ...p, description: "" })); }}
              placeholder="Describe your issue in detail"
              rows={4}
              className={`
                w-full border rounded-lg px-3 py-2.5 text-sm text-gray-700 placeholder-gray-400 resize-none
                focus:outline-none focus:border-secondary transition-colors duration-150
                ${errors.description ? "border-red-400" : "border-gray-200"}
              `}
            />
            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
          </div>

          {/* Email checkbox */}
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <input
              type="checkbox"
              checked={emailMe}
              onChange={(e) => setEmailMe(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 accent-secondary cursor-pointer"
            />
            <span className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors">
              Send me email updates on ticket status
            </span>
          </label>
        </div>

        {/* Modal Footer */}
        <div className="p-5 pt-3 border-t border-gray-100">
          <button
            onClick={handleSubmit}
            className="w-full flex items-center justify-center gap-2 bg-primary text-white text-sm font-bold py-2.5 rounded-xl hover:brightness-90 transition-all duration-150 shadow-sm"
          >
            <IconTicket />
            Submit Ticket
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Success Toast ────────────────────────────────────────────────────────────
function SuccessToast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-green-600 text-white text-sm font-semibold px-4 py-3 rounded-xl shadow-lg animate-bounce-once">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
      {message}
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100"><IconX /></button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function HelpSupportPage() {
  const [tickets, setTickets]       = useState<Ticket[]>(TICKETS);
  const [showModal, setShowModal]   = useState(false);
  const [toast, setToast]           = useState("");

  const handleSubmitTicket = ({ subject, category }: { subject: string; category: string }) => {
    const newTicket: Ticket = {
      id:      `TK-${String(tickets.length + 1).padStart(3, "0")}`,
      subject,
      status:  "Open",
      date:    new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    };
    setTickets((prev) => [newTicket, ...prev]);
    setShowModal(false);
    setToast(`Ticket "${subject}" submitted successfully!`);
    setTimeout(() => setToast(""), 4000);
  };

  return (
    <>
      <div className="space-y-5 sm:space-y-6">

        {/* ── Page Header ── */}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">Help &amp; Support</h1>
          <p className="text-xs text-gray-400 mt-0.5">Find answers or raise a support request</p>
        </div>

        {/* ── My Tickets ── */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">

          {/* Card Header */}
          <div className="flex items-center justify-between px-4 sm:px-5 py-4 border-b border-gray-100">
            <div>
              <h2 className="text-sm font-bold text-gray-800">My Tickets</h2>
              <p className="text-xs text-gray-400 mt-0.5">Track your support requests</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 bg-primary text-white text-xs sm:text-sm font-bold px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl hover:brightness-90 transition-all duration-150 shadow-sm flex-shrink-0"
            >
              <IconPlus />
              <span className="hidden xs:inline sm:inline">Raise a Support Request</span>
              <span className="xs:hidden sm:hidden">Raise Request</span>
            </button>
          </div>

          {/* Table — Desktop/Tablet */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3 w-24">ID</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Subject</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3 w-36">
                    <span className="flex items-center gap-1">
                      Status
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 15l5 5 5-5M7 9l5-5 5 5"/></svg>
                    </span>
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3 w-36">Date</th>
                </tr>
              </thead>
              <tbody>
                {tickets.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-10">
                      <div className="flex flex-col items-center gap-2">
                        <IconEmpty />
                        <p className="text-sm text-gray-400 font-medium">No entries found.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  tickets.map((t, idx) => (
                    <tr key={t.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors duration-100 ${idx === tickets.length - 1 ? "border-b-0" : ""}`}>
                      <td className="px-5 py-3.5 text-xs font-mono font-semibold text-secondary">{t.id}</td>
                      <td className="px-4 py-3.5 text-sm text-gray-700 font-medium">{t.subject}</td>
                      <td className="px-4 py-3.5"><StatusBadge status={t.status} /></td>
                      <td className="px-4 py-3.5 text-xs text-gray-500">{t.date}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Cards — Mobile */}
          <div className="block sm:hidden">
            {tickets.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-10">
                <IconEmpty />
                <p className="text-sm text-gray-400 font-medium">No entries found.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {tickets.map((t) => (
                  <div key={t.id} className="px-4 py-3.5 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-mono font-semibold text-secondary">{t.id}</p>
                      <p className="text-sm font-medium text-gray-800 mt-0.5 leading-snug">{t.subject}</p>
                      <p className="text-xs text-gray-400 mt-1">{t.date}</p>
                    </div>
                    <StatusBadge status={t.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── FAQ ── */}
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 sm:p-5 space-y-5">
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0A3458" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <h2 className="text-sm font-bold text-gray-800">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {FAQ_SECTIONS.map((section) => (
              <FaqSection key={section.category} section={section} />
            ))}
          </div>
        </div>

      </div>

      {/* ── Modal ── */}
      {showModal && (
        <RaiseTicketModal
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmitTicket}
        />
      )}

      {/* ── Toast ── */}
      {toast && (
        <SuccessToast message={toast} onClose={() => setToast("")} />
      )}
    </>
  );
}