"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Dumbbell,
  MapPin,
  BookOpen,
  MessageCircle,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  Search,
  ChevronRight,
  Sparkles,
  UtensilsCrossed,
  Brain,
  Navigation,
} from "lucide-react"
import { cn } from "@/lib/utils"

const sidebarLinks = [
  { icon: MapPin, label: "Gym Finder", href: "/gyms" },
  { icon: Sparkles, label: "AI Workout Plan", href: "/dashboard/ai-workout" },
  { icon: UtensilsCrossed, label: "AI Diet & Macros", href: "/dashboard/diet-planner" },
  { icon: MessageCircle, label: "AI Coach", href: "/dashboard/chat", badge: "AI" },
  { icon: Navigation, label: "Travel Mode", href: "/dashboard/travel-mode" },
  { icon: BookOpen, label: "Exercises", href: "/dashboard/exercises" },
  { icon: User, label: "Profile", href: "/dashboard/profile" },
]

export function DashboardShell({ children, activeTab = "Gym Finder" }: { children: React.ReactNode; activeTab?: string }) {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const checkUser = () => {
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
      if (isLoggedIn) {
        setUser({
          user_metadata: {
            full_name: localStorage.getItem("userName") || "Vineeth Goud",
            fitness_goal: localStorage.getItem("userGoal") || "Powerlifting"
          }
        })
      }
    }
    checkUser()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("userName")
    localStorage.removeItem("userGoal")
    router.push("/")
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar - Desktop */}
      <aside className="hidden w-64 flex-col border-r border-border bg-card lg:flex">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b border-border px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary shadow-[0_0_15px_oklch(0.65_0.25_25/0.4)]">
            <Dumbbell className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-[var(--font-oswald)] text-lg font-bold uppercase tracking-wider text-foreground">
            ApexFit AI
          </span>
        </div>

        {/* Nav */}
        <nav className="flex flex-1 flex-col gap-1 p-4">
          {sidebarLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={cn(
                "group flex items-center gap-3 rounded-sm px-4 py-3 text-sm transition-all duration-200",
                activeTab === link.label
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <link.icon className="h-4 w-4" />
              <span className="font-medium">{link.label}</span>
              {link.badge && (
                <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary/20 border border-primary/30 px-1.5 text-[10px] font-bold text-primary">
                  {link.badge}
                </span>
              )}
              {activeTab === link.label && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
              )}
            </Link>
          ))}
        </nav>

        {/* User */}
        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 border border-primary/20 text-primary font-bold">
              {user?.user_metadata?.full_name?.[0] || 'V'}
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="text-sm font-medium text-foreground truncate">{user?.user_metadata?.full_name || 'Vineeth Goud'}</div>
              <div className="text-xs text-muted-foreground truncate">{user?.user_metadata?.fitness_goal || 'Hypertrophy'}</div>
            </div>
            <button 
              onClick={handleLogout}
              className="text-muted-foreground transition-colors hover:text-primary"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-[9999] lg:hidden" onClick={() => setSidebarOpen(false)}>
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
          <aside className="absolute left-0 top-0 h-full w-64 border-r border-border bg-card" onClick={(e) => e.stopPropagation()}>
            <div className="flex h-16 items-center justify-between border-b border-border px-6">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary">
                  <Dumbbell className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-[var(--font-oswald)] text-lg font-bold uppercase tracking-wider text-foreground">
                  ApexFit AI
                </span>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="text-muted-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-1 p-4">
              {sidebarLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 rounded-sm px-4 py-3 text-sm transition-all duration-200",
                    activeTab === link.label
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  <span className="font-medium">{link.label}</span>
                  {link.badge && (
                    <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
                      {link.badge}
                    </span>
                  )}
                </Link>
              ))}
            </nav>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden relative z-0">
        {/* Top Bar */}
        <header className="flex relative z-[5000] h-16 items-center justify-between border-b border-border bg-card/50 px-4 backdrop-blur-sm md:px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-muted-foreground lg:hidden"
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="font-[var(--font-oswald)] text-lg font-semibold uppercase tracking-wide text-foreground">
              {activeTab}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                className="w-56 rounded-sm border border-border bg-input py-2 pl-10 pr-4 text-sm text-foreground outline-none transition-all placeholder:text-gym-text-dim focus:border-primary/50 focus:w-72"
              />
            </div>

            {/* Notifications */}
            <button className="relative flex h-9 w-9 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
            </button>

            {/* Check-in button */}
            <button className="hidden items-center gap-2 rounded-sm border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-primary transition-all duration-300 hover:bg-primary/20 hover:shadow-[0_0_20px_oklch(0.65_0.25_25/0.2)] sm:flex">
              <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
              Check In
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
