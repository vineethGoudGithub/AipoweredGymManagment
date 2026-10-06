"use client"

import { useState, useRef, useEffect } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import {
  MessageCircle,
  Send,
  Sparkles,
  Bot,
  User,
  Trash2,
  Dumbbell,
  Flame,
  Zap,
  ArrowRight,
  ShieldCheck,
  RotateCcw
} from "lucide-react"

interface Message {
  id: string
  sender: "user" | "ai"
  text: string
  timestamp: string
  suggestions?: string[]
}

const PRESET_PROMPTS = [
  "Create a 4-day Hypertrophy workout split",
  "Calculate my macros for lean bulking",
  "How to properly brace during heavy Barbell Squats?",
  "Best post-workout meal for muscle protein synthesis",
  "Fix my sticking point on Bench Press"
]

export default function ChatPage() {
  const [userName, setUserName] = useState("Athlete")
  const [userGoal, setUserGoal] = useState("Hypertrophy")
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial-1",
      sender: "ai",
      text: "Greetings, Athlete! I am your ApexFit AI Performance Coach. Powered by Neon PostgreSQL knowledge bases, I optimize your training splits, nutritional macro targets, exercise biomechanics, and recovery protocols. What are your fitness objectives today?",
      timestamp: "Just now",
      suggestions: [
        "Generate 4-day Hypertrophy split",
        "Calculate cutting calories & macros",
        "Form check for Barbell Deadlift",
        "Pre-workout energy meal"
      ]
    }
  ])

  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const storedName = localStorage.getItem("userName")
    const storedGoal = localStorage.getItem("userGoal")
    if (storedName) setUserName(storedName)
    if (storedGoal) setUserGoal(storedGoal)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input
    if (!textToSend.trim()) return

    const userMsg: Message = {
      id: "msg-" + Date.now(),
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setLoading(true)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
      const response = await fetch(`${apiUrl}/api/ai/coach`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          userName: userName,
          goal: userGoal
        })
      })

      if (response.ok) {
        const data = await response.json()
        const aiMsg: Message = {
          id: "ai-" + Date.now(),
          sender: "ai",
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestions: data.suggestedFollowUps || []
        }
        setMessages((prev) => [...prev, aiMsg])
        setLoading(false)
        return
      }
    } catch (e) {
      console.warn("Backend AI endpoint unreachable, using intelligent local engine:", e)
    }

    // Local Intelligent Fallback
    setTimeout(() => {
      let reply = ""
      const q = textToSend.toLowerCase()
      let followUps: string[] = []

      if (q.includes("split") || q.includes("workout") || q.includes("routine")) {
        reply = `Here is your optimized ApexFit AI split for ${userGoal}:\n\n`
          + "• Day 1: Upper Body Power (Bench Press 4x6-8, Pendlay Row 4x6-8, Overhead Press 3x8, Pull-ups 3xMax)\n"
          + "• Day 2: Lower Body Power (Barbell Squat 4x6-8, Romanian Deadlift 4x8, Leg Press 3x10, Standing Calf Raises 4x12)\n"
          + "• Day 3: Active Rest & Hip Mobility (20m Foam Rolling + Core work)\n"
          + "• Day 4: Push Hypertrophy (Incline DB Press 4x10, Cable Flies 3x12, Lateral Raises 4x15, Tricep Dips 3x12)\n"
          + "• Day 5: Pull Hypertrophy (Deadlifts 3x5, Lat Pulldown 4x10, Hammer Curls 4x12, Face Pulls 4x15)\n\n"
          + "Rest 90-120s between compound movements. Strive for progressive overload each week."
        followUps = ["How to calculate my caloric intake?", "Recommended warm-up drills", "Tips for shoulder health"]
      } else if (q.includes("macro") || q.includes("diet") || q.includes("calorie") || q.includes("food")) {
        reply = `Nutritional Protocol for ${userGoal} (${userName}):\n\n`
          + "• Protein Target: 2.0g per kg of bodyweight (Lean poultry, Greek yogurt, Whey isolate, Tofu, Eggs)\n"
          + "• Carbohydrate Fuel: 3.5g - 4.5g per kg on heavy training days (Rolled oats, Jasmine rice, Sweet potatoes)\n"
          + "• Essential Fats: 0.8g per kg for hormone production (Avocado, EVOO, Almonds, Salmon)\n"
          + "• Pre-Workout: 40g carbs + 25g protein 90 minutes before your lift + 500ml water."
        followUps = ["Sample 3000 kcal meal plan", "Creatine monohydrate dosage", "Cutting vs Bulking advice"]
      } else if (q.includes("squat") || q.includes("bench") || q.includes("deadlift") || q.includes("form")) {
        reply = `ApexFit Biomechanics Analysis:\n\n`
          + "1. Barbell Back Squat: Maintain a rigid torso by taking a 360-degree belly breath. Drive your knees outwards over your toes, maintaining equal balance over mid-foot.\n"
          + "2. Bench Press: Pin shoulder blades into the bench like you're squeezing a pencil. Keep your elbows roughly 45 degrees to protect the rotator cuff.\n"
          + "3. Deadlift: 'Wedge' yourself into the bar, remove barbell slack, pull chest up, and push the floor away instead of pulling back."
        followUps = ["How to fix lower back fatigue?", "Best assistance exercises"]
      } else {
        reply = `Solid query, ${userName}! As your ApexFit AI coach, I recommend structuring your training with disciplined progressive overload, staying consistent with your daily protein targets, and optimizing sleep (7-8 hours). What specific workout or nutrition metric would you like to review?`
        followUps = ["Create a 4-day Hypertrophy split", "Calculate cutting macros", "Form cues for Barbell Squat"]
      }

      const aiMsg: Message = {
        id: "ai-" + Date.now(),
        sender: "ai",
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: followUps
      }
      setMessages((prev) => [...prev, aiMsg])
      setLoading(false)
    }, 600)
  }

  const handleClear = () => {
    setMessages([
      {
        id: "initial-reset",
        sender: "ai",
        text: `Chat reset. Ready for your next workout session or dietary plan, ${userName}!`,
        timestamp: "Just now",
        suggestions: PRESET_PROMPTS.slice(0, 3)
      }
    ])
  }

  return (
    <DashboardShell activeTab="AI Coach">
      <div className="flex h-[calc(100vh-7.5rem)] flex-col rounded-sm border border-border bg-card overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-secondary/50 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-sm bg-primary/20 border border-primary/40 text-primary shadow-[0_0_15px_oklch(0.65_0.25_25/0.3)]">
              <Bot className="h-5 w-5" />
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-card animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-[var(--font-oswald)] text-lg font-bold uppercase tracking-wider text-foreground">
                  ApexFit AI Coach
                </h2>
                <span className="rounded-full bg-primary/20 border border-primary/30 px-2 py-0.5 text-[10px] font-bold text-primary uppercase">
                  Connected
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Intelligent workout plans • Macro calculations • Form cues • Neon DB sync
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClear}
              className="flex items-center gap-1.5 rounded-sm border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground transition-all hover:bg-secondary hover:text-foreground"
              title="Clear Conversation"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {/* Preset Prompts Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-primary" /> Quick Cues:
            </span>
            {PRESET_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="whitespace-nowrap rounded-sm border border-border bg-secondary/60 px-3 py-1 text-xs text-muted-foreground transition-all hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
              >
                {prompt}
              </button>
            ))}
          </div>

          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${
                m.sender === "user" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`flex max-w-[85%] md:max-w-[75%] gap-3 rounded-sm p-4 text-sm ${
                  m.sender === "user"
                    ? "bg-primary text-primary-foreground font-medium rounded-tr-none shadow-[0_0_20px_oklch(0.65_0.25_25/0.25)]"
                    : "border border-border bg-secondary/80 text-foreground rounded-tl-none shadow-sm"
                }`}
              >
                {m.sender === "ai" && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-sm bg-primary/20 text-primary">
                    <Bot className="h-4 w-4" />
                  </div>
                )}
                <div className="flex-1 space-y-2">
                  <div className="whitespace-pre-line leading-relaxed font-sans">
                    {m.text}
                  </div>
                  <div
                    className={`text-[10px] ${
                      m.sender === "user" ? "text-primary-foreground/75" : "text-muted-foreground"
                    }`}
                  >
                    {m.timestamp}
                  </div>
                </div>
              </div>

              {/* Suggestions */}
              {m.suggestions && m.suggestions.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5 pl-10 max-w-[85%]">
                  {m.suggestions.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(s)}
                      className="rounded-sm border border-border/70 bg-card px-2.5 py-1 text-[11px] text-primary transition-all hover:bg-primary/10 hover:border-primary/40 flex items-center gap-1"
                    >
                      <ArrowRight className="h-3 w-3" />
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3 pl-2 text-sm text-muted-foreground animate-pulse">
              <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-primary/20 text-primary">
                <Bot className="h-4 w-4 animate-spin" />
              </div>
              <span className="font-mono text-xs uppercase tracking-widest text-primary">
                ApexFit AI analyzing biomechanics & protocols...
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="border-t border-border bg-secondary/30 p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="flex items-center gap-2"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask ApexFit AI about workout splits, macro targets, exercise technique..."
                className="w-full rounded-sm border border-border bg-input py-3 pl-4 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/40 font-sans"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-sm bg-primary text-primary-foreground transition-all hover:shadow-[0_0_15px_oklch(0.65_0.25_25/0.4)] disabled:opacity-40 disabled:hover:shadow-none"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
          <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Neon PostgreSQL synced database
            </span>
            <span>ApexFit AI v2.0 • Vineeth Goud</span>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
