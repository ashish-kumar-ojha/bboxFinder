import { useEffect, useState } from 'react'
import { toast, Toaster } from 'react-hot-toast'
import type maplibregl from 'maplibre-gl'

import { mapController } from '../map/MapController'
import { onSuccessSound } from '../utils/feedback_sounds'

interface Coordinates {
  lat: number
  lng: number
}

const HoverCoordinates = () => {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null)
  const [isCopying, setIsCopying] = useState(false)

  const handleCoordinateCopy = async () => {
    if (!coordinates) return

    const coordString = `${coordinates.lat},${coordinates.lng}`

    try {
      setIsCopying(true)
      await navigator.clipboard.writeText(coordString)
      toast.success('Copied!', { duration: 2000 })
      onSuccessSound()
    } catch {
      toast.error('Failed to copy')
    } finally {
      setTimeout(() => setIsCopying(false), 300)
    }
  }

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
      <div
        className={`absolute bottom-4 left-4 cursor-pointer select-none rounded-lg backdrop-blur-sm transition-all duration-300 ${
          isCopying ? 'scale-95 bg-green-500/80 shadow-lg' : 'bg-black/40 shadow-md hover:bg-black/60 hover:shadow-lg'
        }`}
        onClick={handleCoordinateCopy}
        role="button"
        tabIndex={0}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleCoordinateCopy()
          }
        }}
      >
        <div className="px-3 py-2.5">
          {coordinates ? (
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-white/90">
                <span>{coordinates.lat}</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-white/90">
                <span>{coordinates.lng}</span>
              </div>
              <div className="mt-2 border-t border-white/20 pt-1.5 text-[10px] text-white/60">Click to copy</div>
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
