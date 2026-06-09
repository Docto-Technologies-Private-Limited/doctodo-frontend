"use client";

import { useState } from "react";
import {
  Plus,
  ChevronDown,
  X,
  CircleCheck,
  Eye,
  FileX,
  ChevronsUpDown,
  HelpCircle,
  Check,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type TicketStatus = "Open" | "In-Progress" | "Resolved";

interface Ticket {
  id: string;
  subject: string;
  status: TicketStatus;
  date: string;
  message: string;
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
  { id: "TK-001", subject: "Payment Issue", status: "Open", date: "16 Feb 2026", message: "I was charged twice for my subscription renewal. The duplicate transaction appeared on my bank statement on 15 Feb 2026. Please investigate and process a refund for the extra charge." },
  { id: "TK-002", subject: "Payment Billing", status: "In-Progress", date: "15 Feb 2026", message: "My invoice for February 2026 shows an incorrect amount. The discount applied during checkout is not reflected in the final invoice. Kindly review and re-issue the corrected invoice." },
  { id: "TK-003", subject: "Certificate Help", status: "Resolved", date: "12 Feb 2026", message: "I completed the Advanced Cardiac Life Support programme on 10 Feb but my certificate has not appeared in my account. Could you please check the status and make it available for download?" },
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
      { question: "How do I enroll in a course?", answer: "To enroll in a course, navigate to the Programme section, select your desired course, and click the 'Enroll Now' button. Follow the on-screen instructions to complete your registration." },
      { question: "Can I switch programs after enrollment?", answer: "Yes, you can switch programs within 7 days of enrollment at no additional cost. After 7 days, please raise a support ticket and our team will assist you." },
    ],
  },
  {
    category: "Payment Details",
    items: [
      { question: "What payments method do you accept?", answer: "We accept all major credit/debit cards (Visa, Mastercard, Rupay), UPI, Net Banking, and EMI options through various partner banks." },
      { question: "Is there a refund policy?", answer: "Yes, we offer a 14-day money-back guarantee. If you are not satisfied with the course, you can request a full refund within 14 days of purchase." },
    ],
  },
  {
    category: "Account Details",
    items: [
      { question: "How do I reset my password?", answer: "Click on 'Forgot Password' on the login page, enter your registered email address, and follow the link sent to your email to reset your password." },
      { question: "Can I change my email address?", answer: "Yes, you can update your email address from the My Account section under Profile Settings. A verification link will be sent to your new email address." },
    ],
  },
  {
    category: "Certificate Details",
    items: [
      { question: "How do I download my certificate?", answer: "Once you complete a programme, your certificate will be available in the My Account section under Certificates. Click the Download button to save it as a PDF." },
      { question: "Are these certificates recognized by employers?", answer: "Yes, our certificates are CME-accredited and recognized by major medical associations and healthcare institutions across India." },
    ],
  },
  {
    category: "Technical Details",
    items: [
      { question: "What are the system requirements?", answer: "Our platform works on any modern browser (Chrome, Firefox, Safari, Edge). For the best experience, we recommend a stable internet connection of at least 5 Mbps for live sessions." },
      { question: "I am experiencing technical issues. How do I get help?", answer: "Please raise a support ticket with a detailed description of the issue, including your device type, browser version, and screenshots if possible. Our technical team will respond within 24 hours." },
    ],
  },
];

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: TicketStatus }) {
  const styles: Record<TicketStatus, string> = {
    "Open": "bg-amber-50  text-amber-600  border border-amber-200",
    "In-Progress": "bg-blue-50   text-blue-600   border border-blue-200",
    "Resolved": "bg-green-50  text-green-600  border border-green-200",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[status]}`}>
      {status}
    </span>
  );
}

// ─── FAQ Accordion Item ───────────────────────────────────────────────────────
function FaqAccordionItem({ item }: { item: FaqItem }) {
  const [open, setOpen] = useState(false);
  const bodyId = `faq-body-${item.question.slice(0, 20).replace(/\s/g, "-")}`;

  const handleToggle = () => {
    const el = document.getElementById(bodyId);
    if (!open && el) {
      el.style.maxHeight = el.scrollHeight + "px";
      el.style.opacity = "1";
    } else if (el) {
      el.style.maxHeight = "0px";
      el.style.opacity = "0";
    }
    setOpen(!open);
  };

  return (
    <div className="border border-lightBg rounded-xl overflow-hidden">
      <button
        onClick={handleToggle}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left bg-white hover:bg-gray-50 transition-colors duration-150"
      >
        <span className="text-xs md:text-sm font-semibold text-textSecondary leading-snug">{item.question}</span>
        <span className="flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center bg-secondary text-white">
          <ChevronDown
            size={16}
            style={{
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.3s ease",
              display: "block",
            }}
          />
        </span>
      </button>
      {/* Answer — animated collapse */}
      <div
        id={bodyId}
        style={{ maxHeight: "0px", overflow: "hidden", transition: "max-height 0.35s ease, opacity 0.3s ease", opacity: 0 }}
      >
        <div className="px-4 pb-4 pt-1 border-t border-gray-100">
          <p className="text-sm text-textSecondary/70 leading-relaxed">{item.answer}</p>
        </div>
      </div>
    </div>
  );
}

// ─── FAQ All Sections (single card, all categories inside) ───────────────────
function FaqAllSections({ sections }: { sections: FaqSection[] }) {
  return (
    <div className="border border-gray-200 rounded-xl bg-white overflow-hidden">
      {sections.map((section, sIdx) => (
        <div key={section.category} >
          {/* Category label with red bar */}
          <div className="flex items-center gap-2 px-4 py-3.5">
            <div className="w-1 h-5 rounded-full bg-primary flex-shrink-0" />
            <h3 className="text-sm md:text-xl lg:text-base font-semibold text-textPrimary">{section.category}</h3>
          </div>
          {/* Bordered accordion items */}
          <div className="px-4 pb-4 space-y-2 border-primary">
            {section.items.map((item, idx) => (
              <FaqAccordionItem key={idx} item={item} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── View Message Modal ───────────────────────────────────────────────────────
function ViewMessageModal({ ticket, onClose }: { ticket: Ticket; onClose: () => void }) {
  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };
  return (
    <div onClick={handleBackdrop} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto overflow-hidden">
        <div className="flex items-start justify-between p-5 pb-4">
          <div>
            <h2 className="text-sm md:text-base lg:text-base font-semibold text-textSecondary">Support Ticket</h2>
            <p className="text-xs text-textSecondary/60 mt-0.5">Ticket details and message</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-sm bg-secondary flex items-center justify-center text-white hover:brightness-90 transition-all flex-shrink-0 mt-0.5">
            <X size={16} />
          </button>
        </div>
        <div className="border-t border-gray-100" />
        <div className="p-5 space-y-4">
          <div>
            <p className="text-xs font-semibold text-textSecondary/50 mb-1">Ticket ID</p>
            <p className="text-sm font-mono font-semibold text-secondary">{ticket.id}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-textSecondary/50 mb-1">Subject</p>
            <p className="text-sm font-medium text-textSecondary">{ticket.subject}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-textSecondary/50 mb-1">Message</p>
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
              <p className="text-sm text-textSecondary/80 leading-relaxed">{ticket.message}</p>
            </div>
          </div>
        </div>
         
      </div>
    </div>
  );
}

// ─── Raise Ticket Modal ───────────────────────────────────────────────────────
function RaiseTicketModal({ onClose, onSubmit }: {
  onClose: () => void;
  onSubmit: (ticket: { subject: string; category: string; message: string }) => void;
}) {
  const [category, setCategory] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [emailMe, setEmailMe] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [categoryOpen, setCategoryOpen] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!category) e.category = "Please select a category.";
    if (!subject.trim()) e.subject = "Subject is required.";
    if (!description.trim()) e.description = "Description is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => { if (!validate()) return; onSubmit({ subject: subject.trim(), category, message: description.trim() }); };
  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => { if (e.target === e.currentTarget) onClose(); };

  return (
    <div onClick={handleBackdrop} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto overflow-hidden">
        <div className="flex items-start justify-between p-5 pb-4">
          <div>
            <h2 className="text-sm md:text-base lg:text-base font-semibold text-textSecondary">Raise a Support Ticket</h2>
            <p className="text-xs text-textSecondary/60 mt-0.5">Get timely assistance from our support team.</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-sm bg-secondary flex items-center justify-center text-white hover:brightness-90 transition-all flex-shrink-0 mt-0.5">
            <X size={16} />
          </button>
        </div>
        <div className="border-t border-gray-100" />
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="relative">
            <label className="text-xs font-semibold text-textSecondary mb-1.5 flex items-center gap-0.5">
              Category <span className="text-primary">*</span>
            </label>
            <button
              type="button"
              onClick={() => setCategoryOpen((p) => !p)}
              className={`w-full border rounded-lg px-3 py-2.5 text-sm text-left flex items-center justify-between bg-white focus:outline-none transition-colors duration-150 ${errors.category ? "border-red-400" : "border-gray-200"}`}
            >
              <span className={category ? "text-textSecondary font-medium" : "text-textSecondary/40"}>
                {category || "Select a Category"}
              </span>
              <ChevronDown
                size={14}
                className="text-textSecondary/40 flex-shrink-0 transition-transform duration-200"
                style={{ transform: categoryOpen ? "rotate(180deg)" : "rotate(0deg)" }}
              />
            </button>

            {/* Custom dropdown list */}
            {categoryOpen && (
              <div className="absolute z-30 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      setCategory(c);
                      setCategoryOpen(false);
                      setErrors((p) => ({ ...p, category: "" }));
                    }}
                    className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors duration-100
                      ${category === c
                        ? "bg-primaryLight text-primary"
                        : "text-textSecondary hover:bg-gray-50"
                      }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}

            {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
          </div>
          <div>
            <label className="text-xs font-semibold text-textSecondary mb-1.5 flex items-center gap-0.5">
              Subject <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => { setSubject(e.target.value); setErrors((p) => ({ ...p, subject: "" })); }}
              placeholder="Brief title of your issue"
              className={`w-full border rounded-lg px-3 py-2.5 text-sm text-textSecondary placeholder-textSecondary/40 focus:outline-none focus:border-secondary transition-colors duration-150 ${errors.subject ? "border-red-400" : "border-gray-200"}`}
            />
            {errors.subject && <p className="text-xs text-red-500 mt-1">{errors.subject}</p>}
          </div>
          <div>
            <label className="text-xs font-semibold text-textSecondary mb-1.5 flex items-center gap-0.5">
              Description <span className="text-primary">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => { setDescription(e.target.value); setErrors((p) => ({ ...p, description: "" })); }}
              placeholder="Describe your issue in detail"
              rows={4}
              className={`w-full border rounded-lg px-3 py-2.5 text-sm text-textSecondary placeholder-textSecondary/40 resize-none focus:outline-none focus:border-secondary transition-colors duration-150 ${errors.description ? "border-red-400" : "border-gray-200"}`}
            />
            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
          </div>
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <input
              type="checkbox"
              checked={emailMe}
              onChange={(e) => setEmailMe(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 accent-secondary cursor-pointer"
            />
            <span className="text-xs text-textSecondary/60 group-hover:text-textSecondary transition-colors">
              Send me email updates on ticket status
            </span>
          </label>
        </div>
        <div className="p-5 pt-3 border-t border-gray-100 flex justify-center">
          <button
            onClick={handleSubmit}
            className="w-1/2 flex items-center justify-center gap-2 bg-primary text-white text-sm font-bold py-2.5 rounded-xl hover:brightness-90 transition-all duration-150 shadow-sm"
          >
            <CircleCheck size={15} />
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
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-green-600 text-white text-sm font-semibold px-4 py-3 rounded-xl shadow-lg">
      <Check size={16} strokeWidth={2.5} />
      {message}
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100">
        <X size={16} />
      </button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function HelpSupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>(TICKETS);
  const [showRaise, setShowRaise] = useState(false);
  const [viewTicket, setViewTicket] = useState<Ticket | null>(null);
  const [toast, setToast] = useState("");

  const handleSubmitTicket = ({ subject, category, message }: { subject: string; category: string; message: string }) => {
    const newTicket: Ticket = {
      id: `TK-${String(tickets.length + 1).padStart(3, "0")}`,
      subject,
      status: "Open",
      date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      message,
    };
    setTickets((prev) => [newTicket, ...prev]);
    setShowRaise(false);
    setToast(`Ticket "${subject}" submitted successfully!`);
    setTimeout(() => setToast(""), 4000);
  };

  return (
    <>
      <div className="space-y-5 sm:space-y-6">

        {/* ── My Tickets ── */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">

          {/* Header */}
          <div className="flex items-center justify-between px-4 sm:px-5 py-4 border-b border-gray-100">
            <div>
              <h2 className="text-base md:text-xl lg:text-xl font-semibold text-textPrimary">My Tickets</h2>
              <p className="text-xs md:text-sm lg:text-sm text-textSecondary mt-0.5">Track your support requests</p>
            </div>
            <button
              onClick={() => setShowRaise(true)}
              className="flex items-center gap-1.5 bg-primary text-white font-bold rounded-xl hover:brightness-90 transition-all duration-150 shadow-sm flex-shrink-0 text-xs px-3 py-2 sm:text-sm sm:px-4 sm:py-2.5"
            >
              <Plus size={14} strokeWidth={2.5} />
              <span className="sm:hidden">Add New</span>
              <span className="hidden sm:inline">Raise a Support Request</span>
            </button>
          </div>

          {/* ── Desktop / Tablet Table ── */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left text-xs md:text-sm lg:text-sm font-semibold text-textPrimary px-5 py-3 w-24">ID</th>
                  <th className="text-left text-xs md:text-sm lg:text-sm font-semibold text-textPrimary px-4 py-3">Subject</th>
                  <th className="text-left text-xs md:text-sm lg:text-sm font-semibold text-textPrimary px-4 py-3 w-36">
                    <span className="flex items-center gap-1">
                      Status
                      <ChevronsUpDown size={10} strokeWidth={2.5} />
                    </span>
                  </th>
                  <th className="text-left text-xs md:text-sm lg:text-sm font-semibold text-textPrimary px-4 py-3 w-36">Date</th>
                  <th className="text-left text-xs md:text-sm lg:text-sm font-semibold text-textPrimary px-4 py-3 w-28">Message</th>
                </tr>
              </thead>
            </table>
            <div className="max-h-72 overflow-y-auto">
              <table className="w-full text-sm">
                <tbody>
                  {tickets.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-10">
                        <div className="flex flex-col items-center gap-2">
                          <FileX size={36} strokeWidth={1.4} className="text-slate-400" />
                          <p className="text-sm text-textSecondary/40 font-medium">No entries found.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    tickets.map((t, idx) => (
                      <tr key={t.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors duration-100 ${idx === tickets.length - 1 ? "border-b-0" : ""}`}>
                        <td className="px-5 py-3.5 text-xs md:text-sm lg:text-sm text-textPrimary font-medium w-24">{t.id}</td>
                        <td className="px-4 py-3.5 text-xs md:text-sm lg:text-sm text-textPrimary font-medium">{t.subject}</td>
                        <td className="px-4 py-3.5 w-36"><StatusBadge status={t.status} /></td>
                        <td className="px-4 py-3.5 text-xs md:text-sm lg:text-sm text-textPrimary font-medium w-36">{t.date}</td>
                        <td className="px-4 py-3.5 w-28">
                          <button
                            onClick={() => setViewTicket(t)}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-textWhite bg-secondary rounded-lg px-2.5 py-1.5 "
                          >
                            <Eye size={13} />
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Mobile: separate rounded card per ticket ── */}
          <div className="block sm:hidden">
            {tickets.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-10">
                <FileX size={36} strokeWidth={1.4} className="text-slate-400" />
                <p className="text-sm text-textSecondary/40 font-medium">No entries found.</p>
              </div>
            ) : (
              <div className="p-3 space-y-3 max-h-[420px] overflow-y-auto">
                {tickets.map((t) => (
                  <div key={t.id} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    {/* Gray header strip */}
                    <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-200">
                      <p className="text-xs md:text-sm lg:text-sm font-semibold text-textPrimary">
                        Ticket ID: {t.id} 
                      </p>
                    </div>
                    {/* White body */}
                    <div className="bg-white px-4 py-3">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-xs md:text-sm lg:text-sm font-semibold text-textPrimary leading-snug">{t.subject}</p>
                        <button
                          onClick={() => setViewTicket(t)}
                          className="inline-flex items-center gap-1.5 text-xs md:text-sm lg:text-sm font-semibold text-textWhite bg-secondary rounded-lg px-3 py-1.5 flex-shrink-0"
                        >
                          <Eye size={13} />
                          View
                        </button>
                      </div>
                      <div className="flex items-center gap-2.5 mt-2">
                        <StatusBadge status={t.status} />
                        <span className="text-xs md:text-sm lg:text-sm font-semibold text-textPrimary">{t.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── FAQ ── */}
        <div className="space-y-4">
          {/* FAQ title */}
          <div className="flex items-center gap-2 px-1"> 
            <h2 className="text-base md:text-xl lg:text-xl font-semibold text-textPrimary">Frequently Asked Questions</h2>
          </div>

          {/* Single unified card with all FAQ categories */}
          <FaqAllSections sections={FAQ_SECTIONS} />
        </div>

      </div>

      {/* ── Modals & Toast ── */}
      {viewTicket && <ViewMessageModal ticket={viewTicket} onClose={() => setViewTicket(null)} />}
      {showRaise && <RaiseTicketModal onClose={() => setShowRaise(false)} onSubmit={handleSubmitTicket} />}
      {toast && <SuccessToast message={toast} onClose={() => setToast("")} />}
    </>
  );
}