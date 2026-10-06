"use client"

import { useState, useCallback, useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap, LayersControl, LayerGroup, Circle } from "react-leaflet"
import { Search, MapPin, Navigation, Star, Dumbbell, ChevronRight, PlusCircle, Users } from "lucide-react"
import { GymCommunityView } from "./gym-community-view"
import { AddGymModal } from "./add-gym-modal"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

// Custom SVG Blue Marker (Prevents "Tracking Prevention" blocks)
const defaultIcon = new L.DivIcon({
    className: 'custom-div-icon',
    html: `<div style='background-color: #3b82f6; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3);'></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6]
});

// Custom pulsing marker for highlighted search results
const highlightedIcon = new L.DivIcon({
    className: 'custom-div-icon',
    html: `<div style='background-color: #ef4444; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 15px rgba(239, 68, 68, 0.6);' class='pulse'></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7]
});

const defaultCenter: [number, number] = [17.3850, 78.4867] // Hyderabad

interface Member {
    id: string
    name: string
    goal: "Cutting" | "Bulking" | "Strength" | "Endurance"
    timing: "Morning" | "Evening"
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

// Initial fallback data
const initialGyms: Gym[] = [
    {
        id: "1",
        name: "Gold's Gym - Banjara Hills",
        lat: 17.416889,
        lng: 78.43867,
        rating: 4.8,
        address: "Rd No. 12, Amudi Nagar, Banjara Hills, Hyderabad",
        openNow: true,
    }
]

// Component to programmatically change map center
function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
    const map = useMap()
    useEffect(() => {
        if (center) {
            map.setView(center, zoom)
        }
    }, [map, center, zoom])
    return null
}

