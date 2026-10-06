"use client"

import dynamic from 'next/dynamic'

// Dynamically import the Leaflet map component with ssr disabled
// This is required because React-Leaflet accesses the `window` object during initialization
const MapWithNoSSR = dynamic(() => import('./leaflet-map'), {
    ssr: false,
    loading: () => (
        <div className="flex h-full w-full items-center justify-center bg-card">
            <div className="flex flex-col items-center gap-4">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Initializing OpenStreetMap...</p>
            </div>
        </div>
    )
})

export function GymMap() {
    return <MapWithNoSSR />
}

