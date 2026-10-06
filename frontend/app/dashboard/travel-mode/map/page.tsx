"use client"

import { useRouter } from "next/navigation"
import { DashboardShell } from "@/components/dashboard-shell"
import dynamic from "next/dynamic"

const TravelModeMap = dynamic(() => import("@/components/gym-finder/travel-mode-map"), {
  ssr: false,
})

export default function TravelModeMapPage() {
  const router = useRouter()

  return (
    <DashboardShell activeTab="Travel Mode">
      <div className="h-[calc(100vh-140px)] min-h-[520px]">
        <TravelModeMap
          initialView="map"
          onBack={() => router.push("/dashboard/travel-mode")}
          onOpenMap={() => {}}
          onOpenGyms={() => router.push("/dashboard/travel-mode/gyms")}
        />
      </div>
    </DashboardShell>
  )
}
