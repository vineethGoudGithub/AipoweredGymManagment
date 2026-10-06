"use client"

import { MapPin, Search, MessageCircle, Shield, Zap, Users, Target, Globe } from "lucide-react"
import { ScrollReveal } from "@/components/scroll-reveal"

const features = [
  {
    icon: MapPin,
    title: "Gym Finder",
    description: "Discover gyms near you with live maps. See who trains where and when.",
    accent: true,
  },
  {
    icon: Users,
    title: "Smart Matching",
    description: "Our algorithm pairs you by goals, timing, experience, and gym location.",
    accent: false,
  },
  {
    icon: Search,
    title: "Exercise Library",
    description: "500+ exercises with video demos, form tips, and muscle targeting info.",
    accent: false,
  },
  {
    icon: MessageCircle,
    title: "Real-Time Chat",
    description: "Instant messaging with your partners. Coordinate workouts seamlessly.",
    accent: true,
  },
  {
    icon: Globe,
    title: "Travel Mode",
    description: "Visiting a new city? Find temporary workout partners wherever you go.",
    accent: false,
  },
  {
    icon: Zap,
    title: "Live Check-In",
    description: "See who is currently at the gym. Jump in for an impromptu session.",
    accent: false,
  },
]

export function FeaturesGrid() {
  return (
    <section id="features" className="relative py-24 md:py-32">
      {/* Background accent */}
      <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-primary/5 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <ScrollReveal>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              Everything you need
            </p>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <h2 className="mt-4 font-[var(--font-oswald)] text-4xl font-bold uppercase text-foreground md:text-5xl">
              Built for the <span className="text-primary">grind</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Every feature designed to help you find, connect, and train with the right people.
            </p>
          </ScrollReveal>
        </div>

        {/* Grid */}
        <div className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <ScrollReveal key={feature.title} delay={i * 100}>
              <div
                className={`group relative overflow-hidden rounded-sm border p-8 transition-all duration-500 hover:-translate-y-1 ${
                  feature.accent
                    ? "border-primary/30 bg-primary/5 hover:border-primary/60 hover:shadow-[0_0_30px_oklch(0.65_0.25_25/0.1)]"
                    : "border-border bg-card hover:border-primary/30 hover:bg-card/80"
                }`}
              >
                {/* Icon */}
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-sm transition-colors duration-300 ${
                    feature.accent
                      ? "bg-primary/20 text-primary group-hover:bg-primary/30"
                      : "bg-secondary text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                  }`}
                >
                  <feature.icon className="h-5 w-5" />
                </div>

                {/* Content */}
                <h3 className="mt-6 font-[var(--font-oswald)] text-lg font-semibold uppercase tracking-wide text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>

                {/* Hover line */}
                <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-primary transition-all duration-500 group-hover:w-full" />
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
