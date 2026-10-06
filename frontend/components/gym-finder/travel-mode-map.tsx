"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet"
import L from "leaflet"
import {
  Navigation,
  MapPin,
  Phone,
  Route,
  Shuffle,
  LocateFixed,
  Clock,
  Dumbbell,
  ListChecks,
  Sparkles,
  BadgeCheck,
} from "lucide-react"
import "leaflet/dist/leaflet.css"

interface TravelModeMapProps {
  initialView?: "summary" | "map" | "gyms"
  onBack?: () => void
  onOpenMap?: () => void
  onOpenGyms?: () => void
}

interface Gym {
  id: string
  name: string
  lat: number
  lng: number
  rating?: number
  address?: string
  trainer?: string
  phone?: string
}

function Recenter({ target }: { target?: [number, number] }) {
  const map = useMap()
  useEffect(() => {
    if (target) {
      map.flyTo(target, 14)
    }
  }, [target, map])
  return null
}

const fallbackGyms: Gym[] = [
  { id: "fg-1", name: "Steel Yard Gym", lat: 17.4386, lng: 78.4482, rating: 4.7, trainer: "Karthik", phone: "+91 98765 43210" },
  { id: "fg-2", name: "Power House", lat: 17.429, lng: 78.4549, rating: 4.6, trainer: "Aditi", phone: "+91 98765 11122" },
  { id: "fg-3", name: "Iron Core", lat: 17.4221, lng: 78.4699, rating: 4.8, trainer: "Rohit", phone: "+91 98765 33344" },
  { id: "fg-4", name: "Beast Factory", lat: 17.4145, lng: 78.4731, rating: 4.5, trainer: "Sindhu", phone: "+91 98765 55566" },
]

const defaultStart: [number, number] = [17.385, 78.4867]
const defaultDest: [number, number] = [17.4507, 78.3806]

function haversineMeters(a: [number, number], b: [number, number]) {
  const R = 6371000
  const dLat = ((b[0] - a[0]) * Math.PI) / 180
  const dLon = ((b[1] - a[1]) * Math.PI) / 180
  const lat1 = (a[0] * Math.PI) / 180
  const lat2 = (b[0] * Math.PI) / 180
  const sinDLat = Math.sin(dLat / 2)
  const sinDLon = Math.sin(dLon / 2)
  const aVal = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon
  const c = 2 * Math.atan2(Math.sqrt(aVal), Math.sqrt(1 - aVal))
  return R * c
}

function distancePointToSegmentMeters(p: [number, number], a: [number, number], b: [number, number]) {
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const R = 6371000
  const pLat = toRad(p[0])
  const pLon = toRad(p[1])
  const aLat = toRad(a[0])
  const aLon = toRad(a[1])
  const bLat = toRad(b[0])
  const bLon = toRad(b[1])

  const x = Math.cos(pLat) * Math.cos(pLon)
  const y = Math.cos(pLat) * Math.sin(pLon)
  const z = Math.sin(pLat)

  const ax = Math.cos(aLat) * Math.cos(aLon)
  const ay = Math.cos(aLat) * Math.sin(aLon)
  const az = Math.sin(aLat)

  const bx = Math.cos(bLat) * Math.cos(bLon)
  const by = Math.cos(bLat) * Math.sin(bLon)
  const bz = Math.sin(bLat)

  const ABx = bx - ax
  const ABy = by - ay
  const ABz = bz - az
  const APx = x - ax
  const APy = y - ay
  const APz = z - az

  const ab2 = ABx * ABx + ABy * ABy + ABz * ABz
  const ap_ab = APx * ABx + APy * ABy + APz * ABz
  const t = Math.max(0, Math.min(1, ap_ab / ab2))

  const closestX = ax + ABx * t
  const closestY = ay + ABy * t
  const closestZ = az + ABz * t

  const dot = x * closestX + y * closestY + z * closestZ
  const angle = Math.acos(Math.min(1, Math.max(-1, dot)))
  return angle * R
}

