"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Dumbbell, Eye, EyeOff, ArrowRight, Loader2, AlertCircle } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [rememberMe, setRememberMe] = useState(false)

  // Auto-login if already logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
    if (isLoggedIn) {
      router.push("/dashboard")
    }

    // Load remembered email
    const savedEmail = localStorage.getItem("rememberedEmail")
    if (savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail }))
      setRememberMe(true)
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    
    // Simulating login to bypass Supabase email limits for now
    setTimeout(async () => {
      // Log user in to Database so they update their lastLogin in Supabase users table
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/users/login-or-register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email })
        });
      } catch (e) {
        console.error("Failed to sync login with DB", e);
      }

      // Mock session for UI development
      localStorage.setItem("isLoggedIn", "true")
      const derivedName = formData.email ? (formData.email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase())) : "Vineeth Goud"
      localStorage.setItem("userName", derivedName || "Vineeth Goud")
      localStorage.setItem("userEmail", formData.email)
      
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", formData.email)
      } else {
        localStorage.removeItem("rememberedEmail")
      }

      router.push("/dashboard")
    }, 1000)
  }

  return (
    <div className="flex min-h-screen">
      {/* Left - Image Side */}
      <div className="relative hidden w-1/2 overflow-hidden lg:block">
        <Image
          src="/images/hero-grip.jpg"
          alt="Athlete gripping barbell"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-background/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background" />

        {/* Overlay content */}
        <div className="absolute bottom-16 left-16 z-10">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Welcome Back
          </p>
          <h2 className="mt-2 font-[var(--font-oswald)] text-4xl font-bold uppercase leading-tight text-foreground xl:text-5xl">
            The iron<br />
            <span className="text-primary">waits for<br />no one</span>
          </h2>
        </div>

        {/* Vertical accent line */}
        <div className="absolute top-0 right-0 h-full w-px bg-border/50" />
      </div>

      {/* Right - Form Side */}
      <div className="flex w-full flex-col justify-center px-8 lg:w-1/2 lg:px-20 xl:px-28">
        {/* Logo */}
        <Link href="/" className="mb-16 flex items-center gap-2 self-start">
          <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-primary">
            <Dumbbell className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-[var(--font-oswald)] text-xl font-bold uppercase tracking-wider text-foreground">
            ApexFit AI
          </span>
        </Link>

        <div>
          <h1 className="font-[var(--font-oswald)] text-3xl font-bold uppercase text-foreground md:text-4xl">
            Log In
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {"Get back to your grind. Don't have an account? "}
            <Link href="/register" className="text-primary transition-colors hover:text-gym-red-bright">
              Sign up
            </Link>
          </p>
        </div>

        {error && (
          <div className="mt-6 flex items-center gap-3 rounded-sm border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-500 animate-in fade-in slide-in-from-top-1">
            <AlertCircle className="h-4 w-4" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-6">
          {/* Email */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
              Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="rounded-sm border border-border bg-input px-4 py-3.5 text-sm text-foreground outline-none transition-all duration-300 placeholder:text-gym-text-dim focus:border-primary focus:shadow-[0_0_20px_oklch(0.65_0.25_25/0.15)]"
              placeholder="your@email.com"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                Password
              </label>
              <button type="button" className="text-xs text-primary transition-colors hover:text-gym-red-bright">
                Forgot?
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full rounded-sm border border-border bg-input px-4 py-3.5 pr-12 text-sm text-foreground outline-none transition-all duration-300 placeholder:text-gym-text-dim focus:border-primary focus:shadow-[0_0_20px_oklch(0.65_0.25_25/0.15)]"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-4 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="peer h-4 w-4 appearance-none rounded-sm border border-border bg-input transition-all checked:border-primary checked:bg-primary"
                />
                <svg
                  className="absolute h-3 w-3 text-primary-foreground opacity-0 transition-opacity peer-checked:opacity-100"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="4"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground transition-colors group-hover:text-foreground">
                Remember Me
              </span>
            </label>
            <Link href="/register" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Need an account?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="group mt-4 flex items-center justify-center gap-2 rounded-sm bg-primary px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] text-primary-foreground transition-all duration-300 hover:shadow-[0_0_30px_oklch(0.65_0.25_25/0.4)] disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Enter The Gym
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="mt-8 flex items-center gap-4">
          <span className="h-px flex-1 bg-border" />
          <span className="text-xs uppercase tracking-wider text-muted-foreground">or</span>
          <span className="h-px flex-1 bg-border" />
        </div>

        {/* Social Login */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center gap-2 rounded-sm border border-border px-4 py-3 text-sm text-muted-foreground transition-all duration-300 hover:border-primary/30 hover:text-foreground">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google
          </button>
          <button className="flex items-center justify-center gap-2 rounded-sm border border-border px-4 py-3 text-sm text-muted-foreground transition-all duration-300 hover:border-primary/30 hover:text-foreground">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            GitHub
          </button>
        </div>
      </div>
    </div>
  )
}
