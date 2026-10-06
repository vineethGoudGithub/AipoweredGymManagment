"use client"

import { useState, useEffect } from "react"
import { X, Users, Dumbbell, Clock, Target, ShieldCheck, MapPin, Loader2 } from "lucide-react"
import { JoinCommunityModal } from "./join-community-modal"
import { cn } from "@/lib/utils"

interface Member {
    id: string
    userId?: string
    name: string
    goal: "Cutting" | "Bulking" | "Strength" | "Endurance"
    timing: "Morning" | "Evening"
    specificTime?: string
    details: string
}

interface Gym {
    id: string
    name: string
    lat: number
    lng: number
    rating?: number
    address?: string
    photo?: string
    openNow?: boolean
    trainer?: string
    members?: Member[]
}

interface GymCommunityViewProps {
    gym: Gym
    onClose: () => void
}

export function GymCommunityView({ gym, onClose }: GymCommunityViewProps) {
    const [members, setMembers] = useState<Member[]>([])
    const [loading, setLoading] = useState(true)
    const [showJoinModal, setShowJoinModal] = useState(false)
    const [viewingUser, setViewingUser] = useState<any>(null)
    const [loadingUser, setLoadingUser] = useState(false)
    const [showComingSoon, setShowComingSoon] = useState(false)
    const [isMember, setIsMember] = useState(false)

    const currentUserId = typeof window !== 'undefined' ? localStorage.getItem("userId") : null

    const fetchMembers = async () => {
        setLoading(true)
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/gyms/${gym.id}/members`)
            if (!response.ok) throw new Error('Failed to fetch members')
            const data = await response.json()
            setMembers(data)
            
            // Check if current user is a member
            if (currentUserId) {
                const found = data.find((m: Member) => m.userId === currentUserId)
                setIsMember(!!found)
            }
        } catch (error) {
            console.error('Error fetching members from Spring Boot:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchMembers()
    }, [gym.id])

    const handleJoin = async (newMember: Omit<Member, 'id'>) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/gyms/${gym.id}/members`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: newMember.name,
                    goal: newMember.goal,
                    timing: newMember.timing,
                    specificTime: newMember.specificTime,
                    details: newMember.details,
                    userId: localStorage.getItem("userId") // Link to current user if logged in
                }),
            })
            
            if (!response.ok) throw new Error('Failed to join community')

            // Automatically update User's Home Gym if they don't have one saved
            const email = localStorage.getItem("userEmail")
            if (email) {
                try {
                    const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/users/email/${email}`)
                    if (userRes.ok) {
                        const userData = await userRes.json()
                        const currentGym = userData.homeGym
                        if (!currentGym || currentGym === "None" || currentGym === "N/A") {
                            await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/users/login-or-register`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    ...userData,
                                    homeGym: gym.name
                                })
                            })
                        }
                    }
                } catch (e) {
                    console.error("Failed to sync automatically home gym update", e)
                }
            }
            
            setShowJoinModal(false)
            fetchMembers()
        } catch (error) {
            console.error('Error joining community via Spring Boot:', error)
            alert('Failed to join. Please try again.')
        }
    }

    const handleExit = async () => {
        if (!currentUserId) return
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/gyms/${gym.id}/members/${currentUserId}`, {
                method: 'DELETE',
            })
            
            if (!response.ok) throw new Error('Failed to exit community')

            // Update User's Home Gym to N/A
            const email = localStorage.getItem("userEmail")
            if (email) {
                const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/users/email/${email}`)
                if (userRes.ok) {
                    const userData = await userRes.json()
                    await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/users/login-or-register`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            ...userData,
                            homeGym: "N/A"
                        })
                    })
                }
            }
            
            fetchMembers()
        } catch (error) {
            console.error('Error exiting community:', error)
            alert('Failed to exit. Please try again.')
        }
    }

    if (!gym) return null

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-sm border border-border/50 bg-background shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 rounded-full bg-background/50 p-2 text-foreground hover:bg-primary hover:text-primary-foreground transition-all"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="flex flex-col md:flex-row h-full">
                    {/* Left Side: Gym Info */}
                    <div className="w-full md:w-1/3 shrink-0 border-b md:border-b-0 md:border-r border-border/50 bg-secondary/20 p-4 md:p-8">
                        <div className="flex flex-col gap-4 md:gap-6">
                            <div className="flex flex-row md:flex-col items-center md:items-start gap-4 md:gap-6">
                                <div className="h-12 w-12 md:h-16 md:w-16 shrink-0 rounded-sm bg-primary flex items-center justify-center">
                                    <Dumbbell className="h-6 w-6 md:h-8 md:w-8 text-primary-foreground" />
                                </div>

                                <div>
                                    <h2 className="font-[var(--font-oswald)] text-xl md:text-3xl font-bold uppercase tracking-tight text-foreground">{gym.name}</h2>
                                    <div className="mt-1 md:mt-2 flex items-start md:items-center gap-2 text-muted-foreground">
                                        <MapPin className="h-3 w-3 md:h-4 md:w-4 mt-0.5 md:mt-0 shrink-0" />
                                        <p className="text-xs md:text-sm font-medium line-clamp-2 md:line-clamp-none">{gym.address}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 md:space-y-4 pt-1 md:pt-4">
                                <div className="rounded-sm border border-primary/20 bg-primary/5 p-3 md:p-4">
                                    <div className="flex items-center gap-2 text-primary">
                                        <ShieldCheck className="h-3 w-3 md:h-4 md:w-4" />
                                        <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">Head Trainer</span>
                                    </div>
                                    <p className="mt-1 text-sm md:text-lg font-bold text-foreground">{gym.trainer || "Not Assigned"}</p>
                                </div>

                                <div className="flex items-center justify-between px-2">
                                    <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground">Active Members</span>
                                    <span className="text-sm md:text-lg font-black text-primary">{members.length}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Community Members */}
                    <div className="flex-1 flex flex-col overflow-hidden">
                        <style jsx>{`
                            .custom-scroll {
                                max-height: 500px;
                                scrollbar-width: thin;
                                scrollbar-color: oklch(0.65 0.25 25) transparent;
                            }
                            .custom-scroll::-webkit-scrollbar {
                                width: 8px;
                                display: block !important;
                            }
                            .custom-scroll::-webkit-scrollbar-track {
                                background: rgba(255, 255, 255, 0.05);
                                border-radius: 10px;
                            }
                            .custom-scroll::-webkit-scrollbar-thumb {
                                background: oklch(0.65 0.25 25 / 0.4);
                                border-radius: 10px;
                                border: 2px solid transparent;
                                background-clip: padding-box;
                            }
                            .custom-scroll::-webkit-scrollbar-thumb:hover {
                                background: oklch(0.65 0.25 25);
                            }
                        `}</style>
                        <div className="p-4 md:p-8 border-b border-border/50 shrink-0">
                            <h3 className="flex items-center gap-2 text-lg md:text-xl font-bold uppercase tracking-widest text-foreground">
                                <Users className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                                Community Members
                            </h3>
                            <p className="text-xs md:text-sm text-muted-foreground mt-1">People currently training or registered at this location. (Scroll to see more)</p>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scroll p-6 space-y-4 max-h-[60vh] md:max-h-[500px]">
                            {loading ? (
                                <div className="flex h-full items-center justify-center py-20">
                                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                </div>
                            ) : members.length > 0 ? (
                                members.map((member) => (
                                    <div 
                                        key={member.id} 
                                        onClick={async () => {
                                            if (!member.userId || member.userId === "null" || member.userId === "undefined") return
                                            setLoadingUser(true)
                                            setShowComingSoon(false)
                                            try {
                                                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/users/${member.userId}`)
                                                if (res.ok) {
                                                    const data = await res.json()
                                                    setViewingUser(data)
                                                }
                                            } catch (e) {
                                                console.error(e)
                                            } finally {
                                                setLoadingUser(false)
                                            }
                                        }}
                                        className={cn(
                                            "group flex items-start gap-4 rounded-sm border border-border/50 bg-card p-4 transition-all hover:border-primary/50 hover:bg-secondary/20",
                                            member.userId ? "cursor-pointer" : ""
                                        )}
                                    >
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary">
                                            <span className="text-lg font-bold text-primary italic uppercase">{member.name.charAt(0)}</span>
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-bold text-foreground text-sm uppercase tracking-wide">{member.name}</h4>
                                                    {!member.userId && (
                                                        <span className="text-[8px] font-bold uppercase tracking-tighter text-muted-foreground/50 border border-border/50 px-1 rounded-sm">Guest</span>
                                                    )}
                                                </div>
                                                <div className="flex flex-col items-end gap-1">
                                                    <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-muted-foreground bg-secondary/30 px-2 py-0.5 rounded-full">
                                                        <Clock className="h-3 w-3" />
                                                        {member.timing}
                                                    </span>
                                                    {member.specificTime && (
                                                        <span className="text-[9px] font-medium text-primary/80 tracking-widest uppercase">
                                                            {member.specificTime}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="flex items-center gap-1 rounded-sm bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary italic border border-primary/20">
                                                    <Target className="h-3 w-3" />
                                                    {member.goal}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between gap-4">
                                                <p className="text-xs text-muted-foreground leading-relaxed italic opacity-80">"{member.details}"</p>
                                                {member.userId && (
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                                        View Profile →
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex h-full flex-col items-center justify-center text-center opacity-50 py-20">
                                    <Users className="h-12 w-12 mb-4 text-primary" />
                                    <p className="font-bold uppercase tracking-[0.2em] text-sm">No members yet</p>
                                    <p className="text-[10px] mt-1 italic tracking-widest">BE THE FIRST ONE TO JOIN RANA GYM</p>
                                </div>
                            )}
                        </div>

                        <div className="p-8 bg-secondary/10 border-t border-border/50 flex justify-end gap-4">
                            {isMember ? (
                                <button 
                                    onClick={handleExit}
                                    className="rounded-sm border border-destructive/50 bg-destructive/10 px-8 py-3 text-sm font-bold uppercase tracking-widest text-destructive transition-all hover:bg-destructive hover:text-destructive-foreground active:scale-95 shadow-lg"
                                >
                                    Exit Community
                                </button>
                            ) : (
                                <button 
                                    onClick={() => setShowJoinModal(true)}
                                    className="rounded-sm bg-primary px-8 py-3 text-sm font-bold uppercase tracking-widest text-primary-foreground transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-95 shadow-lg shadow-primary/20"
                                >
                                    Join This Community
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {showJoinModal && (
                <JoinCommunityModal 
                    gymName={gym.name}
                    onClose={() => setShowJoinModal(false)}
                    onJoin={handleJoin}
                />
            )}

            {/* User Profile Detail Overlay */}
            {viewingUser && (
                <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
                    <div className="relative w-full max-w-lg rounded-sm border border-primary/20 bg-background overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4">
                        <button 
                            onClick={() => setViewingUser(null)}
                            className="absolute top-4 right-4 z-10 text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <div className="h-24 bg-gradient-to-r from-primary/20 to-transparent" />
                        
                        <div className="px-8 pb-8">
                            <div className="relative -mt-12 mb-6 inline-block">
                                <div className="h-24 w-24 rounded-full border-4 border-background bg-secondary flex items-center justify-center overflow-hidden">
                                    {viewingUser.photoUrl ? (
                                        <img src={viewingUser.photoUrl} className="h-full w-full object-cover" />
                                    ) : (
                                        <Users className="h-10 w-10 text-primary" />
                                    )}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h2 className="font-[var(--font-oswald)] text-2xl font-bold uppercase tracking-tight">{viewingUser.name}</h2>
                                    <p className="text-xs text-primary font-bold uppercase tracking-widest mt-1">@{viewingUser.username || "gym_rat"}</p>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <span className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-sm text-[10px] font-bold text-primary uppercase italic">{viewingUser.fitnessGoal}</span>
                                    <span className="px-3 py-1 bg-secondary/30 rounded-sm text-[10px] font-bold text-muted-foreground uppercase">{viewingUser.experience} Level</span>
                                </div>

                                <div className="space-y-2">
                                    <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Personal Bio</h4>
                                    <p className="text-sm text-foreground leading-relaxed italic opacity-90">
                                        {viewingUser.bio || "This user prefers to keep their training secrets to themselves."}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
                                    <div className="space-y-1">
                                        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Training Time</span>
                                        <p className="text-xs font-medium text-foreground">{viewingUser.timing || "Anytime"}</p>
                                    </div>
                                    <div className="space-y-1 text-right">
                                        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Home Gym</span>
                                        <p className="text-xs font-medium text-foreground">{viewingUser.homeGym || "Iron Paradise"}</p>
                                    </div>
                                </div>

                                {viewingUser.weeklySchedule && (
                                    <div className="space-y-1">
                                        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Weekly Schedule</span>
                                        <p className="text-xs text-foreground italic opacity-90">{viewingUser.weeklySchedule}</p>
                                    </div>
                                )}

                                {showComingSoon ? (
                                    <div className="w-full mt-4 flex items-center justify-center gap-2 bg-primary/10 border border-primary/30 rounded-sm py-3 text-[10px] font-bold uppercase tracking-widest text-primary animate-in slide-in-from-bottom-2 duration-300">
                                        <Clock className="h-4 w-4 animate-pulse" />
                                        <span>Messaging Coming Soon</span>
                                    </div>
                                ) : (
                                    <button 
                                        onClick={() => setShowComingSoon(true)}
                                        className="w-full mt-4 bg-primary py-3 text-[10px] font-bold uppercase tracking-widest text-primary-foreground hover:bg-primary/90 transition-all border border-primary/20 flex items-center justify-center gap-2 shadow-[0_0_15px_oklch(0.65_0.25_25/0.2)] hover:shadow-[0_0_20px_oklch(0.65_0.25_25/0.4)]"
                                    >
                                        Connect / Message
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {loadingUser && (
                <div className="fixed inset-0 z-[4000] flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
            )}
        </div>
    )
}
