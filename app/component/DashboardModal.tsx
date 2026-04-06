"use client";

import { useState, useEffect } from "react";

// ─── Shared close button ──────────────────────────────────────────────────────
const CloseBtn = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    aria-label="Close"
    type="button"
    className="absolute top-3.5 right-4 w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors"
  >
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
    >
      <line x1="1" y1="1" x2="13" y2="13" />
      <line x1="13" y1="1" x2="1" y2="13" />
    </svg>
  </button>
);

// ─── Shared modal wrapper ─────────────────────────────────────────────────────
const ModalBackdrop = ({
  id,
  isOpen,
  onClose,
  children,
}: {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) => (
  <div
    id={id}
    role="dialog"
    aria-modal="true"
    onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    className={`
      fixed inset-0 bg-secondary/55 backdrop-blur-sm z-[300]
      flex items-center justify-center p-4
      transition-opacity duration-[250ms]
      ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
    `}
  >
    <div
      className={`
        bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 pb-7 relative
        transition-all duration-[280ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]
        ${isOpen ? "translate-y-0 scale-100 opacity-100" : "translate-y-4 scale-95 opacity-0"}
      `}
    >
      {children}
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
//  MODAL 1 — Welcome / Set Up Your Account
// ─────────────────────────────────────────────────────────────────────────────
const SETUP_CHECKLIST = [
  { title: "Account Info",              desc: "Login credentials and contact details" },
  { title: "Personal Info",             desc: "Basic profile and location details" },
  { title: "Professional Information",  desc: "Registration and workplace details" },
];

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
}

export function WelcomeModal({ isOpen, onClose, onContinue }: WelcomeModalProps) {
  return (
    <ModalBackdrop id="modal1" isOpen={isOpen} onClose={onClose}>
      <CloseBtn onClick={onClose} />

      {/* Pill */}
      <div className="text-center mb-4">
        <span className="inline-flex items-center gap-1.5 bg-blue-50 text-secondary text-xs font-semibold rounded-full px-3.5 py-1.5 border border-blue-200">
          🎉&nbsp; Welcome Onboard!
        </span>
      </div>

      <h2 className="text-center font-display font-extrabold text-2xl mb-1 text-secondary">
        Set Up Your Account
      </h2>
      <p className="text-center text-gray-500 text-sm mb-5">
        Complete your profile to get started and unlock all features.
      </p>

      {/* Checklist */}
      <div className="rounded-xl px-2 py-1 mb-1 space-y-0.5">
        {SETUP_CHECKLIST.map(({ title, desc }) => (
          <div key={title} className="flex items-start gap-2.5 py-2.5">
            <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="2 6 5 9 10 3" />
              </svg>
            </div>
            <p className="font-body text-sm font-medium text-gray-900 leading-snug">
              {title}&nbsp;
              <span className="font-normal text-gray-400 text-xs">– {desc}</span>
            </p>
          </div>
        ))}
      </div>

      <button
        onClick={onContinue}
        className="w-full mt-5 inline-flex items-center justify-center gap-1.5 bg-secondary hover:bg-[#0c3f6a] text-white font-body text-sm font-semibold rounded-lg px-5 py-3 transition-all hover:-translate-y-px"
      >
        Go to My Account →
      </button>
    </ModalBackdrop>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  MODAL 2 — Complete Your Profile (form)
// ─────────────────────────────────────────────────────────────────────────────
interface ProfileForm {
  specialization: string;
  programmeId: string;
  qualification: string;
}

interface CompleteProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: ProfileForm) => void;
}

export function CompleteProfileModal({ isOpen, onClose, onSave }: CompleteProfileModalProps) {
  const [form, setForm] = useState<ProfileForm>({
    specialization: "",
    programmeId: "",
    qualification: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = () => {
    onSave?.(form);
    onClose();
  };

  const FIELDS: { name: keyof ProfileForm; label: string; placeholder: string }[] = [
    { name: "specialization", label: "Specialization / Specialty", placeholder: "e.g. Cardiology, General Medicine, Paediatrics" },
    { name: "programmeId",    label: "Programme ID",               placeholder: "e.g. WEB-GENMED-002" },
    { name: "qualification",  label: "Qualification",              placeholder: "e.g. MBBS, MD, MS, DM, DNB" },
  ];

  return (
    <ModalBackdrop id="modal2" isOpen={isOpen} onClose={onClose}>
      <CloseBtn onClick={onClose} />

      {/* Pill */}
      <div className="text-center mb-4">
        <span className="inline-flex items-center gap-1.5 bg-blue-50 text-secondary text-xs font-semibold rounded-full px-3.5 py-1.5 border border-blue-200">
          👋&nbsp; Welcome Onboard!
        </span>
      </div>

      <h2 className="text-center font-display font-extrabold text-2xl mb-1 text-secondary">
        Complete Your Profile
      </h2>
      <p className="text-center text-gray-500 text-sm mb-5">
        Update your profile to continue and access the programme
      </p>

      {/* Form */}
      <div className="space-y-3.5">
        {FIELDS.map(({ name, label, placeholder }) => (
          <div key={name}>
            <label htmlFor={name} className="block text-xs font-semibold text-gray-700 mb-1.5">
              {label}
            </label>
            <input
              type="text"
              id={name}
              name={name}
              value={form[name]}
              onChange={handleChange}
              placeholder={placeholder}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 font-body text-sm text-gray-900 bg-gray-50 outline-none transition-all focus:border-secondary focus:ring-2 focus:ring-secondary/10 focus:bg-white"
            />
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        className="w-full mt-5 inline-flex items-center justify-center gap-1.5 bg-primary hover:brightness-90 text-white font-body text-sm font-semibold rounded-lg px-5 py-3 transition-all hover:-translate-y-px"
      >
        Save &amp; Continue →
      </button>
    </ModalBackdrop>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Combined hook — manages both modal states + the welcome→profile transition
// ─────────────────────────────────────────────────────────────────────────────
export function useDashboardModals() {
  const [welcomeOpen,  setWelcomeOpen]  = useState(false);
  const [profileOpen,  setProfileOpen]  = useState(false);

  // Lock scroll when any modal is open
  useEffect(() => {
    const anyOpen = welcomeOpen || profileOpen;
    document.body.style.overflow = anyOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [welcomeOpen, profileOpen]);

  // Escape key closes both
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setWelcomeOpen(false); setProfileOpen(false); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const openWelcome = () => setWelcomeOpen(true);
  const openProfile = () => setProfileOpen(true);

  const handleWelcomeContinue = () => {
    setWelcomeOpen(false);
    setTimeout(() => setProfileOpen(true), 220);
  };

  return {
    welcomeOpen,
    profileOpen,
    openWelcome,
    openProfile,
    setWelcomeOpen,
    setProfileOpen,
    handleWelcomeContinue,
  };
}