export default function LeafletMap() {
    const [center, setCenter] = useState<[number, number]>(defaultCenter)
    const [gyms, setGyms] = useState<Gym[]>(initialGyms)
    const [isSyncing, setIsSyncing] = useState(true)
    const [selectedGym, setSelectedGym] = useState<Gym | null>(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [searching, setSearching] = useState(false)
    const [isCommunityOpen, setIsCommunityOpen] = useState(false)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [searchRadius, setSearchRadius] = useState<{ lat: number; lng: number } | null>(null)

    // Distance calculation helper (KM)
    const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    const fetchGyms = async () => {
        setIsSyncing(true)
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/gyms`)
            if (!response.ok) throw new Error('Failed to fetch gyms')
            const data = await response.json()
            
            if (data && data.length > 0) {
                setGyms(data.map((g: any) => ({
                    id: g.id,
                    name: g.name,
                    lat: g.lat,
                    lng: g.lng,
                    rating: g.rating,
                    address: g.address,
                    openNow: g.openNow, // Updated from open_now
                    trainer: g.trainer,
                    members: []
                })))
            }
        } catch (error) {
            console.error('Error fetching gyms from Spring Boot:', error)
        } finally {
            setIsSyncing(false)
        }
    }

    useEffect(() => {
        fetchGyms()
    }, [])

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!searchQuery) {
            fetchGyms()
            return
        }
        setSearching(true)
        try {
            // First check if it matches any gyms in our DB
            const dbRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/gyms?search=${encodeURIComponent(searchQuery)}`)
            if (dbRes.ok) {
                const data = await dbRes.json()
                if (data && data.length > 0) {
                    const mappedGyms = data.map((g: any) => ({
                        id: g.id,
                        name: g.name,
                        lat: g.lat,
                        lng: g.lng,
                        rating: g.rating,
                        address: g.address,
                        openNow: g.openNow,
                        trainer: g.trainer,
                        members: []
                    }))
                    setGyms(mappedGyms)
                    setCenter([mappedGyms[0].lat, mappedGyms[0].lng])
                    setSearchRadius({ lat: mappedGyms[0].lat, lng: mappedGyms[0].lng })
                    setTimeout(() => setSearchRadius(null), 10000)
                    setSearching(false)
                    return
                }
            }
        } catch (error) {
            console.error("DB search error", error)
        }

        // If no gyms found, fallback to map geocoding area check
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`)
            const data = await res.json()
            if (data && data.length > 0) {
                const newLat = parseFloat(data[0].lat);
                const newLng = parseFloat(data[0].lon);
                setCenter([newLat, newLng])
                setSearchRadius({ lat: newLat, lng: newLng })
                setTimeout(() => setSearchRadius(null), 10000)
            }
        } catch (error) {
            console.error("Geocoding failed", error)
        }
        setSearching(false)
    }

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => setCenter([pos.coords.latitude, pos.coords.longitude]),
                (err) => console.error(err)
            )
        }
    }

    return (
        <div className="relative flex h-full w-full flex-col overflow-hidden bg-background">
            {/* Top Controls Overlay */}
            <div className="absolute top-6 left-6 right-6 z-[1000] flex items-center gap-3 pointer-events-none">
                <div className="flex items-center gap-3 pointer-events-auto">
                    <form onSubmit={handleSearch} className="relative w-64 md:w-80">
                        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search area..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value)
                                if (e.target.value === "") {
                                    fetchGyms()
                                    setSearchRadius(null)
                                }
                            }}
                            className="w-full rounded-sm border border-border/50 bg-background/90 px-12 py-3 text-xs backdrop-blur-md transition-all focus:border-primary/50 focus:outline-none shadow-lg"
                        />
                    </form>

                    <button
                        onClick={getLocation}
                        className="flex h-10 w-10 items-center justify-center rounded-sm border border-border/50 bg-background/90 text-primary backdrop-blur-md transition-all hover:bg-background shadow-lg"
                    >
                        <Navigation className="h-4 w-4" />
                    </button>
                    
                    {isSyncing && (
                        <div className="flex items-center gap-2 rounded-sm bg-background/50 px-3 py-2 backdrop-blur-md border border-border/30 shadow-sm">
                            <div className="h-2 w-2 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                            <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground italic">Syncing</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex-1 relative overflow-hidden">
                <MapContainer 
                    key="gym-finder-map"
                    center={center} 
                    zoom={13} 
                    style={{ height: "100%", width: "100%" }} 
                    zoomControl={false}
                >
                    <ChangeView center={center} zoom={13} />

                    <LayersControl position="bottomleft">
                        <LayersControl.BaseLayer checked name="Standard">
                            <TileLayer
                                attribution='&copy; OpenStreetMap'
                                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                            />
                        </LayersControl.BaseLayer>
                        <LayersControl.BaseLayer name="Satellite">
                            <TileLayer
                                attribution='&copy; Google'
                                url="https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
                                subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                            />
                        </LayersControl.BaseLayer>
                    </LayersControl>

                    {searchRadius && (
                        <Circle 
                            center={[searchRadius.lat, searchRadius.lng]} 
                            radius={4000} 
                            pathOptions={{ fillColor: '#ef4444', fillOpacity: 0.1, color: '#ef4444', weight: 1, dashArray: '5, 10' }} 
                        />
                    )}

                    {gyms.map((gym) => {
                        const inSearchZone = searchRadius && getDistance(searchRadius.lat, searchRadius.lng, gym.lat, gym.lng) < 4;
                        return (
                            <Marker
                                key={gym.id}
                                position={[gym.lat, gym.lng]}
                                icon={inSearchZone ? highlightedIcon : defaultIcon}
                                eventHandlers={{ click: () => setSelectedGym(gym) }}
                            >
                                <Popup>
                                    <div className="min-w-[200px] p-1">
                                        <h3 className="font-bold text-lg uppercase text-black m-0">{gym.name}</h3>
                                        <div className="mt-1 flex items-center justify-between">
                                            <div className="flex items-center gap-1 text-black">
                                                <Star className="h-4 w-4 fill-primary text-primary" />
                                                <span className="text-sm font-bold">{gym.rating || "N/A"}</span>
                                            </div>
                                        </div>
                                        <p className="mt-2 text-xs text-slate-600 m-0">{gym.address}</p>
                                        <button
                                            onClick={() => { setSelectedGym(gym); setIsCommunityOpen(true); }}
                                            className="mt-3 flex w-full items-center justify-center gap-2 rounded-sm bg-primary py-2.5 text-xs font-bold uppercase text-primary-foreground"
                                        >
                                            <Users className="h-3 w-3" />
                                            View Community
                                        </button>
                                    </div>
                                </Popup>
                            </Marker>
                        )
                    })}
                </MapContainer>
            </div>

            {isCommunityOpen && selectedGym && (
                <GymCommunityView gym={selectedGym} onClose={() => setIsCommunityOpen(false)} />
            )}

            {isAddModalOpen && (
                <AddGymModal onClose={() => setIsAddModalOpen(false)} onAdd={() => {}} initialCoords={center} />
            )}

            <style dangerouslySetInnerHTML={{ __html: `
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .leaflet-control-zoom { display: none; }
                @keyframes pulse-animation {
                    0% { transform: scale(0.9); opacity: 1; }
                    50% { transform: scale(1.4); opacity: 0.7; }
                    100% { transform: scale(0.9); opacity: 1; }
                }
                .pulse { animation: pulse-animation 1.5s infinite ease-in-out; }
            ` }} />
        </div>
    )
}
