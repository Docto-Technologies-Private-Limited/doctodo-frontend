'use client'
import React from 'react'
import Image from 'next/image'
import { useRouter } from "next/navigation";

function Logo() {
  return (
    <div className="flex flex-col leading-none select-none">
      <Image
        src="/images/logo/test_logo.png"
        alt="project-logo"
        width={200}
        height={40}
        priority
      />
    </div>
  )
}
 
export default function Header() {
  const router = useRouter();
  return (
    <header
      className="sticky top-0 z-50 bg-white"
      style={{borderBottom: '1px solid var(--color-divider)' }}
    >
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 flex items-center sm:justify-between justify-center h-[64px] sm:h-[72px] md:h-[80px]">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <Logo />
        </div>

        {/* Login button */}
        <button
        onClick={() => router.push("/auth/login")}
        className="font-semibold text-white rounded-md transition-all duration-200 hover:opacity-90 active:scale-95 sm:block hidden bg-primary"
        style={{
          padding: "clamp(8px, 1.5vw, 11px) clamp(20px, 3vw, 36px)",
          fontSize: "clamp(13px, 1.4vw, 15px)",
        }}
      >
        Login
      </button>
      </div>
    </header>
  )
}
