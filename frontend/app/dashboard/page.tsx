"use client"

import Image from "next/image"
import Link from "next/link"
import {
  MapPin,
  BookOpen,
  MessageCircle,
  ChevronRight,
  Flame,
  Clock,
  Target,
  Users,
  TrendingUp,
  Zap,
  Navigation,
  Sparkles,
  UtensilsCrossed,
  Bot,
  QrCode,
  CheckCircle2,
} from "lucide-react"
import { useState, useEffect } from "react"
import { DashboardShell } from "@/components/dashboard-shell"

const nearbyGyms = [
  { name: "Iron Paradise Gym", distance: "0.8 km", rating: 4.8, members: 24, active: 6 },
  { name: "Beast Mode Fitness", distance: "1.2 km", rating: 4.6, members: 18, active: 3 },
  { name: "Raw Power Athletics", distance: "2.1 km", rating: 4.9, members: 31, active: 8 },
]

const recentMatches = [
  { name: "Alex R.", goal: "Strength", timing: "Morning", compatibility: 92, status: "online" },
  { name: "Jordan T.", goal: "Bulking", timing: "Evening", compatibility: 87, status: "at-gym" },
  { name: "Sam K.", goal: "Cutting", timing: "Morning", compatibility: 85, status: "offline" },
]

const quickWorkouts = [
  { name: "Push Day", exercises: 6, duration: "45 min", level: "Intermediate" },
  { name: "Pull Day", exercises: 5, duration: "40 min", level: "Intermediate" },
  { name: "Leg Destroyer", exercises: 7, duration: "60 min", level: "Advanced" },
]

