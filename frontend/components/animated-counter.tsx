"use client"

import { useEffect, useRef, useState } from "react"

interface AnimatedCounterProps {
  end: number
  suffix?: string
  label: string
  duration?: number
}

export function AnimatedCounter({ end, suffix = "", label, duration = 2000 }: AnimatedCounterProps) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return
    let start = 0
    const increment = end / (duration / 16)
    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [isVisible, end, duration])

  return (
    <div ref={ref} className="text-center">
      <div className="font-[var(--font-oswald)] text-5xl font-bold text-foreground md:text-6xl">
        {isVisible ? count.toLocaleString() : "0"}
        <span className="text-primary">{suffix}</span>
      </div>
      <div className="mt-2 text-sm uppercase tracking-[0.2em] text-muted-foreground">{label}</div>
    </div>
  )
}
