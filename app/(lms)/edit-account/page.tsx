"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { isValidPhoneNumber } from "libphonenumber-js";
import { Save, ChevronDown, Check } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface FormData {
  googleAccount: string;
  emailId: string;
  phone: string;
  salutation: string;
  firstName: string;
  lastName: string;
  location: string;
  pinCode: string;
  medRegNumber: string;
  medRegBoard: string;
  designation: string;
  institution: string;
}

// ─── Mock initial / persisted state ──────────────────────────────────────────
const INITIAL_FORM: FormData = {
  googleAccount: "DavidJoe30@gmail.com",
  emailId: "DavidJoe30@gmail.com",
  phone: "+919876543210",
  salutation: "Dr",
  firstName: "David",
  lastName: "Joe",
  location: "4, Nowhere street, Chennai",
  pinCode: "600001",
  medRegNumber: "TNMC 123456",
  medRegBoard: "Tamil Nadu Medical Council",
  designation: "Consultant",
  institution: "Apollo Hospitals, Chennai",
};

const SALUTATIONS = ["Dr", "Mr", "Mrs", "Ms", "Prof"];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getSavedForm(): FormData {
  if (typeof window === "undefined") return INITIAL_FORM;
  try {
    const raw = localStorage.getItem("accountForm");
    return raw ? JSON.parse(raw) : INITIAL_FORM;
  } catch {
    return INITIAL_FORM;
  }
}

// ─── Section card ─────────────────────────────────────────────────────────────
function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 space-y-4">
      <h2 className="text-base md:text-xl lg:text-xl font-semibold text-textPrimary">{title}</h2>
      {children}
    </div>
  );
}

// ─── Editable text field ──────────────────────────────────────────────────────
function EditField({
  label, value, onChange, placeholder, error, readOnly = false,
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  error?: string;
  readOnly?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs md:text-sm lg:text-sm font-semibold text-textPrimary">{label}</label>
      <input
        type="text"
        value={value}
        readOnly={readOnly}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className={`border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 transition-all placeholder:text-xs placeholder:text-textSecondary ${
          readOnly
            ? "bg-gray-50 border-gray-200 text-gray-500 cursor-default"
            : error
              ? "border-red-400 bg-red-50"
              : "border-gray-200 bg-white text-gray-800"
        }`}
      />
      {error && <p className="text-[11px] text-red-500">{error}</p>}
    </div>
  );
}

