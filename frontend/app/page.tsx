"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Dumbbell, MapPin, MessageCircle, Search, Shield, Zap, Users, Clock, Target, ChevronRight } from "lucide-react"
import { ScrollReveal } from "@/components/scroll-reveal"
import { AnimatedCounter } from "@/components/animated-counter"
import { HeroSection } from "@/components/landing/hero-section"
import { FeaturesGrid } from "@/components/landing/features-grid"
import { HowItWorks } from "@/components/landing/how-it-works"
import { TestimonialsSection } from "@/components/landing/testimonials"
import { FooterSection } from "@/components/landing/footer"
import { Navbar } from "@/components/navbar"

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <Navbar />

      <HeroSection />

      {/* Stats Bar */}
      <section className="relative z-10 border-y border-border bg-card/50 backdrop-blur-sm">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-12 md:grid-cols-4 md:px-8 md:py-16">
          <AnimatedCounter end={15000} suffix="+" label="Active Members" />
          <AnimatedCounter end={2500} suffix="+" label="Gyms Mapped" />
          <AnimatedCounter end={8400} suffix="+" label="Matches Made" />
          <AnimatedCounter end={98} suffix="%" label="Satisfaction" />
        </div>
      </section>

      <FeaturesGrid />
      <HowItWorks />
      <TestimonialsSection />

      {/* Final CTA */}
      <section className="relative overflow-hidden border-t border-border py-24 md:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.65_0.25_25/0.08),transparent_70%)]" />
        <div className="relative mx-auto max-w-4xl px-4 text-center md:px-8">
          <ScrollReveal>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              Stop training alone
            </p>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <h2 className="mt-4 font-[var(--font-oswald)] text-4xl font-bold uppercase leading-tight text-foreground md:text-6xl">
              Your next PR starts<br />
              <span className="text-primary">with a partner</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Join thousands of lifters who found their perfect gym partner through GymRats. Match, connect, and crush your goals together.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={300}>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/register"
                className="group flex items-center gap-2 rounded-sm bg-primary px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] text-primary-foreground transition-all duration-300 hover:shadow-[0_0_40px_oklch(0.65_0.25_25/0.4)]"
              >
                Get Started Free
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="#features"
                className="flex items-center gap-2 rounded-sm border border-border px-8 py-4 text-sm uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
              >
                Learn More
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <FooterSection />
    </div>
  )
}
