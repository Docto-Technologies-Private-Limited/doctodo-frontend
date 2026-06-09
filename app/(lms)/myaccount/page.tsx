"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { isValidPhoneNumber } from "libphonenumber-js";
import {
  Lock, Save, Eye, EyeOff, X, Check,
  SquarePen , ChevronDown
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type ModalType = "none" | "change-password" | "create-password";

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

interface PasswordForm {
  newPassword: string;
  confirmPassword: string;
}

interface CreatePasswordForm {
  newPassword: string;
  confirmPassword: string;
}

// ─── Mock initial state — flip `hasPassword` and `isProfileComplete` ─────────
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
 
// ─── Password field ───────────────────────────────────────────────────────────
function PasswordField({
  label, placeholder, value, onChange, error,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col gap-1">
      {/* INPUT LABEL */}
      <label className="text-xs md:text-sm lg:text-sm font-semibold text-textPrimary">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full border rounded-lg px-3 py-2.5 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-secondary/30 transition-all placeholder:text-xs placeholder:text-textSecondary ${error ? "border-red-400 bg-red-50" : "border-gray-200 bg-white"
            }`}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          {show ? <Eye size={16} /> : <EyeOff size={16} />}
        </button>
      </div>
      {error && <p className="text-[11px] text-red-500">{error}</p>}
    </div>
  );
}

// ─── Section card ─────────────────────────────────────────────────────────────
function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 space-y-4">
      {/* HEADING */}
      <h2 className="text-base md:text-xl lg:text-xl font-semibold text-textPrimary">{title}</h2>
      {children}
    </div>
  );
}

// ─── Read-only field ──────────────────────────────────────────────────────────
function ReadField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      {/* INPUT LABEL */}
      <label className="text-xs md:text-sm lg:text-sm font-semibold text-textPrimary">{label}</label>
      <div className="border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 text-sm text-gray-700 min-h-[40px]">
        {value}
      </div>
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
      {/* INPUT LABEL */}
      <label className="text-xs md:text-sm lg:text-sm font-semibold text-textPrimary">{label}</label>
      <input
        type="text"
        value={value}
        readOnly={readOnly}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className={`border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 transition-all placeholder:text-xs placeholder:text-textSecondary ${readOnly
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

// ─── Change Password Modal ────────────────────────────────────────────────────
function ChangePasswordModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState<PasswordForm>({ newPassword: "", confirmPassword: "" });
  const [errors, setErrors] = useState<Partial<PasswordForm>>({});
  const [saved, setSaved] = useState(false);

  const validate = () => {
    const e: Partial<PasswordForm> = {};
    if (!form.newPassword || form.newPassword.length < 8) e.newPassword = "Min 8 characters";
    if (form.confirmPassword !== form.newPassword) e.confirmPassword = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    setSaved(true);
    setTimeout(onClose, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-in fade-in zoom-in-95 duration-200">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-secondary text-white flex items-center justify-center hover:brightness-90 transition-all"
        >
         <X size={14} strokeWidth={2.5} />
        </button>

        <div className="mb-5">
          {/* HEADING */}
          <h3 className="text-base md:text-xl lg:text-xl font-semibold text-textPrimary">Change password</h3>
          {/* SUBTITLE */}
          <p className="text-xs md:text-sm lg:text-sm text-textSecondary mt-0.5">Update your password to keep your account secure</p>
        </div>

        <div className="space-y-4">
          <PasswordField
            label="New Password"
            placeholder="Enter your new password"
            value={form.newPassword}
            onChange={(v) => setForm({ ...form, newPassword: v })}
            error={errors.newPassword}
          />
          <PasswordField
            label="Confirm Password"
            placeholder="Confirm your new password"
            value={form.confirmPassword}
            onChange={(v) => setForm({ ...form, confirmPassword: v })}
            error={errors.confirmPassword}
          />
        </div>

        <div className="mt-6 flex justify-center">
          {saved ? (
            <div className="flex items-center gap-2 text-success font-semibold text-sm">
              <Check size={16} strokeWidth={2.5} />
              Password updated!
            </div>
          ) : (
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-primary hover:brightness-90 text-white text-sm font-semibold px-8 py-2.5 rounded-lg transition-all"
            >
              <Save size={14} strokeWidth={2} />
              Save
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Create Password Modal ────────────────────────────────────────────────────
function CreatePasswordModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState<CreatePasswordForm>({ newPassword: "", confirmPassword: "" });
  const [errors, setErrors] = useState<Partial<CreatePasswordForm>>({});

  const validate = () => {
    const e: Partial<CreatePasswordForm> = {};
    if (!form.newPassword || form.newPassword.length < 8) e.newPassword = "Min 8 characters";
    if (form.confirmPassword !== form.newPassword) e.confirmPassword = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onCreated();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-secondary text-white flex items-center justify-center hover:brightness-90 transition-all"
        >
         <X size={14} strokeWidth={2.5} />
        </button>

        <div className="mb-5">
          {/* HEADING */}
          <h3 className="text-base md:text-xl lg:text-xl font-semibold text-textPrimary">Create your password</h3>
          {/* SUBTITLE */}
          <p className="text-xs md:text-sm lg:text-sm text-textSecondary mt-0.5">Secure your account with a strong password</p>
        </div>

        <div className="space-y-4">
          <PasswordField
            label="New Password"
            placeholder="Enter your password"
            value={form.newPassword}
            onChange={(v) => setForm({ ...form, newPassword: v })}
            error={errors.newPassword}
          />
          <PasswordField
            label="Confirm Password"
            placeholder="Confirm your password"
            value={form.confirmPassword}
            onChange={(v) => setForm({ ...form, confirmPassword: v })}
            error={errors.confirmPassword}
          />
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-primary hover:brightness-90 text-white text-sm font-semibold px-8 py-2.5 rounded-lg transition-all"
          >
            <Save size={14} strokeWidth={2} />
            Save &amp; Continue
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function MyAccountPage() {
  const router = useRouter();

  const [hasPassword, setHasPassword] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [modal, setModal] = useState<ModalType>("none");

  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [draft, setDraft] = useState<FormData>(INITIAL_FORM);
  const [phoneError, setPhoneError] = useState("");
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [saved, setSaved] = useState(false);

  const set = (key: keyof FormData) => (v: string) =>
    setDraft((prev) => ({ ...prev, [key]: v }));

  const validateForm = () => {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!draft.firstName.trim()) e.firstName = "Required";
    if (!draft.lastName.trim()) e.lastName = "Required";
    if (!draft.medRegNumber.trim()) e.medRegNumber = "Required";
    if (!draft.medRegBoard.trim()) e.medRegBoard = "Required";
    if (!draft.designation.trim()) e.designation = "Required";
    if (!draft.institution.trim()) e.institution = "Required";

    if (!draft.phone) {
      setPhoneError("Mobile number is required");
    } else if (!isValidPhoneNumber(draft.phone)) {
      setPhoneError("Enter a valid phone number");
    } else {
      setPhoneError("");
    }

    setFormErrors(e);
    return Object.keys(e).length === 0 && !phoneError && isValidPhoneNumber(draft.phone || "");
  };

  // First-time Save & Continue — flips to read-only view with "Edit Account" button
  const handleSave = () => {
    if (!validateForm()) return;
    setForm(draft);
    setIsProfileComplete(true);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  // showEditMode only when profile hasn't been completed yet
  const showEditMode = !isProfileComplete;

  return (
    <>
      {/* ── Modals ── */}
      {modal === "change-password" && (
        <ChangePasswordModal onClose={() => setModal("none")} />
      )}
      {modal === "create-password" && (
        <CreatePasswordModal
          onClose={() => setModal("none")}
          onCreated={() => {
            setHasPassword(true);
            setModal("none");
          }}
        />
      )}

      <div className="mx-auto space-y-4">

        {/* ── Status Banner ── */}
        {!isProfileComplete ? (
          <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
            <span className="text-base">🎉</span>
            <p className="text-sm text-textPrimary">
              <span className="font-bold text-welcome">Welcome!</span>{" "}
              {/* SUBTITLE */}
              <span className="text-xs md:text-sm lg:text-sm text-textSecondary">Please complete your profile below.</span>
            </p>
          </div>
        ) : (
         <div className="flex items-center justify-between gap-3 bg-successLight border border-success rounded-xl px-4 py-3">
            <div className="flex flex-col gap-0.5">
              {/* HEADING with icon inline */}
              <div className="flex items-center gap-1.5">
                <SquarePen size={14} strokeWidth={2} className="text-success" />
                <p className="text-sm font-semibold text-success">Edit your Account</p>
              </div>
              {/* SUBTITLE */}
              <p className="text-xs text-textSecondary">Update your personal and professional information</p>
            </div>

           <button
            onClick={() => router.push("/edit-account")}
            className="flex items-center gap-1.5 bg-success text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors flex-shrink-0"
          >
            <SquarePen size={14} strokeWidth={2} />
            <span className="hidden sm:inline">Edit Account</span>
            <span className="sm:hidden">Edit</span>
          </button>
          </div>
        )}

        {/* ── Account Info ── */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 space-y-4">

          {/* HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h2 className="text-base md:text-xl lg:text-xl font-semibold text-textPrimary">
              Account Info
            </h2>

            <button
              onClick={() => setModal(hasPassword ? "change-password" : "create-password")}
              className="flex items-center gap-2 bg-secondary hover:brightness-90 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-all w-fit"
            >
              <Lock size={14} strokeWidth={2} />
              {hasPassword ? "Change Password" : "Set your Password"}
            </button>
          </div>

          {/* GOOGLE ACCOUNT */}
          <div className="grid grid-cols-1 gap-4">
            <ReadField label="Google Account" value={form.googleAccount} />
          </div>

          {/* EMAIL + PHONE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ReadField label="Email ID" value={form.emailId} />

            <div className="flex flex-col gap-1">
              <label className="text-xs md:text-sm lg:text-sm font-semibold text-textPrimary">
                Mobile Number
              </label>

              {showEditMode ? (
                <>
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
                </>
              ) : (
                <div className="border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 text-sm text-gray-700">
                  {form.phone}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Personal Info ── */}
        <SectionCard title="Personal Info">
          {showEditMode ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                  {/* INPUT LABEL */}
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
                    <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <EditField label="First Name" value={draft.firstName} onChange={set("firstName")} placeholder="First Name" error={formErrors.firstName} />
                <EditField label="Last Name" value={draft.lastName} onChange={set("lastName")} placeholder="Last Name" error={formErrors.lastName} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <EditField label="Location (Optional)" value={draft.location} onChange={set("location")} placeholder="Eg: 4, Nowhere street, Chennai" />
                <EditField label="Pin code" value={draft.pinCode} onChange={set("pinCode")} placeholder="Eg: 600001" />
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <ReadField label="Salutation" value={form.salutation} />
                <ReadField label="First Name" value={form.firstName} />
                <ReadField label="Last Name" value={form.lastName} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ReadField label="Location (Optional)" value={form.location} />
                <ReadField label="Pin code" value={form.pinCode} />
              </div>
            </>
          )}
        </SectionCard>

        {/* ── Professional Info ── */}
        <SectionCard title="Professional Info">
          {showEditMode ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <EditField label="Medical Registration Number" value={draft.medRegNumber} onChange={set("medRegNumber")} placeholder="Eg: TNMC 123456" error={formErrors.medRegNumber} />
                <EditField label="Medical Registration Board" value={draft.medRegBoard} onChange={set("medRegBoard")} placeholder="Eg: Tamil Nadu Medical Council" error={formErrors.medRegBoard} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <EditField label="Designation" value={draft.designation} onChange={set("designation")} placeholder="Eg: Consultant" error={formErrors.designation} />
                <EditField label="Institution" value={draft.institution} onChange={set("institution")} placeholder="Eg: Apollo Hospitals, Chennai" error={formErrors.institution} />
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ReadField label="Medical Registration Number" value={form.medRegNumber} />
                <ReadField label="Medical Registration Board" value={form.medRegBoard} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ReadField label="Designation" value={form.designation} />
                <ReadField label="Institution" value={form.institution} />
              </div>
            </>
          )}
        </SectionCard>

        {/* ── Save & Continue (first-time only) ── */}
        {showEditMode && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pb-6">
            <button
              onClick={handleSave}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary hover:brightness-90 text-white text-sm font-semibold px-8 py-3 rounded-xl transition-all shadow-md shadow-primary/30"
            >
              <Save size={14} strokeWidth={2} />
              Save &amp; Continue
            </button>
          </div>
        )}

        {/* Success toast */}
        {saved && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-success text-white text-sm font-semibold px-5 py-3 rounded-xl shadow-xl">
            <Check size={16} strokeWidth={2.5} />
            Profile saved successfully!
          </div>
        )}

      </div>
    </>
  );
}