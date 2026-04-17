// HomePage.tsx  (no structural change needed — keep as-is from the previous version)
'use client'

import { useRouter } from 'next/navigation'
import Header from '@/app/component/Header'
import HeroCarousel from '@/app/component/HeroCarousel'
import Footer from '@/app/component/Footer'

export default function HomePage() {
  const router = useRouter()

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 flex flex-col items-center">
        <div className="w-full flex flex-col items-center px-4 py-5 sm:py-7 md:py-10 mt-10 sm:mt-0 gap-4 sm:gap-6">

          <h1 className="text-center font-bold leading-tight text-textPrimary
            text-2xl lg:text-3xl md:text-3xl">
            Clinical Case Studies on Neuropathy
          </h1>

          {/* Carousel fills available width; its own max-w ladder caps it */}
          <div className="w-full">
            <HeroCarousel />
          </div>

          {/* Login button — mobile only */}
          <div className="flex sm:hidden justify-center w-full mt-4">
            <button
              onClick={() => router.push('/auth/login')}
              className="w-full max-w-[260px] py-3 rounded-lg font-bold text-base
                text-white bg-primary transition-all duration-200
                hover:opacity-90 active:scale-95"
            >
              Login
            </button>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}