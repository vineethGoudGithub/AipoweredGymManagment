"use client"

import { ScrollReveal } from "@/components/scroll-reveal"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Marcus J.",
    goal: "Powerlifting",
    quote: "Found a spotter who matches my schedule perfectly. Hit a 405 squat PR within 3 weeks of training together.",
    rating: 5,
  },
  {
    name: "Sarah K.",
    goal: "Bodybuilding",
    quote: "The travel mode is insane. I found a training partner in Miami within 30 minutes of landing. Never skip a session.",
    rating: 5,
  },
  {
    name: "Dev P.",
    goal: "Strength Training",
    quote: "Better than any fitness app I have used. The matching algorithm actually understands what I need in a gym partner.",
    rating: 5,
  },
]

export function TestimonialsSection() {
  return (
    <section id="community" className="relative border-t border-border py-24 md:py-32">
      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <ScrollReveal>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              Community
            </p>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <h2 className="mt-4 font-[var(--font-oswald)] text-4xl font-bold uppercase text-foreground md:text-5xl">
              What lifters <span className="text-primary">say</span>
            </h2>
          </ScrollReveal>
        </div>

        <div className="mt-16 grid gap-4 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <ScrollReveal key={t.name} delay={i * 150}>
              <div className="group relative overflow-hidden rounded-sm border border-border bg-card p-8 transition-all duration-500 hover:border-primary/30">
                {/* Stars */}
                <div className="flex gap-1">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>

                {/* Quote */}
                <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
                  {`"${t.quote}"`}
                </p>

                {/* Author */}
                <div className="mt-8 flex items-center gap-3 border-t border-border pt-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <span className="text-sm font-bold text-primary">{t.name[0]}</span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.goal}</div>
                  </div>
                </div>

                {/* Hover accent */}
                <div className="absolute top-0 left-0 h-full w-[2px] bg-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
