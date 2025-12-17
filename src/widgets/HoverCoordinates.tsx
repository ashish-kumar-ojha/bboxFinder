import { useEffect, useState } from 'react'
import { toast, Toaster } from 'react-hot-toast'
import type maplibregl from 'maplibre-gl'

import { mapController } from '../map/MapController'
import { onSuccessSound } from '../utils/feedback_sounds'

const HoverCoordinates = () => {
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null)

  const handleCoordinateCopy = () => {
    if (!coordinates) return
    navigator.clipboard.writeText(`${coordinates.lat},${coordinates.lng}`)
    toast.success('Coordinates copied to clipboard')
    onSuccessSound()
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
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      if (map && handleMove) {
        map.off('mousemove', handleMove)
      }
    }
  }, [])

  return (
    <div
      className="absolute bottom-2 left-2 px-2 py-3 flex-col bg-bg rounded-md text-[12px] shadow-md flex cursor-pointer"
      onClick={handleCoordinateCopy}
    >
      {coordinates ? (
        <>
          <div>Lat: {coordinates.lat}</div>
          <div>Lng: {coordinates.lng}</div>
        </>
      ) : (
        'Move cursor...'
      )}
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  )
}

export default HoverCoordinates
