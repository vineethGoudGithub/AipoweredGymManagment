"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  animation?: "float-up" | "slide-left" | "slide-right" | "scale-in"
  delay?: number
  threshold?: number
}

export function ScrollReveal({
  children,
  className,
  animation = "float-up",
  delay = 0,
  threshold = 0.15,
}: ScrollRevealProps) {
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
      { threshold }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold])

  const animationClass = {
    "float-up": "animate-float-up",
    "slide-left": "animate-slide-left",
    "slide-right": "animate-slide-right",
    "scale-in": "animate-scale-in",
  }[animation]

  return (
    <div
      ref={ref}
      className={cn(
        "opacity-0",
        isVisible && animationClass,
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}
