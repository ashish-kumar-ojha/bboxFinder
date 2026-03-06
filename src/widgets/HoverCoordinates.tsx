import { useEffect, useState } from 'react'
import { Toaster } from 'react-hot-toast'
import type maplibregl from 'maplibre-gl'

import { mapController } from '../map/MapController'

interface Coordinates {
  lat: number
  lng: number
}

const HoverCoordinates = () => {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null)

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null
    let map: maplibregl.Map | null = null
    let handleMove: ((e: maplibregl.MapMouseEvent) => void) | null = null

    const setupMapListener = () => {
      map = mapController.getMap()

      if (!map) {
        // Map not ready yet, retry
        timeoutId = setTimeout(setupMapListener, 100)
        return
      }

      handleMove = (e: maplibregl.MapMouseEvent) => {
        setCoordinates({
          lat: Number(e.lngLat.lat.toFixed(6)),
          lng: Number(e.lngLat.lng.toFixed(6)),
        })
      }

      map.on('mousemove', handleMove)
    }

    setupMapListener()

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
      if (map && handleMove) map.off('mousemove', handleMove)
    }
  }, [])

  return (
    <>
      <div className="absolute bottom-2 right-2 z-[1000] select-none rounded-md backdrop-blur-sm bg-black/40 shadow-md px-3 py-1.5 pointer-events-none">
        {coordinates ? (
          <span className="text-xs font-medium text-white/90 tabular-nums">
            {coordinates.lat}, {coordinates.lng}
          </span>
        ) : (
          <span className="text-xs text-white/70 animate-pulse">Move cursor…</span>
        )}
      </div>
      <Toaster position="top-right" reverseOrder={false} />
    </>
  )
}

export default HoverCoordinates
