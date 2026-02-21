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
      <div className="absolute bottom-4 left-4 select-none rounded-lg backdrop-blur-sm bg-black/40 shadow-md">
        <div className="px-3 py-2.5">
          {coordinates ? (
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-white/90">
                <span>{coordinates.lat}</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-white/90">
                <span>{coordinates.lng}</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-white/70 animate-pulse">
              <span>Move cursor...</span>
            </div>
          )}
        </div>
      </div>
      <Toaster position="top-right" reverseOrder={false} />
    </>
  )
}

export default HoverCoordinates