export default function DashboardPage() {
  const [userName, setUserName] = useState("Athlete")
  const [checkedIn, setCheckedIn] = useState(false)
  const [streak, setStreak] = useState(7)

  useEffect(() => {
    const savedName = localStorage.getItem("userName")
    if (savedName) {
      setUserName(savedName)
    }
  }, [])

  const handleCheckIn = async () => {
    setCheckedIn(true)
    setStreak((prev) => prev + 1)
    try {
      const email = localStorage.getItem("userEmail") || "vineethgoudvgs789@gmail.com"
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://aipoweredgymmanagment.onrender.com'}/api/attendance/check-in`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: email,
          userName: userName,
          gymName: "Iron Paradise Gym",
          sessionNotes: "AI Dashboard Check-In"
        })
      })
    } catch (e) {
      console.warn("Check-in synced locally", e)
    }
  }

  return (
    <DashboardShell activeTab="Gym Finder">
      <div className="flex flex-col gap-6">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-sm border border-border bg-card">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent" />
          <div className="relative flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between md:p-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                Good evening, {userName}
              </p>
              <h2 className="mt-1 font-[var(--font-oswald)] text-2xl font-bold uppercase text-foreground md:text-3xl">
                ApexFit AI Command Center
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                6 gym partners are active near you • Current Streak: {streak} Days
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleCheckIn}
                className="flex items-center gap-2 rounded-sm bg-primary px-6 py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground transition-all duration-300 hover:shadow-[0_0_25px_oklch(0.65_0.25_25/0.4)]"
              >
                {checkedIn ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                    Checked In ({streak}d Streak)
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4" />
                    Gym Check-In
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* AI Power Hub Quick Access */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Link
            href="/dashboard/ai-workout"
            className="group relative overflow-hidden rounded-sm border border-border bg-card p-5 transition-all duration-300 hover:border-primary/50 hover:bg-secondary/40"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                AI Routine Engine
              </span>
              <Sparkles className="h-5 w-5 text-primary transition-transform group-hover:scale-110" />
            </div>
            <h3 className="mt-2 font-[var(--font-oswald)] text-lg font-bold uppercase text-foreground">
              Generate Workout Split
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Tailored 3-6 day volume-balanced training splits with exercise sets & reps.
            </p>
          </Link>

          <Link
            href="/dashboard/diet-planner"
            className="group relative overflow-hidden rounded-sm border border-border bg-card p-5 transition-all duration-300 hover:border-primary/50 hover:bg-secondary/40"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
                Nutritional AI
              </span>
              <UtensilsCrossed className="h-5 w-5 text-amber-500 transition-transform group-hover:scale-110" />
            </div>
            <h3 className="mt-2 font-[var(--font-oswald)] text-lg font-bold uppercase text-foreground">
              Macro & Diet Planner
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              TDEE calculation, protein partitioning & precision daily meal breakdowns.
            </p>
          </Link>

          <Link
            href="/dashboard/chat"
            className="group relative overflow-hidden rounded-sm border border-border bg-card p-5 transition-all duration-300 hover:border-primary/50 hover:bg-secondary/40"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Live AI Assistant
              </span>
              <Bot className="h-5 w-5 text-cyan-400 transition-transform group-hover:scale-110" />
            </div>
            <h3 className="mt-2 font-[var(--font-oswald)] text-lg font-bold uppercase text-foreground">
              ApexFit Coach Chat
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Instant form checks, recovery protocol advice & real-time training cues.
            </p>
          </Link>
        </div>

        {/* 3 Main Sections Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Section 1: Map Preview */}
          <div className="group relative overflow-hidden rounded-sm border border-border bg-card transition-all duration-500 hover:border-primary/30">
            <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
              {/* Simulated map with dark theme */}
              <div className="absolute inset-0 bg-[oklch(0.12_0_0)]">
                {/* Grid lines for map feel */}
                <div className="absolute inset-0 opacity-20" style={{
                  backgroundImage: "linear-gradient(oklch(0.3 0 0) 1px, transparent 1px), linear-gradient(90deg, oklch(0.3 0 0) 1px, transparent 1px)",
                  backgroundSize: "40px 40px"
                }} />

                {/* Fake location markers */}
                {nearbyGyms.map((gym, i) => (
                  <div
                    key={gym.name}
                    className="absolute"
                    style={{
                      top: `${30 + i * 20}%`,
                      left: `${25 + i * 22}%`,
                    }}
                  >
                    <div className="relative">
                      <div className="absolute -inset-2 animate-ping rounded-full bg-primary/30" />
                      <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-primary shadow-[0_0_15px_oklch(0.65_0.25_25/0.4)]">
                        <MapPin className="h-4 w-4 text-primary-foreground" />
                      </div>
                    </div>
                  </div>
                ))}

                {/* User location */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="relative">
                    <div className="absolute -inset-3 animate-pulse rounded-full bg-blue-500/20" />
                    <div className="h-4 w-4 rounded-full border-2 border-foreground bg-blue-500" />
                  </div>
                </div>
              </div>

              {/* Main Link to Real Map */}
              <Link href="/gyms" className="absolute inset-0 z-10 flex items-center justify-center bg-background/0 transition-all duration-300 group-hover:bg-background/20">
                <span className="rounded-sm bg-primary px-4 py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground opacity-0 shadow-[0_0_20px_oklch(0.65_0.25_25/0.4)] transition-all duration-300 group-hover:opacity-100">
                  Open Live Map
                </span>
              </Link>

              {/* Floating Near Me Button */}
              <Link
                href="/gyms"
                className="absolute bottom-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-sm border border-primary/30 bg-background/80 text-primary backdrop-blur-sm transition-all hover:bg-primary hover:text-primary-foreground hover:shadow-[0_0_15px_oklch(0.65_0.25_25/0.4)]"
                title="Near Me"
              >
                <Navigation className="h-4 w-4" />
              </Link>
            </div>

            <div className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-[var(--font-oswald)] text-lg font-semibold uppercase text-foreground">
                    Nearby Gyms
                  </h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {nearbyGyms.length} gyms within 3km
                  </p>
                </div>
                <MapPin className="h-5 w-5 text-primary" />
              </div>

              <div className="mt-4 flex flex-col gap-2">
                {nearbyGyms.map((gym) => (
                  <div
                    key={gym.name}
                    className="flex items-center justify-between rounded-sm border border-border bg-secondary/50 p-3 transition-all duration-200 hover:border-primary/20"
                  >
                    <div>
                      <div className="text-sm font-medium text-foreground">{gym.name}</div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{gym.distance}</span>
                        <span className="text-gym-text-dim">|</span>
                        <span>{gym.active} active now</span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Exercise Quick Access */}
          <div className="group overflow-hidden rounded-sm border border-border bg-card transition-all duration-500 hover:border-primary/30">
            <div className="relative overflow-hidden">
              <Image
                src="/images/gym-interior.jpg"
                alt="Gym equipment"
                width={600}
                height={400}
                className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
              <div className="absolute bottom-4 left-5">
                <h3 className="font-[var(--font-oswald)] text-lg font-semibold uppercase text-foreground">
                  Exercise Library
                </h3>
                <p className="text-xs text-muted-foreground">500+ exercises with guides</p>
              </div>
            </div>

            <div className="p-5">
              {/* Search */}
              <div className="relative">
                <BookOpen className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search exercises..."
                  className="w-full rounded-sm border border-border bg-input py-2.5 pl-10 pr-4 text-sm text-foreground outline-none transition-all placeholder:text-gym-text-dim focus:border-primary/50"
                />
              </div>

              {/* Quick Workouts */}
              <div className="mt-4 flex flex-col gap-2">
                {quickWorkouts.map((workout) => (
                  <Link
                    key={workout.name}
                    href="/dashboard/exercises"
                    className="flex items-center justify-between rounded-sm border border-border bg-secondary/50 p-3 transition-all duration-200 hover:border-primary/20"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-primary/10">
                        <Flame className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-foreground">{workout.name}</div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{workout.exercises} exercises</span>
                          <span className="text-gym-text-dim">|</span>
                          <span>{workout.duration}</span>
                        </div>
                      </div>
                    </div>
                    <span className="rounded-sm bg-secondary px-2 py-0.5 text-[10px] font-semibold uppercase text-muted-foreground">
                      {workout.level}
                    </span>
                  </Link>
                ))}
              </div>

              <Link
                href="/dashboard/exercises"
                className="mt-4 flex items-center justify-center gap-2 rounded-sm border border-border py-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-all hover:border-primary/30 hover:text-foreground"
              >
                View All Exercises
                <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

          {/* Section 3: Messages & Matches */}
          <div className="overflow-hidden rounded-sm border border-border bg-card transition-all duration-500 hover:border-primary/30">
            <div className="border-b border-border p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-[var(--font-oswald)] text-lg font-semibold uppercase text-foreground">
                    Partners
                  </h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Your gym connections
                  </p>
                </div>
                <MessageCircle className="h-5 w-5 text-primary" />
              </div>
            </div>

            {/* Partner List */}
            <div className="flex flex-col">
              {recentMatches.map((match, i) => (
                <Link
                  key={match.name}
                  href="/dashboard/chat"
                  className="flex items-center gap-4 border-b border-border p-5 transition-all duration-200 hover:bg-secondary/50"
                >
                  {/* Avatar */}
                  <div className="relative">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10">
                      <span className="text-sm font-bold text-primary">{match.name[0]}</span>
                    </div>
                    <span
                      className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-card ${match.status === "at-gym"
                        ? "bg-primary"
                        : match.status === "online"
                          ? "bg-green-500"
                          : "bg-muted-foreground"
                        }`}
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">{match.name}</span>
                      {match.status === "at-gym" && (
                        <span className="rounded-sm bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold uppercase text-primary">
                          At Gym
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{match.goal}</span>
                      <span className="text-gym-text-dim">|</span>
                      <span>{match.timing}</span>
                    </div>
                  </div>

                  {/* Compatibility */}
                  <div className="text-right">
                    <div className="text-sm font-bold text-primary">{match.compatibility}%</div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">match</div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="p-5">
              <Link
                href="/dashboard/chat"
                className="flex items-center justify-center gap-2 rounded-sm bg-primary/10 py-2.5 text-xs font-semibold uppercase tracking-wider text-primary transition-all hover:bg-primary/20"
              >
                View All Messages
                <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Stats Row */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Flame, label: "Streak", value: "12 Days", color: "text-primary" },
            { icon: Target, label: "This Week", value: "4 Sessions", color: "text-foreground" },
            { icon: Users, label: "Partners", value: "7 Active", color: "text-foreground" },
            { icon: TrendingUp, label: "PR Count", value: "3 New PRs", color: "text-primary" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-4 rounded-sm border border-border bg-card p-5 transition-all duration-300 hover:border-primary/20"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-primary/10">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  )
}
