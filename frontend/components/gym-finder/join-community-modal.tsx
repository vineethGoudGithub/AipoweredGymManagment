"use client"

import { useState } from "react"
import { X, Target, Clock, MessageSquare, UserPlus } from "lucide-react"

interface JoinCommunityModalProps {
    onClose: () => void
    onJoin: (member: any) => void
    gymName: string
}

export function JoinCommunityModal({ onClose, onJoin, gymName }: JoinCommunityModalProps) {
    const [name, setName] = useState("")
    const [goal, setGoal] = useState<"Cutting" | "Bulking" | "Strength" | "Endurance">("Strength")
    const [timing, setTiming] = useState<"Morning" | "Evening">("Evening")
    const [specificTime, setSpecificTime] = useState("")
    const [details, setDetails] = useState("")
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name || !details) return
        
        setSubmitting(true)
        onJoin({
            name,
            goal,
            timing,
            specificTime,
            details
        })
    }

    return (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="relative w-full max-w-md rounded-sm border border-primary/20 bg-background p-8 shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="flex items-center gap-3 mb-8">
                    <div className="h-10 w-10 bg-primary flex items-center justify-center rounded-sm">
                        <UserPlus className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                        <h2 className="font-[var(--font-oswald)] text-2xl font-bold uppercase tracking-tight">Join Community</h2>
                        <p className="text-xs text-muted-foreground uppercase tracking-widest">{gymName}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Your Name</label>
                        <input 
                            required
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="How should others call you?"
                            className="w-full bg-secondary/30 border border-border/50 rounded-sm px-4 py-3 text-sm focus:border-primary focus:outline-none transition-all font-medium"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Primary Goal</label>
                            <div className="relative">
                                <Target className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                                <select 
                                    value={goal}
                                    onChange={(e) => setGoal(e.target.value as any)}
                                    className="w-full bg-secondary/30 border border-border/50 rounded-sm pl-10 pr-4 py-3 text-sm focus:border-primary focus:outline-none transition-all appearance-none font-medium text-foreground"
                                >
                                    <option value="Strength">Strength</option>
                                    <option value="Bulking">Bulking</option>
                                    <option value="Cutting">Cutting</option>
                                    <option value="Endurance">Endurance</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Typical Timing</label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                                <select 
                                    value={timing}
                                    onChange={(e) => setTiming(e.target.value as any)}
                                    className="w-full bg-secondary/30 border border-border/50 rounded-sm pl-10 pr-4 py-3 text-sm focus:border-primary focus:outline-none transition-all appearance-none font-medium text-foreground"
                                >
                                    <option value="Morning">Morning</option>
                                    <option value="Evening">Evening</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Specific Time Slot</label>
                        <div className="relative">
                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                            <input 
                                required
                                type="text"
                                value={specificTime}
                                onChange={(e) => setSpecificTime(e.target.value)}
                                placeholder="E.g. 6:00 AM - 7:30 AM"
                                className="w-full bg-secondary/30 border border-border/50 rounded-sm pl-12 pr-4 py-3 text-sm focus:border-primary focus:outline-none transition-all font-medium text-foreground"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">What are you working on?</label>
                        <div className="relative">
                            <MessageSquare className="absolute left-4 top-4 h-4 w-4 text-primary" />
                            <textarea 
                                required
                                value={details}
                                onChange={(e) => setDetails(e.target.value)}
                                placeholder="E.g. Working on my deadlift form..."
                                rows={3}
                                className="w-full bg-secondary/30 border border-border/50 rounded-sm pl-12 pr-4 py-3 text-sm focus:border-primary focus:outline-none transition-all resize-none italic text-foreground"
                            />
                        </div>
                    </div>

                    <button 
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-primary py-4 text-sm font-bold uppercase tracking-[0.2em] text-primary-foreground hover:bg-primary/95 disabled:opacity-50 transition-all rounded-sm shadow-xl shadow-primary/20 mt-4 active:scale-95"
                    >
                        {submitting ? "JOINING..." : "JOIN NOW"}
                    </button>
                </form>
            </div>
        </div>
    )
}
