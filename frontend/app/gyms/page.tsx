"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { GymMap } from "@/components/gym-finder/gym-map"
import { DashboardShell } from "@/components/dashboard-shell"

export default function GymsPage() {
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const checkUser = () => {
            const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
            
            if (isLoggedIn) {
                const mockUser = {
                    user_metadata: {
                        full_name: localStorage.getItem("userName") || "Vineeth Goud"
                    }
                }
                setUser(mockUser)
                setLoading(false)
            } else {
                router.push("/login")
            }
        }
        checkUser()
    }, [router])

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative h-12 w-12">
                        <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
                        <div className="relative h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    </div>
                    <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary animate-pulse">Authenticating...</p>
                </div>
            </div>
        )
    }

    return (
        <DashboardShell activeTab="Gym Finder">
            <div className="h-[calc(100vh-140px)] w-full relative">
                <GymMap />
            </div>
        </DashboardShell>
    )
}
