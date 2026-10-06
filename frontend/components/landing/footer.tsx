import Link from "next/link"
import { Dumbbell } from "lucide-react"

export function FooterSection() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="grid gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-primary">
                <Dumbbell className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-[var(--font-oswald)] text-xl font-bold uppercase tracking-wider text-foreground">
                ApexFit AI
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              AI-Powered Gym Management & Smart Partner Matching Platform. Train harder, smarter, together.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground">Product</h4>
            <div className="mt-4 flex flex-col gap-3">
              <Link href="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Features</Link>
              <Link href="#how-it-works" className="text-sm text-muted-foreground transition-colors hover:text-foreground">How It Works</Link>
              <Link href="/exercises" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Exercise Library</Link>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground">Company</h4>
            <div className="mt-4 flex flex-col gap-3">
              <Link href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">About</Link>
              <Link href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Careers</Link>
              <Link href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Blog</Link>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground">Legal</h4>
            <div className="mt-4 flex flex-col gap-3">
              <Link href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Privacy</Link>
              <Link href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Terms</Link>
              <Link href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Contact</Link>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-xs text-muted-foreground">
            2026 ApexFit AI. Developed by Vineeth Goud. All rights reserved.
          </p>
          <p className="text-xs text-gym-text-dim">
            No excuses. Just results.
          </p>
        </div>
      </div>
    </footer>
  )
}
