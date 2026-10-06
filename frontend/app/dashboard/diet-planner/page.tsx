"use client"

import { useState } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import {
  UtensilsCrossed,
  Flame,
  Zap,
  Droplets,
  Scale,
  Sparkles,
  CheckCircle2,
  PieChart,
  Apple,
  Clock,
  BookmarkCheck
} from "lucide-react"

export default function DietPlannerPage() {
  const [weight, setWeight] = useState(75) // kg
  const [height, setHeight] = useState(178) // cm
  const [age, setAge] = useState(24)
  const [gender, setGender] = useState("male")
  const [activity, setActivity] = useState(1.55) // Moderate
  const [goal, setGoal] = useState("lean-bulk") // lean-bulk, cut, maintain
  const [dietaryPref, setDietaryPref] = useState("non-veg")
  const [saved, setSaved] = useState(false)

  // Mifflin - St Jeor Equation
  const bmr =
    gender === "male"
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161

  const tdee = Math.round(bmr * activity)

  let targetCalories = tdee
  if (goal === "lean-bulk") targetCalories = tdee + 300
  else if (goal === "aggressive-bulk") targetCalories = tdee + 500
  else if (goal === "moderate-cut") targetCalories = tdee - 400
  else if (goal === "aggressive-shred") targetCalories = tdee - 700

  // Macros Calculation
  const proteinGrams = Math.round(weight * (goal.includes("cut") ? 2.2 : 2.0))
  const fatGrams = Math.round((targetCalories * 0.25) / 9)
  const carbCalories = targetCalories - (proteinGrams * 4 + fatGrams * 9)
  const carbGrams = Math.max(0, Math.round(carbCalories / 4))

  const waterLiters = (weight * 0.045).toFixed(1)

  const meals = [
    {
      name: "Meal 1: High-Protein Breakfast",
      time: "08:00 AM",
      calories: Math.round(targetCalories * 0.25),
      protein: Math.round(proteinGrams * 0.25),
      carbs: Math.round(carbGrams * 0.3),
      fats: Math.round(fatGrams * 0.2),
      foods: dietaryPref === "veg"
        ? ["80g Rolled Oats with Almond Milk", "1 scoop Plant Whey Isolate", "15g Chia Seeds", "1 Banana", "Handful of Blueberries"]
        : ["3 Whole Eggs + 2 Egg Whites Scrambled", "75g Rolled Oats with Honey", "1 scoop Whey Isolate", "1 Banana"]
    },
    {
      name: "Meal 2: Anabolic Lunch",
      time: "01:00 PM",
      calories: Math.round(targetCalories * 0.35),
      protein: Math.round(proteinGrams * 0.35),
      carbs: Math.round(carbGrams * 0.35),
      fats: Math.round(fatGrams * 0.35),
      foods: dietaryPref === "veg"
        ? ["150g Tofu / Paneer Sautéed", "150g Cooked Brown Rice / Quinoa", "1 Cup Boiled Chickpeas", "Large Mixed Green Salad with Olive Oil"]
        : ["180g Grilled Chicken Breast", "180g Basmati Rice", "Steamed Broccoli & Green Beans", "1 tbsp Extra Virgin Olive Oil"]
    },
    {
      name: "Meal 3: Pre-Workout Surge",
      time: "04:30 PM",
      calories: Math.round(targetCalories * 0.15),
      protein: Math.round(proteinGrams * 0.15),
      carbs: Math.round(carbGrams * 0.2),
      fats: Math.round(fatGrams * 0.1),
      foods: ["2 Rice Cakes with 1 tbsp Natural Peanut Butter", "1 Sliced Apple", "Black Coffee / Pre-workout fuel", "500ml Water"]
    },
    {
      name: "Meal 4: Recovery Dinner",
      time: "08:30 PM",
      calories: Math.round(targetCalories * 0.25),
      protein: Math.round(proteinGrams * 0.25),
      carbs: Math.round(carbGrams * 0.15),
      fats: Math.round(fatGrams * 0.35),
      foods: dietaryPref === "veg"
        ? ["150g Grilled Tempeh or Cottage Cheese", "200g Baked Sweet Potatoes", "Avocado Slices (50g)", "Stir-fried Bell Peppers & Zucchini"]
        : ["180g Baked Salmon / Lean Beef Patty", "200g Roasted Sweet Potatoes", "Avocado Slices (50g)", "Steamed Asparagus"]
    }
  ]

  const handleSave = () => {
    localStorage.setItem(
      "apex_diet_targets",
      JSON.stringify({ targetCalories, proteinGrams, carbGrams, fatGrams, goal })
    )
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <DashboardShell activeTab="AI Diet & Macros">
      <div className="flex flex-col gap-6">
        {/* Banner */}
        <div className="relative overflow-hidden rounded-sm border border-border bg-card p-6 md:p-8">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent" />
          <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-primary/20 border border-primary/40 px-2.5 py-0.5 text-[11px] font-bold text-primary uppercase tracking-wider">
                  Macro & Calorie Intelligence
                </span>
                <span className="text-xs text-muted-foreground font-mono">
                  Mifflin-St Jeor Formula
                </span>
              </div>
              <h1 className="mt-2 font-[var(--font-oswald)] text-2xl font-bold uppercase text-foreground md:text-3xl">
                AI Nutrition & Macro Planner
              </h1>
              <p className="mt-1 text-sm text-muted-foreground max-w-xl">
                Calculate precision caloric balance, targeted macronutrient partitions, and meal timing 
                tailored to your exact physique aspirations.
              </p>
            </div>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 rounded-sm bg-primary px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-primary-foreground transition-all duration-300 hover:shadow-[0_0_20px_oklch(0.65_0.25_25/0.4)]"
            >
              {saved ? (
                <>
                  <CheckCircle2 className="h-4 w-4" /> Targets Saved
                </>
              ) : (
                <>
                  <BookmarkCheck className="h-4 w-4" /> Save Targets
                </>
              )}
            </button>
          </div>
        </div>

        {/* Input Controls */}
        <div className="grid gap-4 rounded-sm border border-border bg-card p-6 sm:grid-cols-2 lg:grid-cols-6">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Bodyweight (kg)
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="mt-2 w-full rounded-sm border border-border bg-input p-2.5 text-sm text-foreground outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Height (cm)
            </label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="mt-2 w-full rounded-sm border border-border bg-input p-2.5 text-sm text-foreground outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Age
            </label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="mt-2 w-full rounded-sm border border-border bg-input p-2.5 text-sm text-foreground outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Activity Level
            </label>
            <select
              value={activity}
              onChange={(e) => setActivity(Number(e.target.value))}
              className="mt-2 w-full rounded-sm border border-border bg-input p-2.5 text-sm text-foreground outline-none focus:border-primary"
            >
              <option value={1.2}>Sedentary (Desk Job)</option>
              <option value={1.375}>Lightly Active (1-3 days/wk)</option>
              <option value={1.55}>Moderately Active (3-5 days/wk)</option>
              <option value={1.725}>Very Active (6-7 days/wk)</option>
              <option value={1.9}>Extreme Athlete (2x/day)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Physique Target
            </label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="mt-2 w-full rounded-sm border border-border bg-input p-2.5 text-sm text-foreground outline-none focus:border-primary"
            >
              <option value="lean-bulk">Lean Bulk (+300 kcal)</option>
              <option value="aggressive-bulk">Hypertrophy Max (+500 kcal)</option>
              <option value="maintain">Maintenance</option>
              <option value="moderate-cut">Fat Loss (-400 kcal)</option>
              <option value="aggressive-shred">Contest Shred (-700 kcal)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Diet Style
            </label>
            <select
              value={dietaryPref}
              onChange={(e) => setDietaryPref(e.target.value)}
              className="mt-2 w-full rounded-sm border border-border bg-input p-2.5 text-sm text-foreground outline-none focus:border-primary"
            >
              <option value="non-veg">Omnivore / High-Protein</option>
              <option value="veg">Vegetarian / Plant-Based</option>
            </select>
          </div>
        </div>

        {/* Macro Targets Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-sm border border-border bg-card p-5 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Target Calories
              </span>
              <Flame className="h-4 w-4 text-primary" />
            </div>
            <div className="mt-3 text-3xl font-extrabold text-foreground font-[var(--font-oswald)]">
              {targetCalories} <span className="text-sm font-normal text-muted-foreground">kcal/day</span>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Maintenance TDEE: {tdee} kcal
            </div>
          </div>

          <div className="rounded-sm border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Daily Protein
              </span>
              <Zap className="h-4 w-4 text-primary" />
            </div>
            <div className="mt-3 text-3xl font-extrabold text-foreground font-[var(--font-oswald)]">
              {proteinGrams} <span className="text-sm font-normal text-muted-foreground">grams</span>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              {(proteinGrams * 4)} kcal • {Math.round(((proteinGrams * 4) / targetCalories) * 100)}% of total
            </div>
          </div>

          <div className="rounded-sm border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
                Carbohydrates
              </span>
              <Apple className="h-4 w-4 text-amber-500" />
            </div>
            <div className="mt-3 text-3xl font-extrabold text-foreground font-[var(--font-oswald)]">
              {carbGrams} <span className="text-sm font-normal text-muted-foreground">grams</span>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              {(carbGrams * 4)} kcal • {Math.round(((carbGrams * 4) / targetCalories) * 100)}% of total
            </div>
          </div>

          <div className="rounded-sm border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Healthy Fats & Water
              </span>
              <Droplets className="h-4 w-4 text-cyan-400" />
            </div>
            <div className="mt-3 text-3xl font-extrabold text-foreground font-[var(--font-oswald)]">
              {fatGrams} <span className="text-sm font-normal text-muted-foreground">g fat</span>
            </div>
            <div className="mt-2 text-xs text-cyan-400">
              Optimal Hydration: {waterLiters} Liters/day
            </div>
          </div>
        </div>

        {/* Meal Breakdown Section */}
        <div className="flex flex-col gap-4">
          <h2 className="font-[var(--font-oswald)] text-xl font-bold uppercase tracking-wide text-foreground">
            Precision Meal Timing Breakdown
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            {meals.map((meal, idx) => (
              <div
                key={idx}
                className="rounded-sm border border-border bg-card p-5 transition-all hover:border-primary/40"
              >
                <div className="flex items-center justify-between border-b border-border/70 pb-3">
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">
                      {meal.name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 text-primary" />
                      {meal.time}
                    </div>
                  </div>
                  <div className="text-right font-mono text-xs">
                    <span className="font-bold text-primary">{meal.calories} kcal</span>
                    <div className="text-[11px] text-muted-foreground">
                      {meal.protein}P • {meal.carbs}C • {meal.fats}F
                    </div>
                  </div>
                </div>

                <div className="mt-3 space-y-1.5">
                  {meal.foods.map((food, fIdx) => (
                    <div
                      key={fIdx}
                      className="flex items-center gap-2 text-xs text-muted-foreground"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <span>{food}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
