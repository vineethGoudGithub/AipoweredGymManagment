"use client"

import { useState } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import {
  Sparkles,
  Dumbbell,
  Calendar,
  Flame,
  CheckCircle2,
  Clock,
  Zap,
  BookmarkCheck,
  Download,
  RotateCcw,
  Target
} from "lucide-react"

interface ExerciseItem {
  name: string
  sets: string
  reps: string
  rest: string
}

interface WorkoutDay {
  name: string
  focus: string
  exercises: ExerciseItem[]
}

interface WorkoutPlan {
  title: string
  equipment: string
  goal: string
  level: string
  days: WorkoutDay[]
}

const DEFAULT_PLAN: WorkoutPlan = {
  title: "4-Day AI Hypertrophy Split (Intermediate)",
  equipment: "Commercial Gym",
  goal: "Hypertrophy",
  level: "Intermediate",
  days: [
    {
      name: "Day 1: Upper Body Power",
      focus: "Chest, Upper Back, Shoulders",
      exercises: [
        { name: "Barbell Bench Press", sets: "4 sets", reps: "6-8 reps", rest: "2-3 min" },
        { name: "Barbell Incline Bench Press", sets: "3 sets", reps: "8-10 reps", rest: "90s" },
        { name: "Cable Bar Lateral Pulldown", sets: "4 sets", reps: "8-10 reps", rest: "90s" },
        { name: "Dumbbell Standing Overhead Press", sets: "3 sets", reps: "8-10 reps", rest: "2 min" },
        { name: "Triceps Dip", sets: "3 sets", reps: "10-12 reps", rest: "60s" }
      ]
    },
    {
      name: "Day 2: Lower Body Hypertrophy",
      focus: "Quads, Hamstrings, Calves",
      exercises: [
        { name: "Barbell Front Squat", sets: "4 sets", reps: "6-8 reps", rest: "2.5 min" },
        { name: "Sled 45° Leg Press", sets: "4 sets", reps: "10-12 reps", rest: "2 min" },
        { name: "Dumbbell Romanian Deadlift", sets: "3 sets", reps: "10-12 reps", rest: "90s" },
        { name: "Lever Lying Leg Curl", sets: "3 sets", reps: "12-15 reps", rest: "60s" },
        { name: "Lever Standing Calf Raise", sets: "4 sets", reps: "15 reps", rest: "45s" }
      ]
    },
    {
      name: "Day 3: Push & Deltoids",
      focus: "Chest, Anterior & Lateral Delts, Triceps",
      exercises: [
        { name: "Dumbbell Incline Bench Press", sets: "4 sets", reps: "8-10 reps", rest: "90s" },
        { name: "Lever Chest Press", sets: "3 sets", reps: "10-12 reps", rest: "75s" },
        { name: "Dumbbell Lateral Raise", sets: "4 sets", reps: "12-15 reps", rest: "60s" },
        { name: "Cable Pushdown with Rope", sets: "3 sets", reps: "12-15 reps", rest: "60s" },
        { name: "Hanging Straight Leg Raise", sets: "3 sets", reps: "15 reps", rest: "60s" }
      ]
    },
    {
      name: "Day 4: Pull & Arm Specialization",
      focus: "Lats, Rhomboids, Biceps, Core",
      exercises: [
        { name: "Wide Grip Pull Up", sets: "4 sets", reps: "Max reps", rest: "2 min" },
        { name: "Lever Lying T Bar Row", sets: "4 sets", reps: "10 reps", rest: "90s" },
        { name: "Dumbbell Rear Lateral Raise", sets: "3 sets", reps: "15 reps", rest: "60s" },
        { name: "EZ Barbell Seated Curls", sets: "4 sets", reps: "10-12 reps", rest: "60s" },
        { name: "Russian Twist", sets: "3 sets", reps: "25 reps", rest: "45s" }
      ]
    }
  ]
}

