import Header from '@/app/component/Header'
import HeroCarousel from '@/app/component/HeroCarousel'
import Footer from '@/app/component/Footer'

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* ── HEADER ── */}
      <Header />

      {/* ── MAIN ── */}
      <main className="flex-1 flex flex-col">

        {/* Desktop / Tablet */}
        <div className="hidden sm:block w-full">
          <div className="w-full mx-auto my-4 md:my-6 max-w-[1100px] px-[clamp(16px,3%,40px)] pb-[25px]">

            {/* Title */}
            <h1 className="text-center font-bold mb-3 text-textPrimary tracking-[-0.01em]
              text-lg sm:text-xl md:text-2xl lg:text-3xl">
              Clinical Case Studies on Neuropathy
            </h1>

            {/* Carousel */}
            <div className="rounded-xl overflow-hidden shadow-[0_4px_24px_rgba(10,52,88,0.10)]">
              <HeroCarousel />
            </div>
          </div>
        </div>

        {/* Mobile */}
        <div className="flex sm:hidden flex-col flex-1 px-4 py-5 gap-4">

          <h1 className="text-center font-bold leading-snug text-textPrimary
            text-base sm:text-lg">
            Clinical Case Studies<br />on Neuropathy
          </h1>

          {/* Carousel */}
          <div className="rounded-xl overflow-hidden w-full shadow-[0_4px_16px_rgba(10,52,88,0.10)]">
            <HeroCarousel />
          </div>

          {/* Login Button */}
          <div className="flex justify-center mt-10">
            <button className="w-full max-w-[260px] py-3 rounded-lg font-bold text-base text-white bg-primary transition-all duration-200 hover:opacity-90 active:scale-95">
              Login
            </button>
          </div>
        </div>

      </main>

      {/* ── FOOTER ── */}
      <Footer />
    </div>
  )
}