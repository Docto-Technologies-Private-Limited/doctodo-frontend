"use client";

import {
  ArrowLeft,
  Mail,
  Smartphone,
  Eye,
  EyeOff,
  AlertTriangle,
  Lock,
} from "lucide-react";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { isValidPhoneNumber } from "libphonenumber-js";
import { useState } from "react";

type LoginMethod = "email" | "mobile";

export default function LoginPage() {
  const [loginMethod, setLoginMethod] = useState<LoginMethod>("email");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [mobileTouched, setMobileTouched] = useState(false);
  const [emailErr, setEmailErr] = useState("");
  const [passwordErr, setPasswordErr] = useState("");
  const [otpErr, setOtpErr] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);

  // ── Shared input class ───────────────────────────────────────────────────
  const inputCls =
    "w-full border border-divider rounded-[10px] px-4 py-3 text-sm text-textPrimary " +
    "placeholder-textDisabled bg-white outline-none transition-all " +
    "focus:border-secondary focus:ring-2 focus:ring-secondary/20";

  // ── Phone validation ─────────────────────────────────────────────────────
  const handlePhoneChange = (phone: string) => {
    setMobile(phone);
    if (!mobileTouched) return;
    setPhoneError(
      phone && !isValidPhoneNumber(phone)
        ? "Invalid phone number for selected country"
        : ""
    );
  };

  // ── Tab switch ───────────────────────────────────────────────────────────
  const switchTab = (method: LoginMethod) => {
    if (loginMethod === method) return;
    setLoginMethod(method);
    if (method === "email") {
      setMobile(""); setPhoneError(""); setMobileTouched(false);
      setOtp(""); setOtpErr(""); setShowOtp(false);
    } else {
      setEmail(""); setPassword(""); setEmailErr(""); setPasswordErr("");
      setShowPassword(false);
    }
  };

  // ── Submit ───────────────────────────────────────────────────────────────
  const handleSubmit = () => {
    let valid = true;
    if (loginMethod === "email") {
      if (!email.trim()) { setEmailErr("Email is required"); valid = false; }
      else setEmailErr("");
      if (!password.trim()) { setPasswordErr("Password / Login code is required"); valid = false; }
      else setPasswordErr("");
    } else {
      if (!mobile || !isValidPhoneNumber(mobile)) {
        setPhoneError("Please enter a valid mobile number");
        setMobileTouched(true); valid = false;
      } else setPhoneError("");
      if (!otp.trim()) { setOtpErr("OTP / Login code is required"); valid = false; }
      else setOtpErr("");
    }
    if (!valid) return;
    window.location.href = "/dashboard";
  };

  // ── Inline error message ─────────────────────────────────────────────────
  const ErrMsg = ({ msg }: { msg: string }) => (
    <p className="flex items-center gap-1 text-alert text-xs mt-1.5">
      <AlertTriangle size={12} className="flex-shrink-0" />
      {msg}
    </p>
  );

  // ── Guidelines card — reused in desktop right panel & mobile/tablet section
  const GuidelinesCard = () => (
    <div
      className="relative z-10 w-full rounded-[18px] p-7 bg-secondary"
      style={{ maxWidth: "480px", boxShadow: "0 8px 32px rgba(10,52,88,0.28)" }}
    >
      <div className="mb-5">
        <h2 className="text-white font-bold text-lg mb-2.5">Login Guidelines</h2>
        <div className="h-[3px] w-9 bg-primary rounded-full" />
      </div>

      <div className="mb-5">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
          <h3 className="text-white font-bold text-sm">New Users</h3>
        </div>
        <p className="leading-relaxed ml-3.5 text-white/75 text-xs">
          Enter your email address, click on{" "}
          <span className="font-semibold text-white">&apos;Get login code in email&apos;</span>{" "}
          button and login via login code sent to your email address.
        </p>
      </div>

      <div className="mb-7">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
          <h3 className="text-white font-bold text-sm">Existing Users</h3>
        </div>
        <p className="leading-relaxed ml-3.5 text-white/75 text-xs">
          Enter your email address and your login code or password to login. If you have forgot
          your password, click on{" "}
          <span className="font-semibold text-white">&apos;Get login code in email&apos;</span>{" "}
          button and login via login code sent to your email address. You can change your
          password in{" "}
          <span className="font-semibold text-white">&apos;Menu → My Accounts&apos;</span>.
        </p>
      </div>

      <div className="border-t border-white/15 mb-5" />

      <div className="flex items-center gap-2">
        <Lock size={15} className="text-white/70 flex-shrink-0" strokeWidth={2} />
        <p className="text-white/75 text-xs">Your credentials are secure and encrypted</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen w-full flex flex-col">

      {/* ── Mobile / Tablet Topbar — hidden on lg+ ───────────────────────── */}
      <div className="lg:hidden flex items-center gap-2 bg-white border-b border-divider px-4 py-3.5 flex-shrink-0">
        <button
          onClick={() => (window.location.href = "/")}
          className="flex items-center gap-1.5 text-textPrimary font-semibold text-xl"
        >
          <ArrowLeft />
          Login
        </button>
      </div>

      {/* ── Main layout: column on mobile/tablet, row on desktop ─────────── */}
      <div className="flex-1 flex flex-col lg:flex-row">

        {/* ── LEFT — White form panel ─────────────────────────────────── */}
        <div className="flex-1 flex flex-col bg-white">

          {/* Back button — desktop only, sits above the centered form */}
          <div className="hidden lg:block px-8 pt-6 pb-1">
            <button
              onClick={() => (window.location.href = "/")}
              className="flex items-center gap-1.5 text-secondary font-semibold text-sm hover:opacity-75 transition-opacity"
            >
              <ArrowLeft size={18} strokeWidth={2.5} />
              Back
            </button>
          </div>

          {/* Form card — centered in the remaining height */}
          <div className="flex flex-1 items-center justify-center px-4 py-6 sm:px-8 sm:py-8">
            <div
              className="w-full rounded-2xl bg-white p-7 sm:p-9"
              style={{ maxWidth: "460px", boxShadow: "rgba(99,99,99,0.18) 0px 2px 12px 0px" }}
            >
              {/* Heading */}
              <div className="text-center mb-7">
                <h1 className="font-bold text-secondary text-2xl tracking-tight mb-1.5 leading-snug">
                  Welcome to Meganeuron NT
                </h1>
                <p className="text-textSecondary text-sm">
                  Please Enter your details to login
                </p>
              </div>

              {/* Toggle */}
              <div className="flex bg-lightBg rounded-xl p-1.5 mb-7 gap-1">
                {(["email", "mobile"] as LoginMethod[]).map((method) => (
                  <button
                    key={method}
                    type="button"
                    onPointerDown={() => switchTab(method)}
                    className={`
                      flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[9px]
                      font-semibold text-sm transition-all duration-200 touch-manipulation
                      ${loginMethod === method
                        ? "bg-secondary text-white shadow-md"
                        : "bg-transparent text-secondary"
                      }
                    `}
                  >
                    {method === "email"
                      ? <Mail size={15} strokeWidth={2} />
                      : <Smartphone size={15} strokeWidth={2} />
                    }
                    {method === "email" ? "Email" : "Mobile"}
                  </button>
                ))}
              </div>

              {/* ── Fields ── */}
              <div className="mb-6">

                {/* EMAIL PANEL */}
                <div className={loginMethod === "email" ? "block space-y-4" : "hidden"}>
                  <div>
                    <label className="block font-semibold text-secondary text-sm mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); if (e.target.value) setEmailErr(""); }}
                      placeholder="Enter your email"
                      className={`${inputCls} ${emailErr ? "border-alert" : ""}`}
                    />
                    {emailErr && <ErrMsg msg={emailErr} />}
                  </div>

                  <div>
                    <label className="block font-semibold text-secondary text-sm mb-1.5">
                      Password/Login code
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); if (e.target.value) setPasswordErr(""); }}
                        placeholder="Enter your Login code or Password"
                        className={`${inputCls} pr-11 ${passwordErr ? "border-alert" : ""}`}
                      />
                      <button
                        type="button"
                        onPointerDown={() => setShowPassword((p) => !p)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-textSecondary hover:text-secondary transition-colors touch-manipulation"
                      >
                        {showPassword
                          ? <EyeOff size={18} strokeWidth={1.8} />
                          : <Eye size={18} strokeWidth={1.8} />
                        }
                      </button>
                    </div>
                    {passwordErr && <ErrMsg msg={passwordErr} />}
                  </div>
                </div>

                {/* MOBILE PANEL */}
                <div className={loginMethod === "mobile" ? "block space-y-4" : "hidden"}>
                  <div>
                    <label className="block font-semibold text-secondary text-sm mb-1.5">
                      Mobile Number
                    </label>
                    <div
                      className={`
                        rounded-[10px] min-h-[48px] flex items-center border transition-all overflow-hidden
                        focus-within:border-secondary focus-within:ring-2 focus-within:ring-secondary/20
                        ${phoneError ? "border-alert" : "border-divider"}
                      `}
                      onKeyDown={() => { if (!mobileTouched) setMobileTouched(true); }}
                    >
                      <PhoneInput
                        defaultCountry="in"
                        value={mobile}
                        onChange={handlePhoneChange}
                        className="w-full"
                        inputClassName="!w-full !border-none !outline-none !shadow-none !px-4 !py-3 !text-sm !bg-transparent !h-auto"
                        countrySelectorStyleProps={{
                          buttonClassName: "!border-none !bg-transparent hover:!bg-gray-50 !px-3 !h-full",
                        }}
                      />
                    </div>
                    {mobileTouched && phoneError && <ErrMsg msg={phoneError} />}
                  </div>

                  <div>
                    <label className="block font-semibold text-secondary text-sm mb-1.5">
                      OTP / Login code
                    </label>
                    <div className="relative">
                      <input
                        type={showOtp ? "text" : "password"}
                        value={otp}
                        onChange={(e) => { setOtp(e.target.value); if (e.target.value) setOtpErr(""); }}
                        placeholder="Enter your OTP or Login code"
                        className={`${inputCls} pr-11 ${otpErr ? "border-alert" : ""}`}
                      />
                      <button
                        type="button"
                        onPointerDown={() => setShowOtp((p) => !p)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-textSecondary hover:text-secondary transition-colors touch-manipulation"
                      >
                        {showOtp
                          ? <EyeOff size={18} strokeWidth={1.8} />
                          : <Eye size={18} strokeWidth={1.8} />
                        }
                      </button>
                    </div>
                    {otpErr && <ErrMsg msg={otpErr} />}
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full bg-primary active:bg-secondary active:scale-[0.99] text-white font-bold py-3.5 rounded-xl text-sm tracking-wide transition-all duration-150 touch-manipulation"
                >
                  Login
                </button>
                <button
                  type="button"
                  className="w-full border-2 border-primary text-primary active:scale-[0.99] font-bold py-3.5 rounded-xl text-sm tracking-wide transition-all duration-150 touch-manipulation bg-white"
                >
                  {loginMethod === "email" ? "Get Login Code Via Email" : "Get OTP Via SMS"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT — Background image + Guidelines card ──────────────── */}
        {/* Desktop: fills right half at full height
            Mobile/Tablet: full-width section below the form */}
        <div className="flex-1 relative flex items-center justify-center px-4 py-8 sm:px-8 min-h-[460px] lg:min-h-0 bg-welcomeLight">
          <img
            src="/images/elements/login-bg.png"
            alt="login-bg"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <GuidelinesCard />
        </div>

      </div>
    </div>
  );
}