"use client";

import { useState } from "react";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { isValidPhoneNumber } from "libphonenumber-js";

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

// ─── Eye icon ─────────────────────────────────────────────────────────────────
function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

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
      <label className="text-xs font-semibold text-gray-700">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full border rounded-lg px-3 py-2.5 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-secondary/30 transition-all ${
            error ? "border-red-400 bg-red-50" : "border-gray-200 bg-white"
          }`}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <EyeIcon open={show} />
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
      <h2 className="text-base font-bold text-gray-900">{title}</h2>
      {children}
    </div>
  );
}

// ─── Read-only field ──────────────────────────────────────────────────────────
function ReadField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-600">{label}</label>
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
      <label className="text-xs font-semibold text-gray-600">{label}</label>
      <input
        type="text"
        value={value}
        readOnly={readOnly}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className={`border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 transition-all ${
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

// ─── Change Password Modal ────────────────────────────────────────────────────
function ChangePasswordModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState<PasswordForm>({newPassword: "", confirmPassword: "" });
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
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <div className="mb-5">
          <h3 className="text-lg font-bold text-gray-900">Change password</h3>
          <p className="text-xs text-gray-500 mt-0.5">Update your password to keep your account secure</p>
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
            <div className="flex items-center gap-2 text-green-600 font-semibold text-sm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Password updated!
            </div>
          ) : (
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-primary hover:brightness-90 text-white text-sm font-semibold px-8 py-2.5 rounded-lg transition-all"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                <polyline points="17 21 17 13 7 13 7 21"/>
                <polyline points="7 3 7 8 15 8"/>
              </svg>
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
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <div className="mb-5">
          <h3 className="text-lg font-bold text-gray-900">Create your password</h3>
          <p className="text-xs text-gray-500 mt-0.5">Secure your account with a strong password</p>
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
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
              <polyline points="17 21 17 13 7 13 7 21"/>
              <polyline points="7 3 7 8 15 8"/>
            </svg>
            Save &amp; Continue
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function MyAccountPage() {
  // Flip these two flags to simulate different states:
  //   hasPassword: false  → shows "Set your Password" button + Create Password modal
  //   isProfileComplete: false → shows "Welcome! Please complete your profile" banner
  //   isEditing: false → shows read-only view with "Edit Account" button
  const [hasPassword, setHasPassword] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [modal, setModal] = useState<ModalType>("none");

  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [draft, setDraft] = useState<FormData>(INITIAL_FORM); // draft while editing
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

    // Phone validation
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

  const handleSave = () => {
    if (!validateForm()) return;
    setForm(draft);
    setIsProfileComplete(true);
    setIsEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleEdit = () => {
    setDraft(form);
    setIsEditing(true);
    setFormErrors({});
    setPhoneError("");
  };

  const handleCancel = () => {
    setDraft(form);
    setIsEditing(false);
    setFormErrors({});
    setPhoneError("");
  };

  // Start in editing mode if profile is not complete yet
  const showEditMode = isEditing || !isProfileComplete;

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

        {/* ── Page header ── */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">My Account</h1>
        </div>

        {/* ── Status Banner ── */}
        {!isProfileComplete ? (
          /* Welcome — profile incomplete */
          <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
            <span className="text-base">🎉</span>
            <p className="text-sm text-blue-800">
              <span className="font-bold text-secondary">Welcome!</span>{" "}
              Please complete your profile below.
            </p>
          </div>
        ) : (
          /* Profile complete — show edit prompt */
          <div className="flex items-center justify-between gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
            <div className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              <div>
                <p className="text-sm font-bold text-green-800">Edit your Account</p>
                <p className="text-xs text-green-700">Update your personal and professional information</p>
              </div>
            </div>
            {!isEditing && (
              <button
                onClick={handleEdit}
                className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors flex-shrink-0"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                Edit Account
              </button>
            )}
          </div>
        )}

        {/* ── Account Info ── */}
        <SectionCard title="Account Info">
          {/* Change / Set Password button top-right */}
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex-1 min-w-0" />
            <button
              onClick={() => setModal(hasPassword ? "change-password" : "create-password")}
              className="flex items-center gap-2 bg-secondary hover:brightness-90 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-all flex-shrink-0"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              {hasPassword ? "Change Password" : "Set your Password"}
            </button>
          </div>

          {/* Google Account — always read-only */}
          <div className="grid grid-cols-1 gap-4">
            <ReadField label="Google Account" value={form.googleAccount} />
          </div>

          {/* Email + Mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ReadField label="Email ID" value={form.emailId} />

            {/* Mobile with PhoneInput */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600">Mobile Number</label>
              {showEditMode ? (
                <>
                  <PhoneInput
                    defaultCountry="in"
                    value={draft.phone}
                    onChange={(phone) => {
                      setDraft((prev) => ({ ...prev, phone }));
                      if (phone && isValidPhoneNumber(phone)) setPhoneError("");
                    }}
                    style={{
                      width: "100%",
                      "--react-international-phone-border-radius": "0.5rem",
                      "--react-international-phone-border-color": phoneError ? "#f87171" : "#e5e7eb",
                      "--react-international-phone-background-color": phoneError ? "#fef2f2" : "#fff",
                      "--react-international-phone-height": "40px",
                      "--react-international-phone-font-size": "0.875rem",
                    } as React.CSSProperties}
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
        </SectionCard>

        {/* ── Personal Info ── */}
        <SectionCard title="Personal Info">
          {showEditMode ? (
            <>
              {/* Salutation + First + Last */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Salutation */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-600">Salutation</label>
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
                    <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </div>
                </div>
                <EditField label="First Name" value={draft.firstName} onChange={set("firstName")} placeholder="First Name" error={formErrors.firstName} />
                <EditField label="Last Name"  value={draft.lastName}  onChange={set("lastName")}  placeholder="Last Name"  error={formErrors.lastName}  />
              </div>

              {/* Location + Pin */}
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
                <ReadField label="Last Name"  value={form.lastName}  />
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
                <EditField label="Medical Registration Board"  value={draft.medRegBoard}  onChange={set("medRegBoard")}  placeholder="Eg: Tamil Nadu Medical Council" error={formErrors.medRegBoard} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <EditField label="Designation" value={draft.designation} onChange={set("designation")} placeholder="Eg: Consultant" error={formErrors.designation} />
                <EditField label="Institution"  value={draft.institution}  onChange={set("institution")}  placeholder="Eg: Apollo Hospitals, Chennai" error={formErrors.institution} />
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ReadField label="Medical Registration Number" value={form.medRegNumber} />
                <ReadField label="Medical Registration Board"  value={form.medRegBoard}  />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ReadField label="Designation" value={form.designation} />
                <ReadField label="Institution"  value={form.institution}  />
              </div>
            </>
          )}
        </SectionCard>

        {/* ── Bottom action buttons ── */}
        {showEditMode && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pb-6">
            {/* Cancel — only when editing existing profile */}
            {isProfileComplete && (
              <button
                onClick={handleCancel}
                className="w-full sm:w-auto flex items-center justify-center gap-2 border border-gray-300 text-gray-700 text-sm font-semibold px-8 py-3 rounded-xl hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
            )}

            {/* Save */}
            <button
              onClick={handleSave}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary hover:brightness-90 text-white text-sm font-semibold px-8 py-3 rounded-xl transition-all shadow-md shadow-primary/30"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                <polyline points="17 21 17 13 7 13 7 21"/>
                <polyline points="7 3 7 8 15 8"/>
              </svg>
              {isProfileComplete ? "Save Changes" : "Save & Continue"}
            </button>
          </div>
        )}

        {/* Success toast */}
        {saved && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-green-600 text-white text-sm font-semibold px-5 py-3 rounded-xl shadow-xl">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Profile saved successfully!
          </div>
        )}

      </div>
    </>
  );
}