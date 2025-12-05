import { useEffect, useRef } from 'react'
import { Map } from 'maplibre-gl'
import type { DrawingTool } from '../components/SidePanel'
import { useMapStore } from '../store/mapStore'

export const useMapDrawing = (
  mapRef: React.RefObject<Map | null>,
  drawingTool: DrawingTool
) => {
  const clickStateRef = useRef<{ firstPoint: [number, number] | null }>({ firstPoint: null })
  const drawingToolRef = useRef<DrawingTool>(drawingTool)
  const setBBox = useMapStore((state) => state.setBBox)

  // Update ref when drawingTool changes and reset click state
  useEffect(() => {
    drawingToolRef.current = drawingTool
    clickStateRef.current = { firstPoint: null }
  }, [drawingTool])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    const handleClick = (e: any) => {
      const lngLat = e.lngLat
      const current = clickStateRef.current

      if (!current.firstPoint) {
        clickStateRef.current = { firstPoint: [lngLat.lng, lngLat.lat] }
      } else {
        const [lng1, lat1] = current.firstPoint
        const lng2 = lngLat.lng
        const lat2 = lngLat.lat

        let minLng = Math.min(lng1, lng2)
        let maxLng = Math.max(lng1, lng2)
        let minLat = Math.min(lat1, lat2)
        let maxLat = Math.max(lat1, lat2)

        // For square tool, enforce equal dimensions
        if (drawingToolRef.current === 'square') {
          const lngDiff = maxLng - minLng
          const latDiff = maxLat - minLat
          const maxDiff = Math.max(lngDiff, latDiff)
          
          // Center the square on the first point
          const centerLng = (lng1 + lng2) / 2
          const centerLat = (lat1 + lat2) / 2
          
          minLng = centerLng - maxDiff / 2
          maxLng = centerLng + maxDiff / 2
          minLat = centerLat - maxDiff / 2
          maxLat = centerLat + maxDiff / 2
        }

        clickStateRef.current = { firstPoint: null }
        setBBox({ minLat, minLng, maxLat, maxLng })
      }
    }

    map.on('click', handleClick)

    return () => {
      map.off('click', handleClick)
    }
  }, [mapRef, setBBox])
}

