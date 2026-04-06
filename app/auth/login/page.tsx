"use client";

import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { useState, useCallback } from "react";

type LoginMethod = "email" | "mobile";

export default function LoginPage() {
    const [loginMethod, setLoginMethod] = useState<LoginMethod>("email");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [mobile, setMobile] = useState('');
    const [error, setError] = useState('');

    const handlePhoneChange = useCallback((phone: string) => {
        setMobile(phone);
        if (phone && !isValidPhoneNumber(phone)) {
            setError('Invalid phone number for selected country');
        } else {
            setError('');
        }
    }, []);

    
    const switchTab = useCallback((method: LoginMethod) => (e: React.MouseEvent) => {
        e.preventDefault();
        if (loginMethod !== method) setLoginMethod(method);
    }, [loginMethod]);

    const togglePassword = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        setShowPassword(prev => !prev);
    }, []);

    return (
        <div className="min-h-screen w-full lg:flex items-stretch">

            {/* LEFT */}
            <div className="flex-1 flex items-center justify-center px-4 py-4 sm:px-8 sm:py-8">
                <div className="p-8 rounded-2xl w-full max-w-[500px]" style={{
                    boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px"
                }}>

                    {/* Heading */}
                    <div className="text-center mb-7">
                        <h1 className="text-2xl md:text-3xl font-bold text-secondary tracking-tight mb-1.5">
                            Welcome to Meganeuron NT
                        </h1>
                        <p className="text-sm text-[#6b7a99]">Please Enter your details to login</p>
                    </div>

                    {/* Toggle
                        FIX 1: onClick instead of onPointerDown (see comment above).
                        FIX 2: touch-action and -webkit-tap-highlight-color are now
                        applied globally in globals.css to all buttons, so we don't
                        need to repeat them here (but touch-manipulation class is
                        harmless to keep for extra certainty).
                    */}
                    <div className="flex rounded-xl p-1 mb-7 gap-1 bg-lightBg">
                        <button
                            type="button"
                            onClick={switchTab("email")}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 touch-manipulation select-none ${
                                loginMethod === "email"
                                    ? "bg-[#1a3060] text-white shadow-md"
                                    : "text-secondary"
                            }`}
                        >
                            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                            </svg>
                            Email
                        </button>
                        <button
                            type="button"
                            onClick={switchTab("mobile")}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 touch-manipulation select-none ${
                                loginMethod === "mobile"
                                    ? "bg-[#1a3060] text-white shadow-md"
                                    : "text-secondary"
                            }`}
                        >
                            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 15h3" />
                            </svg>
                            Mobile
                        </button>
                    </div>

                    {/* Form Fields
                        FIX 3: Keep BOTH panels always mounted (never unmount PhoneInput).
                        Use visibility+height toggling instead of display:none to hide
                        the inactive panel.

                        WHY: When PhoneInput unmounts on tab switch it tears down its
                        internal touch listeners. On the next mount it re-initialises,
                        which on some Android browsers fires a spurious focus event that
                        steals the active touch target away from the tab button — causing
                        the switch to appear to do nothing.

                        Using `aria-hidden` + `invisible h-0 overflow-hidden` keeps the
                        elements in the DOM and in the accessibility tree correctly, while
                        ensuring they take up no space and cannot be interacted with when
                        the other tab is active.
                    */}
                    <div className="mb-6">

                        {/* EMAIL PANEL */}
                        <div
                            aria-hidden={loginMethod !== "email"}
                            className={loginMethod === "email"
                                ? "block space-y-4"
                                : "invisible h-0 overflow-hidden"
                            }
                        >
                            <div>
                                <label className="block text-sm font-semibold text-secondary mb-1.5">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    tabIndex={loginMethod === "email" ? 0 : -1}
                                    className="w-full border border-[#d1d9e6] rounded-lg px-4 py-3 text-sm text-secondary placeholder-[#b0bac9] focus:outline-none focus:border-[#1a3060] focus:ring-2 focus:ring-[#1a3060]/10 transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-secondary mb-1.5">Password/Login code</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                        placeholder="Enter your Login code or Password"
                                        tabIndex={loginMethod === "email" ? 0 : -1}
                                        className="w-full border border-[#d1d9e6] rounded-lg px-4 py-3 pr-11 text-sm text-secondary placeholder-[#b0bac9] focus:outline-none focus:border-[#1a3060] focus:ring-2 focus:ring-[#1a3060]/10 transition-all"
                                    />
                                    {/* FIX 4: onClick instead of onPointerDown here too */}
                                    <button
                                        type="button"
                                        onClick={togglePassword}
                                        tabIndex={loginMethod === "email" ? 0 : -1}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#b0bac9] hover:text-[#6b7a99] transition-colors touch-manipulation"
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
                            </div>
                        </div>

                        {/* MOBILE PANEL — always mounted, hidden via CSS when not active */}
                        <div
                            aria-hidden={loginMethod !== "mobile"}
                            className={loginMethod === "mobile"
                                ? "block space-y-4"
                                : "invisible h-0 overflow-hidden"
                            }
                        >
                            <div className="space-y-1.5">
                                <label className="block text-sm font-semibold text-textPrimary">
                                    Mobile Number
                                </label>
                                <div
                                    className={`rounded-lg transition-all ${
                                        error
                                            ? 'border border-red-400 focus-within:ring-2 focus-within:ring-red-200'
                                            : 'border border-divider focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10'
                                    }`}
                                >
                                    <PhoneInput
                                        defaultCountry="in"
                                        value={mobile}
                                        onChange={handlePhoneChange}
                                        className="w-full"
                                        inputClassName="!w-full !border-none !outline-none !px-4 !py-3 !text-sm !bg-transparent"
                                        countrySelectorStyleProps={{
                                            buttonClassName: "!border-none !bg-transparent hover:!bg-gray-100 !px-3",
                                        }}
                                    />
                                </div>
                                {error && (
                                    <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                                        ⚠ {error}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-secondary mb-1.5">OTP / Login code</label>
                                <input
                                    type="text"
                                    placeholder="Enter your OTP or Login code"
                                    tabIndex={loginMethod === "mobile" ? 0 : -1}
                                    className="w-full border border-[#d1d9e6] rounded-lg px-4 py-3 text-sm text-secondary placeholder-[#b0bac9] focus:outline-none focus:border-[#1a3060] focus:ring-2 focus:ring-[#1a3060]/10 transition-all"
                                />
                            </div>
                        </div>

                    </div>

                    {/* CTA Buttons
                        FIX 5: active:bg-primary/80 instead of active:bg-secondary.
                        secondary (#0A3458 navy) as the active state of a red button
                        looks broken on mobile where active states are very visible.
                        Using a darkened primary keeps it on-brand.
                    */}
                    <div className="space-y-3">
                        <button
                            type="button"
                            onClick={() => { /* your login handler */ }}
                            className="w-full bg-primary active:bg-primary/80 active:scale-[0.99] text-white font-bold py-3.5 rounded-xl text-sm tracking-wide transition-all duration-150 shadow-md shadow-primary/20 touch-manipulation select-none"
                        >
                            Login
                        </button>
                        <button
                            type="button"
                            onClick={() => { /* your get-code handler */ }}
                            className="w-full border-2 border-primary text-primary active:bg-primary/10 active:scale-[0.99] font-bold py-3.5 rounded-xl text-sm tracking-wide transition-all duration-150 touch-manipulation select-none"
                        >
                            {loginMethod === "email" ? "Get Login Code Via Email" : "Get OTP Via SMS"}
                        </button>
                    </div>

                </div>
            </div>

            {/* RIGHT */}
            <div className="flex-1 relative flex items-center justify-center overflow-hidden min-h-0 px-4 py-4 sm:px-8 sm:py-8">
                <div className="absolute inset-0 bg-lightBg opacity-40"></div>
                <img
                    src="/images/elements/login-bg.png"
                    alt="login-bg"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="relative z-10 p-8 rounded-2xl shadow-xl text-left bg-secondary w-full max-w-[500px]">
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-white mb-2">Login Guidelines</h2>
                        <div className="w-10 h-0.5 bg-primary rounded-full" />
                    </div>

                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
                            <h3 className="text-white font-semibold text-sm">New Users</h3>
                        </div>
                        <p className="text-white text-xs leading-relaxed ml-3.5">
                            Enter your email address, click on{" "}
                            <span className="text-white font-semibold">&apos;Get login code in email&apos;</span>{" "}
                            button and login via login code sent to your email address
                        </p>
                    </div>

                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
                            <h3 className="text-white font-semibold text-sm">Existing Users</h3>
                        </div>
                        <p className="text-white text-xs leading-relaxed ml-3.5">
                            Enter your email address and your login code or password to login. If you have forgot your password,
                            click on{" "}
                            <span className="text-white font-semibold">&apos;Get login code in email&apos;</span>{" "}
                            button and login via login code sent to your email address. You can change your password in{" "}
                            <span className="text-white font-semibold">&apos;Menu {"\u2192"} My Accounts&apos;</span>{" "}
                            after you login.
                        </p>
                    </div>

                    <div className="border-t border-[#ffffff15] mb-5" />

                    <div className="flex items-center gap-2">
                        <span className="text-base">🔒</span>
                        <p className="text-white text-xs">Your credentials are secure and encrypted</p>
                    </div>
                </div>
            </div>

        </div>
    );
}