// ─── Read-only field ──────────────────────────────────────────────────────────
function ReadField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs md:text-sm lg:text-sm font-semibold text-textPrimary">{label}</label>
      <div className="border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 text-sm text-gray-700 min-h-[40px]">
        {value}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function EditAccountPage() {
  const router = useRouter();
  const [draft, setDraft] = useState<FormData>(getSavedForm);
  const [phoneError, setPhoneError] = useState("");
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [saved, setSaved] = useState(false);

  const set = (key: keyof FormData) => (v: string) =>
    setDraft((prev) => ({ ...prev, [key]: v }));

  const validateForm = (): boolean => {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!draft.firstName.trim()) e.firstName = "Required";
    if (!draft.lastName.trim()) e.lastName = "Required";
    if (!draft.medRegNumber.trim()) e.medRegNumber = "Required";
    if (!draft.medRegBoard.trim()) e.medRegBoard = "Required";
    if (!draft.designation.trim()) e.designation = "Required";
    if (!draft.institution.trim()) e.institution = "Required";

    let phoneValid = true;
    if (!draft.phone) {
      setPhoneError("Mobile number is required");
      phoneValid = false;
    } else if (!isValidPhoneNumber(draft.phone)) {
      setPhoneError("Enter a valid phone number");
      phoneValid = false;
    } else {
      setPhoneError("");
    }

    setFormErrors(e);
    return Object.keys(e).length === 0 && phoneValid;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    localStorage.setItem("accountForm", JSON.stringify(draft));
    sessionStorage.setItem("profileSaved", "true");

    setSaved(true);
    setTimeout(() => {
      router.push("/myaccount");
    }, 1500);
  };

  const handleCancel = () => {
    router.push("/myaccount");
  };

  return (
    <div className="mx-auto space-y-4">

      {/* ── Account Info ── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 space-y-4">
        <h2 className="text-base md:text-xl lg:text-xl font-semibold text-textPrimary">Account Info</h2>

        <div className="grid grid-cols-1 gap-4">
          <ReadField label="Google Account" value={draft.googleAccount} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ReadField label="Email ID" value={draft.emailId} />

          <div className="flex flex-col gap-1">
            <label className="text-xs md:text-sm lg:text-sm font-semibold text-textPrimary">
              Mobile Number
            </label>
            <PhoneInput
              defaultCountry="in"
              value={draft.phone}
              onChange={(phone) => {
                setDraft((prev) => ({ ...prev, phone }));
                if (phone && isValidPhoneNumber(phone)) setPhoneError("");
              }}
              style={{ width: "100%" }}
            />
            {phoneError && <p className="text-[11px] text-red-500">{phoneError}</p>}
          </div>
        </div>
      </div>

      {/* ── Personal Info ── */}
      <SectionCard title="Personal Info">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs md:text-sm lg:text-sm font-semibold text-textPrimary">Salutation</label>
            <div className="relative">
              <select
                value={draft.salutation}
                onChange={(e) => set("salutation")(e.target.value)}
                className="w-full appearance-none border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-secondary/30 transition-all pr-8"
              >
                {SALUTATIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>
          </div>

          <EditField
            label="First Name"
            value={draft.firstName}
            onChange={set("firstName")}
            placeholder="First Name"
            error={formErrors.firstName}
          />
          <EditField
            label="Last Name"
            value={draft.lastName}
            onChange={set("lastName")}
            placeholder="Last Name"
            error={formErrors.lastName}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <EditField
            label="Location (Optional)"
            value={draft.location}
            onChange={set("location")}
            placeholder="Eg: 4, Nowhere street, Chennai"
          />
          <EditField
            label="Pin code"
            value={draft.pinCode}
            onChange={set("pinCode")}
            placeholder="Eg: 600001"
          />
        </div>
      </SectionCard>

      {/* ── Professional Info ── */}
      <SectionCard title="Professional Info">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <EditField
            label="Medical Registration Number"
            value={draft.medRegNumber}
            onChange={set("medRegNumber")}
            placeholder="Eg: TNMC 123456"
            error={formErrors.medRegNumber}
          />
          <EditField
            label="Medical Registration Board"
            value={draft.medRegBoard}
            onChange={set("medRegBoard")}
            placeholder="Eg: Tamil Nadu Medical Council"
            error={formErrors.medRegBoard}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <EditField
            label="Designation"
            value={draft.designation}
            onChange={set("designation")}
            placeholder="Eg: Consultant"
            error={formErrors.designation}
          />
          <EditField
            label="Institution"
            value={draft.institution}
            onChange={set("institution")}
            placeholder="Eg: Apollo Hospitals, Chennai"
            error={formErrors.institution}
          />
        </div>
      </SectionCard>

      {/* ── Bottom action buttons ── */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pb-6">
        <button
          onClick={handleCancel}
          className="w-full sm:w-auto flex items-center justify-center gap-2 border border-gray-300 text-gray-700 text-sm font-semibold px-8 py-3 rounded-xl hover:bg-gray-50 transition-all"
        >
          Cancel
        </button>

        <button
          onClick={handleSave}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary hover:brightness-90 text-white text-sm font-semibold px-8 py-3 rounded-xl transition-all shadow-md shadow-primary/30"
        >
          <Save size={14} strokeWidth={2} />
          Save Changes
        </button>
      </div>

      {/* ── Toast ── */}
      {saved && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-success text-white text-sm font-semibold px-5 py-3 rounded-xl shadow-xl">
          <Check size={16} strokeWidth={2.5} />
          Profile saved successfully!
        </div>
      )}

    </div>
  );
}