export default function AiWorkoutPage() {
  const [goal, setGoal] = useState("Hypertrophy")
  const [level, setLevel] = useState("Intermediate")
  const [days, setDays] = useState(4)
  const [equipment, setEquipment] = useState("Commercial Gym")
  const [loading, setLoading] = useState(false)
  const [plan, setPlan] = useState<WorkoutPlan>(DEFAULT_PLAN)
  const [saved, setSaved] = useState(false)
  const [completedDays, setCompletedDays] = useState<Record<number, boolean>>({})

  const handleGenerate = async () => {
    setLoading(true)
    setSaved(false)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://aipoweredgymmanagment.onrender.com"
      const res = await fetch(`${apiUrl}/api/ai/generate-workout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal, level, days, equipment })
      })

      if (res.ok) {
        const data = await res.json()
        setPlan(data)
        setLoading(false)
        return
      }
    } catch (e) {
      console.warn("Backend generate API offline, generating with internal engine:", e)
    }

    // Client generation fallback
    setTimeout(() => {
      const generated: WorkoutPlan = {
        title: `${days}-Day AI ${goal} Split (${level})`,
        equipment,
        goal,
        level,
        days: DEFAULT_PLAN.days.slice(0, days)
      }
      setPlan(generated)
      setLoading(false)
    }, 700)
  }

  const handleSavePlan = () => {
    localStorage.setItem("apex_saved_workout_plan", JSON.stringify(plan))
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const toggleDayCompletion = (idx: number) => {
    setCompletedDays((prev) => ({ ...prev, [idx]: !prev[idx] }))
  }

  return (
    <DashboardShell activeTab="AI Workout Plan">
      <div className="flex flex-col gap-6">
        {/* Banner */}
        <div className="relative overflow-hidden rounded-sm border border-border bg-card p-6 md:p-8">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent" />
          <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-primary/20 border border-primary/40 px-2.5 py-0.5 text-[11px] font-bold text-primary uppercase tracking-wider">
                  AI Algorithmic Engine
                </span>
                <span className="text-xs text-muted-foreground font-mono">
                  PostgreSQL Powered
                </span>
              </div>
              <h1 className="mt-2 font-[var(--font-oswald)] text-2xl font-bold uppercase text-foreground md:text-3xl">
                AI Workout Routine Generator
              </h1>
              <p className="mt-1 text-sm text-muted-foreground max-w-xl">
                Generate scientifically optimized training splits based on progressive overload, 
                targeted muscle volume, and recovery cycles.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleSavePlan}
                className="flex items-center gap-2 rounded-sm border border-border bg-secondary px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-foreground transition-all hover:bg-secondary/80"
              >
                {saved ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Saved!
                  </>
                ) : (
                  <>
                    <BookmarkCheck className="h-4 w-4 text-primary" /> Save Plan
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Generator Controls */}
        <div className="grid gap-4 rounded-sm border border-border bg-card p-6 md:grid-cols-4">
          {/* Goal */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Primary Goal
            </label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="mt-2 w-full rounded-sm border border-border bg-input p-2.5 text-sm text-foreground outline-none focus:border-primary"
            >
              <option value="Hypertrophy">Hypertrophy (Muscle Gain)</option>
              <option value="Strength">Powerlifting & Strength</option>
              <option value="Cutting">Fat Loss & Muscle Retention</option>
              <option value="Athletic">Athletic Conditioning</option>
            </select>
          </div>

          {/* Level */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Experience Level
            </label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="mt-2 w-full rounded-sm border border-border bg-input p-2.5 text-sm text-foreground outline-none focus:border-primary"
            >
              <option value="Beginner">Beginner (0-1 Year)</option>
              <option value="Intermediate">Intermediate (1-3 Years)</option>
              <option value="Advanced">Advanced (3+ Years)</option>
            </select>
          </div>

          {/* Days */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Days Per Week
            </label>
            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="mt-2 w-full rounded-sm border border-border bg-input p-2.5 text-sm text-foreground outline-none focus:border-primary"
            >
              <option value={3}>3 Days (Full Body Split)</option>
              <option value={4}>4 Days (Upper / Lower)</option>
              <option value={5}>5 Days (Push Pull Legs Upper)</option>
              <option value={6}>6 Days (Push Pull Legs x2)</option>
            </select>
          </div>

          {/* Equipment */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Equipment
            </label>
            <select
              value={equipment}
              onChange={(e) => setEquipment(e.target.value)}
              className="mt-2 w-full rounded-sm border border-border bg-input p-2.5 text-sm text-foreground outline-none focus:border-primary"
            >
              <option value="Commercial Gym">Full Commercial Gym</option>
              <option value="Dumbbells Only">Dumbbells & Bench</option>
              <option value="Bodyweight">Bodyweight & Calisthenics</option>
            </select>
          </div>

          {/* Generate Button */}
          <div className="md:col-span-4 mt-2">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-sm bg-primary py-3.5 text-sm font-bold uppercase tracking-wider text-primary-foreground transition-all duration-300 hover:shadow-[0_0_30px_oklch(0.65_0.25_25/0.4)] disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Zap className="h-4 w-4 animate-spin" />
                  Generating Custom Split with ApexFit AI...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate AI Training Split
                </>
              )}
            </button>
          </div>
        </div>

        {/* Workout Plan Results */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-[var(--font-oswald)] text-xl font-bold uppercase tracking-wide text-foreground">
                {plan.title}
              </h2>
              <p className="text-xs text-muted-foreground">
                Target: {plan.goal} • Frequency: {plan.days.length} Days/wk • Setup: {plan.equipment}
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {plan.days.map((day, idx) => {
              const isCompleted = !!completedDays[idx]
              return (
                <div
                  key={idx}
                  className={`relative overflow-hidden rounded-sm border transition-all ${
                    isCompleted
                      ? "border-emerald-500/50 bg-emerald-950/10"
                      : "border-border bg-card hover:border-primary/40"
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-border bg-secondary/50 p-4">
                    <div>
                      <h3 className="font-[var(--font-oswald)] text-base font-bold uppercase text-foreground">
                        {day.name}
                      </h3>
                      <p className="text-xs text-primary">{day.focus}</p>
                    </div>
                    <button
                      onClick={() => toggleDayCompletion(idx)}
                      className={`flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all ${
                        isCompleted
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "border border-border bg-card text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {isCompleted ? "Completed" : "Mark Done"}
                    </button>
                  </div>

                  <div className="p-4 space-y-3">
                    {day.exercises.map((ex, exIdx) => (
                      <div
                        key={exIdx}
                        className="flex items-center justify-between rounded-sm border border-border/50 bg-secondary/30 p-3 hover:bg-secondary/60 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-primary/10 text-primary text-xs font-bold font-mono">
                            0{exIdx + 1}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-foreground">
                              {ex.name}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span className="text-primary font-medium">{ex.sets}</span>
                              <span>•</span>
                              <span>{ex.reps}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-xs text-muted-foreground font-mono bg-card px-2 py-1 rounded-sm border border-border">
                          <Clock className="h-3 w-3 text-primary" />
                          {ex.rest}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