function gymsAlongRoute(gyms: Gym[], route: [number, number][], radiusMeters = 5000) {
  if (route.length < 2) return []

  // Check bounding box first to quickly filter totally irrelevant gyms
  // This helps performance by excluding gyms far from the entire route area
  let minLat = 90, maxLat = -90, minLng = 180, maxLng = -180
  route.forEach(([lat, lng]) => {
    if (lat < minLat) minLat = lat
    if (lat > maxLat) maxLat = lat
    if (lng < minLng) minLng = lng
    if (lng > maxLng) maxLng = lng
  })
  
  // Add buffer to bounding box (approx 0.05 degrees is roughly 5.5km)
  const buffer = 0.055
  minLat -= buffer; maxLat += buffer;
  minLng -= buffer; maxLng += buffer;

  const candidateGyms = gyms.filter(g => 
    g.lat >= minLat && g.lat <= maxLat && g.lng >= minLng && g.lng <= maxLng
  )

  return candidateGyms
    .map((gym) => {
      let minDist = Number.POSITIVE_INFINITY
      // Check exact distance to all route segments
      for (let i = 0; i < route.length - 1; i++) {
        const d = distancePointToSegmentMeters([gym.lat, gym.lng], route[i], route[i + 1])
        if (d < minDist) minDist = d
      }
      return { gym, distance: minDist }
    })
    .filter((g) => g.distance <= radiusMeters)
    .sort((a, b) => a.distance - b.distance)
    .map((g) => g.gym)
}

async function geocodeLocation(query: string) {
  const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`)
  const data = await res.json()
  if (data && data.length) {
    return [parseFloat(data[0].lat), parseFloat(data[0].lon)] as [number, number]
  }
  return null
}

export default function TravelModeMap({ initialView = "summary", onBack, onOpenMap, onOpenGyms }: TravelModeMapProps) {
  const [startQuery, setStartQuery] = useState("")
  const [destQuery, setDestQuery] = useState("")
  const [startCoord, setStartCoord] = useState<[number, number] | null>(null)
  const [destCoord, setDestCoord] = useState<[number, number] | null>(null)
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([])
  const [gyms, setGyms] = useState<Gym[]>(fallbackGyms)
  const [routeGyms, setRouteGyms] = useState<Gym[]>([])
  const [selectedGym, setSelectedGym] = useState<Gym | null>(null)
  const [status, setStatus] = useState<string>("Ready to route")
  const [busy, setBusy] = useState(false)
  const [viewMode, setViewMode] = useState<"summary" | "map" | "gyms">(initialView)

  const startIcon = useMemo(() => L.divIcon({
    className: "bg-transparent",
    html: `<div class="w-8 h-8 -ml-4 -mt-4 relative flex items-center justify-center">
      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
      <span class="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-white shadow-sm"></span>
    </div>`
  }), [])

  const destIcon = useMemo(() => L.divIcon({
    className: "bg-transparent",
    html: `<div class="w-8 h-8 -ml-4 -mt-4 relative flex items-center justify-center">
      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
      <span class="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white shadow-sm"></span>
    </div>`
  }), [])

  const gymIcon = useMemo(() => L.divIcon({
    className: "bg-transparent",
    html: `<div class="w-6 h-6 -ml-3 -mt-3 relative flex items-center justify-center">
      <span class="relative inline-flex rounded-full h-3 w-3 bg-blue-500 border-2 border-white shadow-sm"></span>
    </div>`
  }), [])

  useEffect(() => {
    const fetchGyms = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/gyms`)
        if (!res.ok) throw new Error("Failed to fetch gyms")
        const data = await res.json()
        if (Array.isArray(data) && data.length) {
          setGyms(
            data.map((g: any, idx: number) => ({
              id: g.id ?? `db-${idx}`,
              name: g.name ?? "Unnamed Gym",
              lat: g.lat,
              lng: g.lng,
              rating: g.rating,
              address: g.address,
              trainer: g.trainer ?? "On-duty trainer",
              phone: g.phone ?? "+91 99999 99999",
            }))
          )
        }
      } catch (err) {
        console.error(err)
      }
    }
    fetchGyms()
  }, [])

  useEffect(() => {
    if (!routeCoords.length) return
    setRouteGyms(gymsAlongRoute(gyms, routeCoords))
  }, [routeCoords, gyms])

  const totalDistanceKm = useMemo(() => {
    if (routeCoords.length < 2) return 0
    let sum = 0
    for (let i = 0; i < routeCoords.length - 1; i++) {
      sum += haversineMeters(routeCoords[i], routeCoords[i + 1])
    }
    return sum / 1000
  }, [routeCoords])

  const handleLocate = () => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc: [number, number] = [pos.coords.latitude, pos.coords.longitude]
        setStartCoord(loc)
        setStatus("Using your location as start")
      },
      () => setStatus("Location blocked. Using default start."),
      { enableHighAccuracy: true, timeout: 5000 }
    )
  }

