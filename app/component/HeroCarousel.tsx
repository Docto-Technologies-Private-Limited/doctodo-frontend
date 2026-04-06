'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'

const SLIDES = [
  { id: 1, src: '/images/banner/banner1.png', alt: 'Slide 1' },
  { id: 2, src: '/images/banner/banner2.png', alt: 'Slide 2' },
  { id: 3, src: '/images/banner/banner3.png', alt: 'Slide 3' },
]

const AUTO_PLAY_MS = 4000

function Arrow({ dir, onClick }: { dir: 'prev' | 'next'; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="absolute top-1/2 -translate-y-1/2 z-20 flex items-center justify-center rounded-full bg-white/90 shadow-md hover:scale-110 transition"
      style={{
        [dir === 'prev' ? 'left' : 'right']: '12px',
        width: '36px',
        height: '36px',
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" fill="none">
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

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % SLIDES.length)
  }, [])

  const go = (idx: number) => {
    setCurrent((idx + SLIDES.length) % SLIDES.length)
  }

  useEffect(() => {
    timerRef.current = setInterval(next, AUTO_PLAY_MS)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [next])

  const pause = () => timerRef.current && clearInterval(timerRef.current)
  const resume = () => {
    timerRef.current = setInterval(next, AUTO_PLAY_MS)
  }

  return (
  <div className="w-full">
  {/* Carousel */}
  <section
    className="relative w-full overflow-visible aspect-[4/3] md:aspect-[16/7]"
    onMouseEnter={pause}
    onMouseLeave={resume}
  >
    {/* Slides */}
    <div
      className="flex h-full transition-transform duration-500 ease-in-out"
      style={{
        width: `${SLIDES.length * 100}%`,
        transform: `translateX(-${(current * 100) / SLIDES.length}%)`,
      }}
    >
      {SLIDES.map((slide) => (
        <div
          key={slide.id}
          className="relative h-full"
          style={{ width: `${100 / SLIDES.length}%` }}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            className=""
            priority={slide.id === 1}
          />
        </div>
      ))}
    </div>

    {/* Arrows */}
    <Arrow dir="prev" onClick={() => go(current - 1)} />
    <Arrow dir="next" onClick={() => go(current + 1)} />
  </section>

  {/* ✅ Dots OUTSIDE (fixed) */}
    <div className="absolute left-1/2 -translate-x-1/2 mt-4 flex gap-2">
      {SLIDES.map((_, i) => (
        <button
          key={i}
          onClick={() => go(i)}
          className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
            i === current ? 'bg-primary' : 'bg-black/40'
          }`}
        />
      ))}
    </div>
</div>
  )
}