"use client"

import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import { DashboardShell } from "@/components/dashboard-shell"

const TravelModeMap = dynamic(() => import("@/components/gym-finder/travel-mode-map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[400px] w-full items-center justify-center rounded-sm border border-border bg-card">
      <div className="flex flex-col items-center gap-3">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">Loading travel mode…</p>
      </div>
    </div>
  ),
})

export default function TravelModePage() {
  const router = useRouter()
  return (
    <DashboardShell activeTab="Travel Mode">
      <div className="h-[calc(100vh-140px)] min-h-[480px]">
        <TravelModeMap
          initialView="summary"
        />
      </div>
    </DashboardShell>
  )
}
