"use client";

import { PhoneInput } from 'react-international-phone'
import 'react-international-phone/style.css'
import { isValidPhoneNumber } from 'libphonenumber-js'
import { useState } from "react";
import { theme } from '@/lib/theme'; // adjust to your actual path

type LoginMethod = "email" | "mobile";

// Derive a focus-ring rgba from the secondary hex at ~15% opacity
const secondaryRing = `${theme.colors.secondary}26`; // hex + "26" ≈ 15% alpha

export default function LoginPage() {
    const [loginMethod, setLoginMethod] = useState<LoginMethod>("email");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [mobile, setMobile] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [mobileTouched, setMobileTouched] = useState(false);

    // Validation error states for inline messages
    const [emailErr, setEmailErr] = useState('');
    const [passwordErr, setPasswordErr] = useState('');
    const [otpErr, setOtpErr] = useState('');
    const [otp, setOtp] = useState('');
    const [showOtp, setShowOtp] = useState<boolean>(false);

    // ── Shared input class — all theme tokens, no hardcoded hex ──────────────
    const inputCls =
        "w-full border border-divider rounded-lg px-4 py-3 text-sm text-textPrimary " +
        "placeholder-textDisabled focus:outline-none focus:border-secondary transition-all";

    // Focus shadow uses the derived rgba so it stays on-theme
    const inputFocusStyle: React.CSSProperties = {
        // applied via onFocus/onBlur or CSS-in-JS; simpler: use a wrapper approach
    };

    // ── Phone validation ─────────────────────────────────────────────────────
    const handlePhoneChange = (phone: string) => {
        setMobile(phone);
        if (!mobileTouched) return;
        setPhoneError(
            phone && !isValidPhoneNumber(phone)
                ? 'Invalid phone number for selected country'
                : ''
        );
    };

    const handlePhoneKeyDown = () => {
        if (!mobileTouched) setMobileTouched(true);
    };

    // ── Tab switch — clear the OTHER tab's values ────────────────────────────
    const switchTab = (method: LoginMethod) => {
        if (loginMethod === method) return;
        setLoginMethod(method);
        if (method === "email") {
            setMobile('');
            setPhoneError('');
            setMobileTouched(false);
            setOtp('');
            setOtpErr('');
            setShowOtp(false);   // ← reset eye state on tab switch
        } else {
            setEmail('');
            setPassword('');
            setEmailErr('');
            setPasswordErr('');
            setShowPassword(false);
        }
    };

    // ── Form submit with inline validation (works despite hidden fields) ──────
    const handleSubmit = () => {
        let valid = true;

        if (loginMethod === "email") {
            if (!email.trim()) { setEmailErr('Email is required'); valid = false; }
            else setEmailErr('');
            if (!password.trim()) { setPasswordErr('Password / Login code is required'); valid = false; }
            else setPasswordErr('');
        } else {
            if (!mobile || !isValidPhoneNumber(mobile)) {
                setPhoneError('Please enter a valid mobile number');
                setMobileTouched(true);
                valid = false;
            } else setPhoneError('');
            if (!otp.trim()) { setOtpErr('OTP / Login code is required'); valid = false; }
            else setOtpErr('');
        }

        if (!valid) return;
        // proceed with login...
        window.location.href = "/dashboard";
    };

    // ── Phone wrapper border style (dynamic, uses theme) ─────────────────────
    const phoneWrapperStyle = (hasError: boolean): React.CSSProperties => ({
        borderColor: hasError ? theme.colors.alert : theme.colors.divider,
    });
    const phoneWrapperFocusCls = `rounded-lg min-h-[48px] flex items-center border transition-all
        focus-within:border-secondary focus-within:[box-shadow:0_0_0_3px_${secondaryRing}]`;

    return (
        <div className="min-h-screen w-full lg:flex items-stretch">

            <div className="px-4 sm:px-8 pt-4 sm:pt-6">
                <button
                   onClick={() => window.location.href = '/'}
                    className="flex items-center gap-2 text-secondary font-semibold text-sm sm:text-base hover:opacity-80 transition-all"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 sm:w-6 sm:h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                </button>
            </div>

            {/* ── LEFT ─────────────────────────────────────────────────── */}
            <div className="flex-1 flex items-center justify-center px-4 py-4 sm:px-8 sm:py-8">
                <div className="p-8 rounded-2xl w-full max-w-[500px]"
                    style={{ boxShadow: "rgba(99,99,99,0.2) 0px 2px 8px 0px" }}>

                    {/* Heading */}
                    <div className="text-center mb-7">
                        <h1 className="text-2xl md:text-3xl font-bold text-secondary tracking-tight mb-1.5">
                            Welcome to Meganeuron NT
                        </h1>
                        <p className="text-sm text-textSecondary">Please enter your details to login</p>
                    </div>

                    {/* Toggle */}
                    <div className="flex rounded-xl p-1 mb-7 gap-1 bg-lightBg">
                        {(["email", "mobile"] as LoginMethod[]).map((method) => (
                            <button
                                key={method}
                                type="button"
                                onPointerDown={() => switchTab(method)}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg
                                    text-sm font-semibold transition-all duration-200 touch-manipulation
                                    ${loginMethod === method ? "bg-secondary text-white shadow-md" : "text-secondary"}`}
                            >
                                {method === "email" ? (
                                    <>
                                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                        </svg>
                                        Email
                                    </>
                                ) : (
                                    <>
                                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 15h3" />
                                        </svg>
                                        Mobile
                                    </>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-4 mb-6">

                        {/* ── EMAIL PANEL ── */}
                        <div className={loginMethod === "email" ? "block space-y-4" : "hidden"}>

                            <div>
                                <label className="block text-sm font-semibold text-secondary mb-1.5">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => { setEmail(e.target.value); if (e.target.value) setEmailErr(''); }}
                                    placeholder="Enter your email"
                                    className={`${inputCls} ${emailErr ? 'border-alert' : ''}`}
                                    style={{ boxShadow: 'none' }}
                                    onFocus={e => e.currentTarget.style.boxShadow = `0 0 0 3px ${secondaryRing}`}
                                    onBlur={e => e.currentTarget.style.boxShadow = 'none'}
                                />
                                {emailErr && (
                                    <p className="text-alert text-xs flex items-center gap-1 mt-1">⚠ {emailErr}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-secondary mb-1.5">Password / Login code</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => { setPassword(e.target.value); if (e.target.value) setPasswordErr(''); }}
                                        placeholder="Enter your Login code or Password"
                                        className={`${inputCls} pr-11 ${passwordErr ? 'border-alert' : ''}`}
                                        style={{ boxShadow: 'none' }}
                                        onFocus={e => e.currentTarget.style.boxShadow = `0 0 0 3px ${secondaryRing}`}
                                        onBlur={e => e.currentTarget.style.boxShadow = 'none'}
                                    />
                                    <button
                                        type="button"
                                        onPointerDown={() => setShowPassword(p => !p)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-textDisabled hover:text-textSecondary transition-colors touch-manipulation"
                                    >
                                        {showPassword ? (
                                            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                            </svg>
                                        ) : (
                                            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                {passwordErr && (
                                    <p className="text-alert text-xs flex items-center gap-1 mt-1">⚠ {passwordErr}</p>
                                )}
                            </div>
                        </div>

                        {/* ── MOBILE PANEL ── */}
                        <div className={loginMethod === "mobile" ? "block space-y-4" : "hidden"}>

                            <div className="space-y-1.5">
                                <label className="block text-sm font-semibold text-secondary">Mobile Number</label>
                                <div
                                    onKeyDown={handlePhoneKeyDown}
                                    className="rounded-lg min-h-[48px] flex items-center border transition-all"
                                    style={{
                                        borderColor: phoneError ? theme.colors.alert : theme.colors.divider,
                                    }}
                                    onFocusCapture={e => {
                                        (e.currentTarget as HTMLDivElement).style.borderColor = phoneError ? theme.colors.alert : theme.colors.secondary;
                                        (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 0 3px ${secondaryRing}`;
                                    }}
                                    onBlurCapture={e => {
                                        (e.currentTarget as HTMLDivElement).style.borderColor = phoneError ? theme.colors.alert : theme.colors.divider;
                                        (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                                    }}
                                >
                                    <PhoneInput
                                        defaultCountry="in"
                                        value={mobile}
                                        onChange={handlePhoneChange}
                                        className="w-full"
                                        inputClassName="!w-full !border-none !outline-none !shadow-none !px-4 !py-3 !text-sm !bg-transparent !h-auto"
                                        countrySelectorStyleProps={{
                                            buttonClassName: "!border-none !bg-transparent hover:!bg-gray-100 !px-3 !h-full",
                                        }}
                                    />
                                </div>
                                {mobileTouched && phoneError && (
                                    <p className="text-alert text-xs flex items-center gap-1 mt-1">⚠ {phoneError}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-secondary mb-1.5">OTP / Login code</label>
                                <div className="relative">
                                    <input
                                        type={showOtp ? "text" : "password"}
                                        value={otp}
                                        onChange={(e) => { setOtp(e.target.value); if (e.target.value) setOtpErr(''); }}
                                        placeholder="Enter your OTP or Login code"
                                        className={`${inputCls} pr-11 ${otpErr ? 'border-alert' : ''}`}
                                        style={{ boxShadow: 'none' }}
                                        onFocus={e => e.currentTarget.style.boxShadow = `0 0 0 3px ${secondaryRing}`}
                                        onBlur={e => e.currentTarget.style.boxShadow = 'none'}
                                    />
                                    <button
                                        type="button"
                                        onPointerDown={() => setShowOtp(p => !p)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-textDisabled hover:text-textSecondary transition-colors touch-manipulation"
                                    >
                                        {showOtp ? (
                                            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                            </svg>
                                        ) : (
                                            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                {otpErr && (
                                    <p className="text-alert text-xs flex items-center gap-1 mt-1">⚠ {otpErr}</p>
                                )}
                            </div>
                        </div>

                    </div>

                    {/* CTA Buttons */}
                    <div className="space-y-3">
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="w-full bg-primary active:bg-secondary active:scale-[0.99] text-white font-bold py-3.5 rounded-xl text-sm tracking-wide transition-all duration-150 touch-manipulation"
                            style={{ boxShadow: `0 4px 12px ${theme.colors.primary}40` }}
                        >
                            Login
                        </button>
                        <button
                            type="button"
                            className="w-full border-2 border-primary text-primary active:scale-[0.99] font-bold py-3.5 rounded-xl text-sm tracking-wide transition-all duration-150 touch-manipulation"
                        >
                            {loginMethod === "email" ? "Get Login Code Via Email" : "Get OTP Via SMS"}
                        </button>
                    </div>

                </div>
            </div>

            {/* ── RIGHT — unchanged ─────────────────────────────────────── */}
            <div className="flex-1 relative flex items-center justify-center overflow-hidden min-h-0 px-4 py-4 sm:px-8 sm:py-8">
                <div className="absolute inset-0 bg-welcomeLight" />
                <img
                    src="/images/elements/login-bg.png"
                    alt="login-bg"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div
                    className="relative z-10 p-8 rounded-2xl shadow-xl text-left bg-secondary w-full max-w-[500px]"
                    style={{ width: "500px" }}
                >
                    <div className="mb-6">
                        <h2 className="text-base font-bold text-white mb-2">Login Guidelines</h2>
                        <div className="w-10 h-0.5 bg-primary rounded-full" />
                    </div>
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
                            <h3 className="text-white font-semibold text-sm">New Users</h3>
                        </div>
                        <p className="text-white text-xs leading-relaxed ml-3.5">
                            Enter your email address, click on{" "}
                            <span className="font-semibold text-white">&apos;Get login code in email&apos;</span>{" "}
                            button and login via login code sent to your email address.
                        </p>
                    </div>
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
                            <h3 className="text-white font-semibold text-sm">Existing Users</h3>
                        </div>
                        <p className="text-white text-xs leading-relaxed ml-3.5">
                           Enter your email address and your login code or password to login. If you have forgot your password, click on{" "}
                            <span className="font-semibold text-white">&apos;Get login code in email&apos;</span>
                            button and login via login code sent to your email address. You can change your password in{" "}
                            <span className="font-semibold text-white">&apos;Menu → My Accounts&apos;</span>.
                        </p>
                    </div>
                    <div className="border-t mb-5" style={{ borderColor: `${theme.colors.divider}26` }} />
                    <div className="flex items-center gap-2">
                        <span className="text-base">🔒</span>
                        <p className="text-white text-xs">Your credentials are secure and encrypted</p>
                    </div>
                </div>
            </div>

        </div>
    );
}