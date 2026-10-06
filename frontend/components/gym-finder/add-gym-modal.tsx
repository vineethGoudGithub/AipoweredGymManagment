"use client"

import { useState } from "react"
import { X, MapPin, Dumbbell, Star, Save } from "lucide-react"

interface AddGymModalProps {
    onClose: () => void
    onAdd: (gym: any) => void
    initialCoords?: [number, number]
}

export function AddGymModal({ onClose, onAdd, initialCoords }: AddGymModalProps) {
    const [name, setName] = useState("")
    const [address, setAddress] = useState("")
    const [trainer, setTrainer] = useState("")
    const [lat, setLat] = useState(initialCoords?.[0].toString() || "")
    const [lng, setLng] = useState(initialCoords?.[1].toString() || "")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!name || !lat || !lng) return

        onAdd({
            id: Math.random().toString(),
            name,
            lat: parseFloat(lat),
            lng: parseFloat(lng),
            address,
            trainer,
            rating: 5.0,
            openNow: true,
            members: []
        })
        onClose()
    }

    return (
        <div className="fixed inset-0 z-[2500] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="relative w-full max-w-md rounded-sm border border-primary/20 bg-background p-8 shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="flex items-center gap-3 mb-8">
                    <div className="h-10 w-10 bg-primary flex items-center justify-center rounded-sm">
                        <Save className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                        <h2 className="font-[var(--font-oswald)] text-2xl font-bold uppercase tracking-tight">Add New Gym</h2>
                        <p className="text-xs text-muted-foreground uppercase tracking-widest">Share your fitness spot</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Gym Name</label>
                        <input
                            required
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Muscle Arena"
                            className="w-full bg-secondary/30 border border-border/50 rounded-sm px-4 py-3 text-sm focus:border-primary focus:outline-none transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Address / Area</label>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Ghatkesar, Hyderabad..."
                                className="w-full bg-secondary/30 border border-border/50 rounded-sm pl-12 pr-4 py-3 text-sm focus:border-primary focus:outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Head Trainer (Optional)</label>
                        <input
                            type="text"
                            value={trainer}
                            onChange={(e) => setTrainer(e.target.value)}
                            placeholder="Name of the main coach"
                            className="w-full bg-secondary/30 border border-border/50 rounded-sm px-4 py-3 text-sm focus:border-primary focus:outline-none transition-all"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Latitude</label>
                            <input
                                required
                                type="text"
                                value={lat}
                                onChange={(e) => setLat(e.target.value)}
                                className="w-full bg-secondary/30 border border-border/50 rounded-sm px-4 py-3 text-sm"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Longitude</label>
                            <input
                                required
                                type="text"
                                value={lng}
                                onChange={(e) => setLng(e.target.value)}
                                className="w-full bg-secondary/30 border border-border/50 rounded-sm px-4 py-3 text-sm"
                            />
                        </div>
                    </div>

                    <p className="text-[10px] text-muted-foreground italic mt-4">
                        By adding this gym, you verify that the coordinates and location are accurate for other users.
                    </p>

                    <button
                        type="submit"
                        className="w-full bg-primary py-4 text-sm font-bold uppercase tracking-[0.2em] text-primary-foreground hover:bg-primary/90 transition-all rounded-sm shadow-xl shadow-primary/20"
                    >
                        Publish Location
                    </button>
                </form>
            </div>
        </div>
    )
}
