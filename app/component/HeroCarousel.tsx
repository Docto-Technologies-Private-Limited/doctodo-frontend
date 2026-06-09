'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'

const SLIDES = [
  { id: 1, src: '/images/banner/banner1.png', alt: 'Slide 1' },
  { id: 2, src: '/images/banner/banner2.png', alt: 'Slide 2' },
  { id: 3, src: '/images/banner/banner3.png', alt: 'Slide 3' },
]

const AUTO_PLAY_MS = 3000
 
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
                transition-all duration-300 rounded-full
                ${i === current
                  ? 'w-8 h-[3px] bg-secondary'     // active line
                  : 'w-4 h-[3px] bg-gray-300'   // inactive line
                }
              `}
            />
          ))}
        </div>

      </div>
    </div>
  )
}