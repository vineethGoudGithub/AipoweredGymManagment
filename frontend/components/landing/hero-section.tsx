"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ChevronDown } from "lucide-react"

const words = ["AI COACH", "PARTNER", "SPOTTER", "CREW"]

export function HeroSection() {
  const [wordIndex, setWordIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setLoaded(true)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setWordIndex((i) => (i + 1) % words.length)
        setIsAnimating(false)
      }, 300)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-gym.jpg"
          alt="Dark gym interior with dramatic lighting"
          fill
          className="object-cover"
          priority
        />
        {/* Dark overlays */}
        <div className="absolute inset-0 bg-background/75" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
      </div>

      {/* Vertical line accents */}
      <div className="absolute top-0 left-1/4 z-10 h-full w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent" />
      <div className="absolute top-0 right-1/3 z-10 h-full w-px bg-gradient-to-b from-transparent via-border/30 to-transparent" />

      {/* Content */}
      <div className="relative z-20 mx-auto w-full max-w-7xl px-4 pt-20 md:px-8">
        <div className="max-w-3xl">
          {/* Tag */}
          <div
            className={`mb-6 inline-flex items-center gap-2 rounded-sm border border-primary/30 bg-primary/10 px-4 py-1.5 transition-all duration-1000 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              AI-Powered Gym Management & Smart Matching
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="font-[var(--font-oswald)] text-5xl font-bold uppercase leading-[0.95] text-foreground sm:text-7xl lg:text-8xl">
            <span
              className={`block transition-all duration-700 delay-100 ${
                loaded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
              }`}
            >
              Elevate Your
            </span>
            <span
              className={`block transition-all duration-700 delay-300 ${
                loaded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
              }`}
            >
              <span className="relative inline-block">
                <span
                  className={`text-primary transition-all duration-300 ${
                    isAnimating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
                  }`}
                >
                  {words[wordIndex]}
                </span>
              </span>
            </span>
          </h1>

          {/* Subtext */}
          <p
            className={`mt-8 max-w-lg text-lg leading-relaxed text-muted-foreground transition-all duration-700 delay-500 md:text-xl ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Train smarter with ApexFit AI. Intelligent routine generation, personalized nutrition plans, 
            interactive AI coaching, and verified gym partner matching powered by Neon PostgreSQL.
          </p>

          {/* CTA Buttons */}
          <div
            className={`mt-10 flex flex-col gap-4 sm:flex-row sm:items-center transition-all duration-700 delay-700 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <Link
              href="/register"
              className="group relative flex items-center justify-center gap-3 overflow-hidden rounded-sm bg-primary px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] text-primary-foreground transition-all duration-300 hover:shadow-[0_0_40px_oklch(0.65_0.25_25/0.5)]"
            >
              <span className="relative z-10">Find My Partner</span>
              <ArrowRight className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1" />
              <span className="absolute inset-0 z-0 bg-gym-red-bright opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </Link>
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 rounded-sm border border-border px-8 py-4 text-sm uppercase tracking-[0.2em] text-muted-foreground transition-all duration-300 hover:border-primary/50 hover:text-foreground"
            >
              I Have An Account
            </Link>
          </div>

          {/* Social Proof */}
          <div
            className={`mt-14 flex items-center gap-4 transition-all duration-700 delay-[900ms] ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div className="flex -space-x-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-10 w-10 rounded-full border-2 border-background bg-secondary"
                  style={{
                    backgroundImage: `linear-gradient(135deg, oklch(0.25 0 0), oklch(0.35 0.05 ${i * 60}))`,
                  }}
                />
              ))}
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">15,000+ Active Lifters</div>
              <div className="text-xs text-muted-foreground">Joined this month</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2">
        <div className="flex animate-bounce flex-col items-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Scroll</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      {/* Side text */}
      <div className="absolute top-1/2 right-8 z-20 hidden -translate-y-1/2 -rotate-90 lg:block">
        <span className="text-[10px] uppercase tracking-[0.5em] text-gym-text-dim">
          Smart Gym Partner Matching
        </span>
      </div>
    </section>
  )
}
