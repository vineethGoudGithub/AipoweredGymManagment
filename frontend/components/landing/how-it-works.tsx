"use client"

import Image from "next/image"
import { ScrollReveal } from "@/components/scroll-reveal"

const steps = [
  {
    step: "01",
    title: "Create Profile",
    description: "Set your fitness goals, experience level, workout timings, and preferred gym.",
    image: "/images/hero-grip.jpg",
  },
  {
    step: "02",
    title: "Find Your Gym",
    description: "Open the map, discover nearby gyms, and see who trains there regularly.",
    image: "/images/gym-interior.jpg",
  },
  {
    step: "03",
    title: "Match & Connect",
    description: "Browse compatible partners, send requests, and start chatting instantly.",
    image: "/images/partner-workout.jpg",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative border-t border-border py-24 md:py-32">
      <div className="absolute top-0 left-0 h-96 w-96 rounded-full bg-primary/5 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <ScrollReveal>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              Simple process
            </p>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <h2 className="mt-4 font-[var(--font-oswald)] text-4xl font-bold uppercase text-foreground md:text-5xl">
              How it <span className="text-primary">works</span>
            </h2>
          </ScrollReveal>
        </div>

        {/* Steps */}
        <div className="mt-20 flex flex-col gap-24">
          {steps.map((step, i) => (
            <div
              key={step.step}
              className={`flex flex-col items-center gap-12 lg:flex-row ${
                i % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              {/* Image */}
              <ScrollReveal
                animation={i % 2 === 0 ? "slide-left" : "slide-right"}
                className="w-full lg:w-1/2"
              >
                <div className="group relative aspect-[4/3] overflow-hidden rounded-sm border border-border">
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                  {/* Step number overlay */}
                  <div className="absolute top-6 left-6">
                    <span className="font-[var(--font-oswald)] text-6xl font-bold text-primary/30">
                      {step.step}
                    </span>
                  </div>
                </div>
              </ScrollReveal>

              {/* Content */}
              <ScrollReveal
                animation={i % 2 === 0 ? "slide-right" : "slide-left"}
                delay={200}
                className="w-full lg:w-1/2"
              >
                <div className="max-w-md">
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-sm text-primary">{step.step}</span>
                    <span className="h-px flex-1 bg-primary/30" />
                  </div>
                  <h3 className="mt-4 font-[var(--font-oswald)] text-3xl font-bold uppercase text-foreground md:text-4xl">
                    {step.title}
                  </h3>
                  <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </ScrollReveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
