"use client"

import { useState, useEffect } from "react"
import {
  Search,
  Filter,
  Play,
  ChevronRight,
  Flame,
  Target,
  Clock,
  AlertTriangle,
  CheckCircle2,
  X,
  Dumbbell,
  Loader2,
} from "lucide-react"
import { DashboardShell } from "@/components/dashboard-shell"
import { ExerciseVideo } from "@/components/exercise-video"
import { cn } from "@/lib/utils"

const muscleGroups = ["All", "Chest", "Back", "Shoulders", "Legs", "Arms", "Core"]

const workoutPlans = [
  {
    name: "Beginner Foundation",
    level: "Beginner",
    days: 3,
    description: "Full body workouts to build a solid base",
    exercises: 15,
  },
  {
    name: "Intermediate Push/Pull/Legs",
    level: "Intermediate",
    days: 5,
    description: "Classic PPL split for muscle growth",
    exercises: 30,
  },
  {
    name: "Advanced Powerbuilding",
    level: "Advanced",
    days: 6,
    description: "Strength meets hypertrophy for experienced lifters",
    exercises: 42,
  },
]

export default function ExercisesPage() {
  const [selectedGroup, setSelectedGroup] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedExercise, setSelectedExercise] = useState<any | null>(null)
  const [activeTab, setActiveTab] = useState<"exercises" | "plans">("exercises")
  const [dbExercises, setDbExercises] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [visibleCount, setVisibleCount] = useState(12)

  // Fetch from Spring Boot API
  useEffect(() => {
    async function fetchExercises() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/exercises`)
        if (!response.ok) throw new Error('Failed to fetch exercises')
        const data = await response.json()
        setDbExercises(data)
      } catch (error) {
        console.error('Error fetching from Spring Boot:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchExercises()
  }, [])

  const filtered = dbExercises.filter((e) => {
    const matchesGroup = selectedGroup === "All" || e.muscleGroup === selectedGroup
    const normalize = (val: string) => val.toLowerCase().replace(/[^a-z0-9]/g, '')
    const matchesSearch = normalize(e.name).includes(normalize(searchQuery))
    return matchesGroup && matchesSearch
  })

  // Helper to get video path
  const getVideoPath = (exercise: any) => {
    if (exercise.videoPath) {
      // Ensure there's no leading slash
      return exercise.videoPath.replace(/^\/+/, '')
    }
    return exercise.name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '.mp4'
  }

  return (
    <DashboardShell activeTab="Exercises">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-[var(--font-oswald)] text-2xl font-bold uppercase text-foreground md:text-3xl">
              Exercise Library
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Master your form. Maximize your gains.
            </p>
          </div>

          {/* Tab toggle */}
          <div className="flex rounded-sm border border-border">
            <button
              onClick={() => setActiveTab("exercises")}
              className={cn(
                "px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all",
                activeTab === "exercises"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Exercises
            </button>
            <button
              onClick={() => setActiveTab("plans")}
              className={cn(
                "px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all",
                activeTab === "plans"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Workout Plans
            </button>
          </div>
        </div>

        {activeTab === "exercises" ? (
          <>
            {/* Search & Filters */}
            <div className="flex flex-col gap-4 md:flex-row md:items-start">
              <div className="relative flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search exercises (e.g., Bench Press, Squat...)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-sm border border-border bg-input py-3 pl-10 pr-4 text-sm text-foreground outline-none transition-all placeholder:text-gym-text-dim focus:border-primary/50 focus:shadow-[0_0_20px_oklch(0.65_0.25_25/0.1)]"
                  />
                </div>
                {!loading && (
                  <div className="mt-2 flex items-center gap-2 px-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    <span className="flex h-2 w-2 animate-pulse rounded-full bg-primary" />
                    Live: Showing {filtered.length} of {dbExercises.length} Exercises
                  </div>
                )}
              </div>
            </div>

            {/* Muscle Group Filter */}
            <div className="flex flex-wrap gap-2">
              {muscleGroups.map((group) => (
                <button
                  key={group}
                  onClick={() => setSelectedGroup(group)}
                  className={cn(
                    "rounded-sm border px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-300",
                    selectedGroup === group
                      ? "border-primary bg-primary/10 text-primary shadow-[0_0_15px_oklch(0.65_0.25_25/0.15)]"
                      : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
                  )}
                >
                  {group}
                </button>
              ))}
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex h-64 flex-col items-center justify-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Loading Library...</p>
              </div>
            )}

            {/* Exercise Grid */}
            {!loading && (
              <div className="flex flex-col gap-8">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {filtered.slice(0, visibleCount).map((exercise) => (
                    <button
                      key={exercise.id}
                      onClick={() => setSelectedExercise(exercise)}
                      className="group relative flex flex-col overflow-hidden rounded-sm border border-border bg-card p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_4px_20px_oklch(0_0_0/0.3)]"
                    >
                      {/* Top row */}
                      <div className="flex items-start justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-primary/10">
                          <Dumbbell className="h-5 w-5 text-primary" />
                        </div>
                        <span
                          className={cn(
                            "rounded-sm px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                            exercise.difficultyLevel === "Beginner"
                              ? "bg-green-500/10 text-green-400"
                              : exercise.difficultyLevel === "Intermediate"
                                ? "bg-yellow-500/10 text-yellow-400"
                                : "bg-primary/10 text-primary"
                          )}
                        >
                          {exercise.difficultyLevel}
                        </span>
                      </div>

                      <h3 className="mt-4 font-[var(--font-oswald)] text-lg font-semibold uppercase text-foreground">
                        {exercise.name}
                      </h3>

                      <div className="mt-2 flex items-center gap-2">
                        <span className="rounded-sm bg-secondary px-2 py-0.5 text-[10px] font-semibold uppercase text-primary">
                          {exercise.muscleGroup}
                        </span>
                        {exercise.secondaryMuscles && (
                          <span className="text-xs text-muted-foreground">{exercise.secondaryMuscles}</span>
                        )}
                      </div>

                      <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                        {exercise.proTip || "Master the form with our visual guide."}
                      </p>

                      {/* Hover accent */}
                      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-primary transition-all duration-500 group-hover:w-full" />
                    </button>
                  ))}

                  {filtered.length === 0 && (
                    <div className="col-span-full py-20 text-center">
                      <p className="text-muted-foreground">No exercises found for this filter.</p>
                    </div>
                  )}
                </div>

                {/* Load More Button */}
                {filtered.length > visibleCount && (
                  <div className="flex justify-center pb-8">
                    <button
                      onClick={() => setVisibleCount(prev => prev + 12)}
                      className="group flex items-center gap-3 rounded-sm border border-primary/20 bg-primary/5 px-8 py-4 text-xs font-bold uppercase tracking-widest text-primary transition-all hover:bg-primary/10 hover:shadow-[0_0_15px_oklch(0.65_0.25_25/0.1)]"
                    >
                      Load More Exercises
                      <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          /* Workout Plans */
          <div className="grid gap-6 md:grid-cols-3">
            {workoutPlans.map((plan) => (
              <div
                key={plan.name}
                className="group relative overflow-hidden rounded-sm border border-border bg-card transition-all duration-500 hover:border-primary/30"
              >
                {/* Header bar */}
                <div
                  className={cn(
                    "p-6",
                    plan.level === "Beginner"
                      ? "bg-green-500/5 border-b border-green-500/20"
                      : plan.level === "Intermediate"
                      ? "bg-yellow-500/5 border-b border-yellow-500/20"
                      : "bg-primary/5 border-b border-primary/20"
                  )}
                >
                  <span
                    className={cn(
                      "text-[10px] font-bold uppercase tracking-[0.3em]",
                      plan.level === "Beginner"
                        ? "text-green-400"
                        : plan.level === "Intermediate"
                        ? "text-yellow-400"
                        : "text-primary"
                    )}
                  >
                    {plan.level}
                  </span>
                  <h3 className="mt-2 font-[var(--font-oswald)] text-xl font-bold uppercase text-foreground">
                    {plan.name}
                  </h3>
                </div>

                <div className="p-6">
                  <p className="text-sm leading-relaxed text-muted-foreground">{plan.description}</p>

                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">{plan.days} days/week</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">{plan.exercises} exercises</span>
                    </div>
                  </div>

                  <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-sm bg-primary/10 py-3 text-xs font-semibold uppercase tracking-wider text-primary transition-all hover:bg-primary/20">
                    View Full Plan
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Exercise Detail Modal */}
      {selectedExercise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelectedExercise(null)}>
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
          <div
            className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-sm border border-border bg-card p-8 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setSelectedExercise(null)}
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Header */}
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-primary/10">
                <Dumbbell className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-[var(--font-oswald)] text-2xl font-bold uppercase text-foreground">
                  {selectedExercise.name}
                </h3>
                <div className="mt-1 flex items-center gap-2">
                  <span className="rounded-sm bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                    {selectedExercise.muscleGroup}
                  </span>
                  {selectedExercise.secondaryMuscles && (
                    <span className="text-xs text-muted-foreground">{selectedExercise.secondaryMuscles}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Video Player */}
            <div className="mt-8">
              <ExerciseVideo 
                 path={getVideoPath(selectedExercise)} 
                 className="aspect-video rounded-sm border border-border shadow-2xl"
              />
            </div>

            {/* Instructions */}
            <div className="mt-8">
              <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-foreground">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Step-by-Step Instructions
              </h4>
              <div className="mt-4 flex flex-col gap-3">
                {selectedExercise.instructions?.map((step: string, i: number) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                      {i + 1}
                    </span>
                    <p className="text-sm leading-relaxed text-muted-foreground">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Common Mistakes */}
            {selectedExercise.commonMistakes && selectedExercise.commonMistakes.length > 0 && (
              <div className="mt-8">
                <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-foreground">
                  <AlertTriangle className="h-4 w-4 text-yellow-400" />
                  Common Mistakes
                </h4>
                <div className="mt-4 flex flex-col gap-2">
                  {selectedExercise.commonMistakes.map((mistake: string, i: number) => (
                    <div key={i} className="flex items-center gap-2 rounded-sm border border-yellow-500/10 bg-yellow-500/5 px-4 py-2.5">
                      <X className="h-3 w-3 shrink-0 text-yellow-400" />
                      <p className="text-sm text-muted-foreground">{mistake}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Form Tips */}
            <div className="mt-8 rounded-sm border border-primary/20 bg-primary/5 p-5">
              <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                <Flame className="h-4 w-4" />
                Pro Tip
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {selectedExercise.proTip || "Consistency is key. Focus on quality over quantity."}
              </p>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  )
}