/* Logic: Using OSRM for real road routing */
  const buildRoute = useCallback(async () => {
    if (!startQuery || !destQuery) return
    setBusy(true)
    setStatus("Geocoding locations…")
    
    // Clear previous route data immediately to show fresh search
    setRouteCoords([])
    setRouteGyms([])

    // Force re-geocode unless coordinates were explicitly set (e.g. by geolocation or recenter)
    // If coords exist, we trust them only if user hasn't edited the text recently.
    // However, simplest fix is: We prioritize the text query if the user edited it.
    // The current state management has startCoord sticking around.
    
    // Better logic: Always geocode fresh from the query string unless startCoord perfectly matches what we think it is.
    // But since we can't enhance the state easily here, we will just geocode every time. This is safer.
    // Or we rely on the onChange handlers we will add.

    // Let's rely on the strategy where we check if we have coords, BUT we cleared them on input change.
    // So if startCoord is present here, it means it's valid.

    const [startRes, destRes] = await Promise.all([
      startCoord ? Promise.resolve(startCoord) : geocodeLocation(startQuery),
      destCoord ? Promise.resolve(destCoord) : geocodeLocation(destQuery),
    ])

    const startPoint = startRes || (await geocodeLocation(startQuery))
    const destPoint = destRes || (await geocodeLocation(destQuery))

    if (!startPoint || !destPoint) {
      setStatus("Could not find one of the locations")
      setBusy(false)
      return
    }

    setStartCoord(startPoint)
    setDestCoord(destPoint)

    setStatus("Fetching driving route from OSRM…")
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${startPoint[1]},${startPoint[0]};${destPoint[1]},${destPoint[0]}?overview=full&geometries=geojson`
      const res = await fetch(url)
      const data = await res.json()
      
      if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
        // OSRM returns [lon, lat], we need [lat, lon] for Leaflet
        const coords = data.routes[0].geometry.coordinates.map((c: number[]) => [c[1], c[0]] as [number, number])
        setRouteCoords(coords)
        setStatus("Route ready. Gyms filtered to road path.")
      } else {
         setStatus("No road route found. Using straight line.")
         setRouteCoords([startPoint, destPoint])
      }
    } catch (e) {
      console.error(e)
      setStatus("Routing failed. Using straight line.")
      setRouteCoords([startPoint, destPoint])
    }
    
    setSelectedGym(null)
    setBusy(false)
  }, [startQuery, destQuery, startCoord, destCoord])

  const swapPoints = () => {
    setStartCoord(destCoord)
    setDestCoord(startCoord)
    setStartQuery(destQuery)
    setDestQuery(startQuery)
  }

  const center = routeCoords[0] || startCoord || destCoord || defaultStart

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden rounded-sm border border-border bg-card">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(78,70,229,0.08),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(16,185,129,0.08),transparent_35%)]" />

      {/* Top controls / summary */}
      {viewMode === "summary" && (
      <div className="relative z-[1200] space-y-3 p-4 md:p-6">
        <div className="flex flex-col gap-3 rounded-sm border border-border/60 bg-background/95 p-4 backdrop-blur-md shadow-xl">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-sm bg-primary/10 text-primary">
                <Route className="h-5 w-5" />
              </span>
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Travel Mode</p>
                <p className="text-sm font-semibold text-foreground">Gyms along your route</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Sparkles className="h-4 w-4 text-primary" /> Smart Road Routing
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-[1.1fr,1.1fr,auto,auto] md:items-center">
            <label className="flex items-center gap-2 rounded-sm border border-border/60 bg-card px-3 py-2 text-xs text-muted-foreground shadow-sm">
              <MapPin className="h-4 w-4 text-primary" />
              <input
                value={startQuery}
                onChange={(e) => {
                  setStartQuery(e.target.value)
                  setStartCoord(null)
                  setRouteCoords([])
                }}
                className="w-full bg-transparent text-sm text-foreground outline-none"
                placeholder="Starting point"
              />
            </label>
            <label className="flex items-center gap-2 rounded-sm border border-border/60 bg-card px-3 py-2 text-xs text-muted-foreground shadow-sm">
              <Navigation className="h-4 w-4 text-primary" />
              <input
                value={destQuery}
                onChange={(e) => {
                  setDestQuery(e.target.value)
                  setDestCoord(null)
                  setRouteCoords([])
                }}
                className="w-full bg-transparent text-sm text-foreground outline-none"
                placeholder="Destination"
              />
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={swapPoints}
                className="flex items-center gap-2 rounded-sm border border-border/70 px-3 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground bg-card shadow-sm"
              >
                <Shuffle className="h-4 w-4" />
                Swap
              </button>
              <button
                onClick={handleLocate}
                className="flex items-center gap-2 rounded-sm border border-border/70 px-3 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground bg-card shadow-sm"
              >
                <LocateFixed className="h-4 w-4" />
                Nearby
              </button>
            </div>
            <div className="flex items-center justify-end gap-3">
              <div className="text-right">
                <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Distance</p>
                <p className="text-sm font-semibold text-foreground">{totalDistanceKm.toFixed(2)} km</p>
              </div>
              <button
                disabled={busy}
                onClick={buildRoute}
                className="flex items-center gap-2 rounded-sm bg-primary px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-primary-foreground transition-all hover:shadow-[0_0_25px_oklch(0.65_0.25_25/0.3)] disabled:cursor-not-allowed disabled:opacity-70"
              >
                <Navigation className="h-4 w-4" />
                {busy ? "Routing" : "Build Route"}
              </button>
            </div>
          </div>

          <div className="grid gap-2 md:grid-cols-[1fr,1fr,1fr]">
            <div className="flex items-center justify-between rounded-sm border border-border/60 bg-secondary/30 px-3 py-2 text-xs text-muted-foreground">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Status</p>
                <p className="text-sm font-semibold text-foreground">{status}</p>
              </div>
              <Clock className="h-4 w-4 text-primary" />
            </div>
            <div className="flex items-center gap-2 rounded-sm border border-border/60 bg-secondary/30 px-3 py-2 text-xs text-muted-foreground">
              <ListChecks className="h-4 w-4 text-primary" />
              <span>{routeGyms.length} gyms on this route</span>
            </div>
            <div className="flex items-center gap-2 rounded-sm border border-border/60 bg-secondary/30 px-3 py-2 text-xs text-muted-foreground">
              <BadgeCheck className="h-4 w-4 text-primary" />
              <span>Pin & call a stop</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 rounded-sm border border-border/60 bg-background/95 p-2 shadow-md">
          <button
            onClick={() => (onOpenMap ? onOpenMap() : setViewMode("map"))}
            className="flex-1 rounded-sm bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground transition-all hover:shadow-[0_0_22px_oklch(0.65_0.25_25/0.25)]"
          >
            Open Map View
          </button>
          <button
            onClick={() => (onOpenGyms ? onOpenGyms() : setViewMode("gyms"))}
            className="flex-1 rounded-sm bg-card px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground transition-all hover:text-foreground hover:shadow-[0_0_12px_oklch(0.65_0.25_25/0.15)]"
          >
            Open Gyms List
          </button>
        </div>
      </div>
      )}

      {/* Main content sections */}
      <div className="relative z-[1000] flex-1 overflow-hidden px-4 pb-4 md:px-6 md:pb-6">
        {viewMode === "summary" && (
          <div className="flex h-full items-center justify-center rounded-sm border border-border bg-card/60 text-muted-foreground">
            <p className="text-sm">Pick Map View or Gyms List to continue.</p>
          </div>
        )}

        {viewMode === "map" && (
          <div className="flex h-full flex-col overflow-hidden rounded-sm border border-border bg-card shadow-inner">
            <div className="absolute left-4 top-4 z-[500] flex gap-2">
              <button
                onClick={() => (onBack ? onBack() : setViewMode("summary"))}
                className="rounded-sm bg-background/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-foreground shadow-md backdrop-blur-md transition-all hover:bg-background"
              >
                Back
              </button>
            </div>
            
            <div className="flex-1 overflow-hidden">
              <MapContainer center={center as [number, number]} zoom={13} style={{ height: "100%", width: "100%" }} zoomControl={false}>
                <Recenter
                  target={selectedGym ? [selectedGym.lat, selectedGym.lng] : routeCoords[0] || startCoord || destCoord || defaultStart}
                />
                <TileLayer
                  attribution="&copy; OpenStreetMap"
                  url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />

                {startCoord && (
                  <Marker position={startCoord} icon={startIcon}>
                    <Popup>Start</Popup>
                  </Marker>
                )}

                {destCoord && (
                  <Marker position={destCoord} icon={destIcon}>
                    <Popup>Destination</Popup>
                  </Marker>
                )}

                {routeCoords.length > 1 && (
                  <>
                    <Polyline positions={routeCoords} color="#3b82f6" weight={6} opacity={0.9} />
                  </>
                )}

                {routeGyms.map((gym) => (
                  <Marker key={gym.id} position={[gym.lat, gym.lng]} icon={gymIcon}>

                    <Popup>
                      <div className="space-y-1 text-black">
                        <p className="text-sm font-semibold">{gym.name}</p>
                        {gym.address && <p className="text-xs text-slate-600">{gym.address}</p>}
                        <p className="text-xs">Trainer: {gym.trainer ?? "On duty"}</p>
                        <a href={`tel:${gym.phone ?? ""}`} className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-blue-600">
                          <Phone className="h-3 w-3" /> Call
                        </a>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>
        )}

        {viewMode === "gyms" && (
          <div className="flex h-full flex-col rounded-sm border border-border bg-card shadow-inner">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => (onBack ? onBack() : setViewMode("summary"))}
                  className="rounded-sm border border-border/70 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                >
                  Back
                </button>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">Gyms List</p>
                  <p className="text-sm font-semibold text-foreground">Tap a stop to pin on map</p>
                </div>
              </div>
              <Dumbbell className="h-5 w-5 text-primary" />
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {routeGyms.length === 0 && (
                <div className="rounded-sm border border-border/70 bg-secondary/30 p-4 text-sm text-muted-foreground">
                  Build a route to see gyms along the corridor.
                </div>
              )}

              {routeGyms.map((gym) => (
                <button
                  key={gym.id}
                  onClick={() => { setSelectedGym(gym); setViewMode("map") }}
                  className={`w-full rounded-sm border px-4 py-3 text-left transition-all hover:border-primary/40 hover:shadow-md ${
                    selectedGym?.id === gym.id ? "border-primary/60 bg-primary/5" : "border-border bg-card"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="max-w-[70%]">
                      <p className="truncate text-sm font-semibold text-foreground">{gym.name}</p>
                      <p className="text-xs text-muted-foreground">Trainer: {gym.trainer ?? "Available"}</p>
                    </div>
                    {gym.rating && (
                      <span className="rounded-sm bg-secondary px-2 py-1 text-[10px] font-semibold text-muted-foreground">{gym.rating.toFixed(1)}</span>
                    )}
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-3 text-xs text-muted-foreground">
                    <span className="line-clamp-2 text-left">
                      {gym.address ?? "Address coming soon"}
                    </span>
                    <a href={`tel:${gym.phone ?? ""}`} className="inline-flex items-center gap-1 text-primary">
                      <Phone className="h-3 w-3" /> Call
                    </a>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
