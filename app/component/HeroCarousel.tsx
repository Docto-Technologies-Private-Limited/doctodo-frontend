'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'

const SLIDES = [
  { id: 1, src: '/images/banner/banner1.png', alt: 'Slide 1' },
  { id: 2, src: '/images/banner/banner2.png', alt: 'Slide 2' },
  { id: 3, src: '/images/banner/banner3.png', alt: 'Slide 3' },
]

const AUTO_PLAY_MS = 3000

function Arrow({ dir, onClick }: { dir: 'prev' | 'next'; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={dir === 'prev' ? 'Previous slide' : 'Next slide'}
      className={`
        absolute top-1/2 -translate-y-1/2 z-20
        flex items-center justify-center
        rounded-full bg-white/90 shadow-md
        hover:scale-110 hover:bg-white active:scale-95
        transition-transform duration-150
        w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10
        ${dir === 'prev' ? 'left-2 sm:left-3' : 'right-2 sm:right-3'}
      `}
    >
      <svg
        className="w-3 h-3 sm:w-4 sm:h-4"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="none"
      >
        {dir === 'prev'
          ? <polyline points="15 18 9 12 15 6" />
          : <polyline points="9 18 15 12 9 6" />}
      </svg>
    </button>
  )
}

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // 👉 swipe refs
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  const next = useCallback(() => setCurrent((p) => (p + 1) % SLIDES.length), [])
  const prev = useCallback(() => setCurrent((p) => (p - 1 + SLIDES.length) % SLIDES.length), [])
  const go = (idx: number) => setCurrent(idx)

  const startTimer = useCallback(() => {
    timerRef.current = setInterval(next, AUTO_PLAY_MS)
  }, [next])

  const stopTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
  }, [])

  useEffect(() => {
    startTimer()
    return stopTimer
  }, [startTimer, stopTimer])

  // 👉 swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    stopTimer()
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current
    const threshold = 50

    if (diff > threshold) {
      next()
    } else if (diff < -threshold) {
      prev()
    }

    startTimer()
  }

  return (
    <div className="flex flex-col items-center w-full">

      {/* ── Responsive width cap ── */}
      <div className="w-full sm:max-w-[540px] md:max-w-[680px] lg:max-w-[820px] xl:max-w-[960px]">

        {/* ── Carousel shell: rounded + shadow + overflow clip ── */}
        <div
          className="relative w-full rounded-xl overflow-hidden
            shadow-[0_4px_24px_rgba(10,52,88,0.13)]"
          onMouseEnter={stopTimer}
          onMouseLeave={startTimer}
        >
          <div
            className="relative w-full aspect-[2/1]"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >

            {/* Slide track */}
            <div
              className="absolute inset-0 flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {SLIDES.map((slide) => (
                <div
                  key={slide.id}
                  className="relative min-w-full h-full shrink-0"
                >
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    fill
                    sizes="(max-width: 640px) 100vw,
                           (max-width: 768px) 540px,
                           (max-width: 1024px) 680px,
                           (max-width: 1280px) 820px,
                           960px"
                    className="object-cover"
                    priority={slide.id === 1}
                  />
                </div>
              ))}
            </div>

            {/* Arrows */}
            {/* <Arrow dir="prev" onClick={prev} />
            <Arrow dir="next" onClick={next} /> */}
          </div>
        </div>

        {/* ── Dots ── */}
        <div className="flex items-center justify-center gap-2 mt-3">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`
                w-2.5 h-2.5 sm:w-3 sm:h-3
                rounded-full transition-colors duration-300
                ${i === current
                  ? 'bg-primary'
                  : 'bg-divider'}
              `}
            />
          ))}
        </div>

      </div>
    </div>
  )
}