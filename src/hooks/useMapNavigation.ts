import { useEffect } from 'react'
import { Map } from 'maplibre-gl'

export const useMapNavigation = (
  mapRef: React.RefObject<Map | null>,
  center?: [number, number],
  zoom?: number
) => {
  useEffect(() => {
    const map = mapRef.current
    if (!map || !center) return

    map.flyTo({
      center: center,
      zoom: zoom || 12,
      duration: 1000,
    })
  }, [mapRef, center, zoom])
}

