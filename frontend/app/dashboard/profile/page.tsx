"use client"

import { useState, useEffect } from "react"
import {
  User,
  Camera,
  Clock,
  Target,
  Calendar,
  Flame,
  MapPin,
  Award,
  Edit3,
  Check,
  TrendingUp,
  LogOut,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { DashboardShell } from "@/components/dashboard-shell"
import { cn } from "@/lib/utils"

// Schedule will now be computed dynamically


const achievements = [
  { label: "First Match", icon: "lightning", unlocked: false },
  { label: "10 Sessions", icon: "fire", unlocked: false },
  { label: "PR Breaker", icon: "trophy", unlocked: false },
  { label: "Social Butterfly", icon: "users", unlocked: false },
  { label: "Iron Veteran", icon: "medal", unlocked: false },
  { label: "Travel Rat", icon: "globe", unlocked: false },
]

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const [editData, setEditData] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const handleLogout = () => {
    localStorage.clear()
    router.push("/login")
  }

  useEffect(() => {
    // Set fallback name from localStorage if available
    const storedName = localStorage.getItem("userName")
    const storedGymId = localStorage.getItem("userGymId")
    if (storedName) {
      setUserData((prev: any) => ({ ...prev, name: storedName }))
    }

    const fetchUser = async () => {
      const email = localStorage.getItem("userEmail")
      if (email) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/users/email/${email}`)
          if (res.ok) {
            const data = await res.json()
            setUserData((prev: any) => ({ ...prev, ...data }))
            setEditData(data)
          }
        } catch (e) {
          console.error("Failed to fetch user data:", e)
        }
      }
      setLoading(false)
    }

    fetchUser()
  }, [])

  const handleSave = async () => {
    const email = localStorage.getItem("userEmail")
    if (!email) return

    try {
      const payload = {
        email,
        ...editData
      }
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/users/login-or-register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
      if (res.ok) {
        const updated = await res.json()
        setUserData((prev: any) => ({ ...prev, ...updated }))
        if (updated.name) localStorage.setItem("userName", updated.name)
        if (updated.fitnessGoal) localStorage.setItem("userGoal", updated.fitnessGoal)
        setIsEditing(false)
      }
    } catch (e) {
      console.error("Failed to save profile", e)
    }
  }

  const displayData = {
    name: userData?.name || "Marcus Johnson",
    username: userData?.username || (userData?.name ? userData.name.toLowerCase().replace(/\s+/g, '_') : "marcus_lifts"),
    goal: userData?.fitnessGoal || "Powerlifting",
    experience: userData?.experience || "Advanced",
    gym: (userData?.homeGym && userData?.homeGym !== "None") ? userData.homeGym : "N/A",
    bio: userData?.bio || "Competitive powerlifter chasing the 1500 total. 5 years of training experience. Looking for a dedicated training partner who takes the sport seriously. I train at Iron Paradise Gym, mornings before work. Let us push some heavy weight together.",
    age: userData?.age?.toString() || "28",
    timing: userData?.timing || "Morning (5-7 AM)",
    weeklySchedule: userData?.weeklySchedule || "Mon, Tue, Thu, Fri"
  }

  const dynamicSchedule = [
    { day: "Mon" },
    { day: "Tue" },
    { day: "Wed" },
    { day: "Thu" },
    { day: "Fri" },
    { day: "Sat" },
    { day: "Sun" },
  ].map(s => {
    const scheduleStr = (isEditing && editData.weeklySchedule !== undefined ? (editData.weeklySchedule || "") : (displayData.weeklySchedule || "")).toLowerCase();
    const dayMatch = scheduleStr.match(new RegExp(`${s.day.toLowerCase()}(\\((m|e)\\))?`));
    const isActive = !!dayMatch;
    let time = "";
    if (isActive) {
      if (dayMatch[2] === 'm') time = "M";
      else if (dayMatch[2] === 'e') time = "E";
      else time = "Active";
    }
    return {
      day: s.day,
      active: isActive,
      time: time
    };
  });

  return (
    <DashboardShell activeTab="Profile">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-col gap-6">
          {/* Profile Header Card */}
          <div className="relative overflow-hidden rounded-sm border border-border bg-card">
            {/* Banner */}
            <div className="relative h-32 bg-gradient-to-r from-primary/20 via-primary/5 to-transparent md:h-40">
              <div className="absolute inset-0" style={{
                backgroundImage: "linear-gradient(135deg, oklch(0.65 0.25 25 / 0.1) 25%, transparent 25%, transparent 50%, oklch(0.65 0.25 25 / 0.1) 50%, oklch(0.65 0.25 25 / 0.1) 75%, transparent 75%)",
                backgroundSize: "20px 20px",
              }} />
            </div>

            <div className="relative px-6 pb-6 md:px-8">
              {/* Avatar */}
              <div className="relative -mt-16 mb-4 inline-block">
                <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-card bg-primary/10 md:h-32 md:w-32">
                  <User className="h-14 w-14 text-primary" />
                </div>
                <button className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-110">
                  <Camera className="h-4 w-4" />
                </button>
                {/* Online indicator */}
                <span className="absolute top-2 right-2 h-4 w-4 rounded-full border-2 border-card bg-green-500" />
              </div>

              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={editData.name || ""} 
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className="bg-input border border-border rounded-sm px-2 py-1 text-2xl font-bold uppercase text-foreground w-full max-w-[250px]"
                    />
                  ) : (
                    <h2 className="font-[var(--font-oswald)] text-3xl font-bold uppercase text-foreground">
                      {displayData.name}
                    </h2>
                  )}
                  <p className="mt-1 text-sm text-muted-foreground">@{displayData.username}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <button 
                      disabled={!isEditing}
                      onClick={() => {
                        const goalsCount = ["Cardio", "Strength", "Bulking", "Cutting", "Powerlifting"];
                        const current = goalsCount.indexOf(editData.fitnessGoal || displayData.goal);
                        const next = goalsCount[(current + 1) % goalsCount.length];
                        setEditData({ ...editData, fitnessGoal: next });
                      }}
                      className={cn(
                        "flex items-center gap-1.5 rounded-sm px-3 py-1 text-xs font-semibold transition-all",
                        isEditing ? "bg-primary text-primary-foreground hover:scale-105" : "bg-primary/10 text-primary"
                      )}
                    >
                      <Target className="h-3 w-3" />
                      {isEditing ? (editData.fitnessGoal || displayData.goal) : displayData.goal}
                    </button>
                    <button 
                      disabled={!isEditing}
                      onClick={() => {
                        const expLevels = ["Beginner", "Intermediate", "Advanced", "Expert"];
                        const current = expLevels.indexOf(editData.experience || displayData.experience);
                        const next = expLevels[(current + 1) % expLevels.length];
                        setEditData({ ...editData, experience: next });
                      }}
                      className={cn(
                        "flex items-center gap-1.5 rounded-sm px-3 py-1 text-xs font-semibold transition-all",
                        isEditing ? "bg-foreground text-background hover:scale-105" : "bg-secondary text-foreground"
                      )}
                    >
                      <Award className="h-3 w-3" />
                      {isEditing ? (editData.experience || displayData.experience) : displayData.experience}
                    </button>
                    <span className="flex items-center gap-1.5 rounded-sm bg-secondary px-3 py-1 text-xs font-semibold text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {displayData.gym}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      if (isEditing) {
                        handleSave()
                      } else {
                        setIsEditing(true)
                      }
                    }}
                    className={cn(
                      "flex items-center gap-2 rounded-sm px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all duration-300",
                      isEditing
                        ? "bg-primary text-primary-foreground"
                        : "border border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
                    )}
                  >
                    {isEditing ? (
                      <>
                        <Check className="h-3 w-3" />
                        Save Profile
                      </>
                    ) : (
                      <>
                        <Edit3 className="h-3 w-3" />
                        Edit Profile
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 rounded-sm border border-border px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-all duration-300 hover:border-destructive/30 hover:text-destructive"
                  >
                    <LogOut className="h-3 w-3" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left Column */}
            <div className="flex flex-col gap-6 lg:col-span-2">
              {/* Bio */}
              <div className="rounded-sm border border-border bg-card p-6">
                <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  About
                </h3>
                {isEditing ? (
                  <textarea 
                    value={editData.bio || ""} 
                    onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                    className="w-full mt-3 rounded-sm border border-border bg-input p-3 text-sm text-foreground outline-none focus:border-primary/50 min-h-[100px]"
                  />
                ) : (
                  <p className="mt-3 text-sm leading-relaxed text-foreground">
                    {displayData.bio}
                  </p>
                )}
              </div>

              {/* Weekly Schedule */}
              <div className="rounded-sm border border-border bg-card p-6">
                <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Weekly Schedule
                </h3>
                <div className="mt-4 grid grid-cols-7 gap-2">
                  {dynamicSchedule.map((s) => (
                    <button
                      key={s.day}
                      disabled={!isEditing}
                      onClick={() => {
                        if (!isEditing) return
                        const currentSchedule = editData.weeklySchedule || displayData.weeklySchedule
                        const daysMap = currentSchedule.split(/[\s,]+/).filter((d: string) => Boolean(d)).reduce((acc: any, d: string) => {
                          const match = d.match(/([a-zA-Z]+)(\((m|e)\))?/i);
                          if (match) acc[match[1].toLowerCase()] = match[3] || "active";
                          return acc;
                        }, {});
                        
                        const dayKey = s.day.toLowerCase();
                        const currentState = daysMap[dayKey]; // undefined, active, m, e

                        if (!currentState) {
                          daysMap[dayKey] = "active";
                        } else if (currentState === "active") {
                          daysMap[dayKey] = "m";
                        } else if (currentState === "m") {
                          daysMap[dayKey] = "e";
                        } else {
                          delete daysMap[dayKey];
                        }

                        const newSchedule = Object.entries(daysMap).map(([day, time]) => {
                          const capDay = day.charAt(0).toUpperCase() + day.slice(1);
                          return time === "active" ? capDay : `${capDay}(${time})`;
                        }).join(", ");
                        
                        setEditData({ ...editData, weeklySchedule: newSchedule })
                      }}
                      className={cn(
                        "flex flex-col items-center gap-1.5 rounded-sm border p-3 transition-all h-full min-h-[80px] justify-center",
                        s.active
                          ? "border-primary/30 bg-primary/5"
                          : "border-border bg-secondary/30",
                        isEditing && "hover:border-primary/50 cursor-pointer"
                      )}
                    >
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        {s.day}
                      </span>
                      {s.active ? (
                        <>
                          <div className={cn(
                            "h-2 w-2 rounded-full shadow-[0_0_8px_currentcolor]", 
                            s.time === "M" ? "bg-orange-500 text-orange-500" : s.time === "E" ? "bg-blue-400 text-blue-400" : "bg-primary text-primary"
                          )} />
                          <span className={cn(
                            "text-[10px] font-black tracking-tighter", 
                            s.time === "M" ? "text-orange-500" : s.time === "E" ? "text-blue-400" : "text-primary"
                          )}>
                            {s.time === "Active" ? "✓" : s.time}
                          </span>
                        </>
                      ) : (
                        <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {[
                  { label: "Total Sessions", value: "0", icon: Flame },
                  { label: "Partners", value: "0", icon: User },
                  { label: "Current Streak", value: "0", icon: TrendingUp },
                  { label: "PRs Set", value: "0", icon: Award },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="flex flex-col items-center rounded-sm border border-border bg-card p-5 text-center"
                  >
                    <stat.icon className="h-5 w-5 text-primary" />
                    <span className="mt-2 font-[var(--font-oswald)] text-2xl font-bold text-foreground">
                      {stat.value}
                    </span>
                    <span className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-6">
              {/* Quick Info */}
              <div className="rounded-sm border border-border bg-card p-6">
                <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Details
                </h3>
                <div className="mt-4 flex flex-col gap-4">
                  {isEditing ? (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground mr-2">Age</span>
                        <input type="number" value={editData.age || ""} onChange={e => setEditData({...editData, age: e.target.value ? parseInt(e.target.value, 10) : ""})} className="bg-input border border-border rounded-sm px-2 py-1 text-foreground text-sm w-32 text-right" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground mr-2">Goal</span>
                        <input type="text" value={editData.fitnessGoal || ""} onChange={e => setEditData({...editData, fitnessGoal: e.target.value})} className="bg-input border border-border rounded-sm px-2 py-1 text-foreground text-sm w-32 text-right" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground mr-2">Experience</span>
                        <input type="text" value={editData.experience || ""} onChange={e => setEditData({...editData, experience: e.target.value})} className="bg-input border border-border rounded-sm px-2 py-1 text-foreground text-sm w-32 text-right" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground mr-2">Timing</span>
                        <input type="text" value={editData.timing || ""} onChange={e => setEditData({...editData, timing: e.target.value})} className="bg-input border border-border rounded-sm px-2 py-1 text-foreground text-sm w-32 text-right" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground mr-2">Home Gym</span>
                        <span className="text-sm font-medium text-foreground">{displayData.gym}</span>
                      </div>
                    </>
                  ) : (
                    [
                      { label: "Age", value: displayData.age },
                      { label: "Goal", value: displayData.goal },
                      { label: "Experience", value: displayData.experience },
                      { label: "Timing", value: displayData.timing },
                      { label: "Home Gym", value: displayData.gym },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{item.label}</span>
                        <span className="text-sm font-medium text-foreground">{item.value}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Achievements */}
              <div className="rounded-sm border border-border bg-card p-6">
                <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Achievements
                </h3>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {achievements.map((a) => (
                    <div
                      key={a.label}
                      className={cn(
                        "flex flex-col items-center gap-1.5 rounded-sm border p-3 text-center transition-all",
                        a.unlocked
                          ? "border-primary/20 bg-primary/5"
                          : "border-border bg-secondary/30 opacity-40"
                      )}
                    >
                      <div className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full",
                        a.unlocked ? "bg-primary/20" : "bg-secondary"
                      )}>
                        <Award className={cn("h-4 w-4", a.unlocked ? "text-primary" : "text-muted-foreground")} />
                      </div>
                      <span className="text-[9px] font-semibold uppercase leading-tight text-muted-foreground">
                        {a.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
