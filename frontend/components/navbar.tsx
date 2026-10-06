"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Dumbbell, Menu, X, LogOut, User } from "lucide-react"

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Find Gyms", href: "/gyms" },
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Community", href: "#community" },
]

export function Navbar({ minimal = false }: { minimal?: boolean }) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = () => {
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
      if (isLoggedIn) {
        setUser({
          user_metadata: {
            full_name: localStorage.getItem("userName") || "Vineeth Goud"
          }
        })
      } else {
        setUser(null)
      }
      setLoading(false)
    }

    checkUser()

    // Create a custom event listener to handle storage changes (like login/logout in other tabs)
    window.addEventListener('storage', checkUser)
    return () => window.removeEventListener('storage', checkUser)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("userName")
    setUser(null)
    router.push("/")
  }

  return (
    <nav className="fixed top-0 left-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:h-20 md:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-primary transition-shadow duration-300 group-hover:shadow-[0_0_20px_oklch(0.65_0.25_25/0.5)]">
            <Dumbbell className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-[var(--font-oswald)] text-xl font-bold uppercase tracking-wider text-foreground">
            ApexFit AI
          </span>
        </Link>

        {/* Desktop Nav */}
        {!minimal && (
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="group relative text-sm uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="hidden items-center gap-4 md:flex">
          {!loading && !minimal && (
            user ? (
              <div className="flex items-center gap-6">
                <Link
                  href="/dashboard"
                  className="group relative flex items-center gap-2 text-sm uppercase tracking-[0.15em] text-muted-foreground transition-all hover:text-foreground"
                >
                  <User className="h-4 w-4 text-primary" />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:text-primary"
                >
                  <LogOut className="h-4 w-4" />
                  Log Out
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:text-foreground"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="relative overflow-hidden rounded-sm bg-primary px-6 py-2.5 text-sm font-semibold uppercase tracking-[0.15em] text-primary-foreground transition-all duration-300 hover:shadow-[0_0_30px_oklch(0.65_0.25_25/0.4)]"
                >
                  Join Now
                </Link>
              </>
            )
          )}
        </div>

        {/* Mobile toggle */}
        {!minimal && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-sm text-foreground md:hidden"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        )}
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "overflow-hidden border-t border-border/50 bg-background/95 backdrop-blur-xl transition-all duration-500 md:hidden",
          isOpen ? "max-h-80" : "max-h-0 border-t-0"
        )}
      >
        <div className="flex flex-col gap-1 px-4 py-4">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="rounded-sm px-4 py-3 text-sm uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
            {!loading && (
              user ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-sm bg-secondary px-4 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-foreground"
                  >
                    <User className="h-4 w-4 text-primary" />
                     Dashboard
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setIsOpen(false); }}
                    className="flex items-center justify-center gap-2 rounded-sm border border-border px-4 py-3 text-sm uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <LogOut className="h-4 w-4" />
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="rounded-sm px-4 py-3 text-center text-sm uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsOpen(false)}
                    className="rounded-sm bg-primary px-4 py-3 text-center text-sm font-semibold uppercase tracking-[0.15em] text-primary-foreground"
                  >
                    Join Now
                  </Link>
                </>
              )
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
