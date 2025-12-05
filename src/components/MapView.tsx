import { useRef } from 'react'
import { useMapStore } from '../store/mapStore'
import { useMapInstance } from '../hooks/useMapInstance'
import { useMapBasemap } from '../hooks/useMapBasemap'
import { useMapDrawing } from '../hooks/useMapDrawing'
import { useMapBBox } from '../hooks/useMapBBox'
import { useMapNavigation } from '../hooks/useMapNavigation'

// Re-export BBox type for backward compatibility
export type { BBox } from '../store/mapStore'

const MapView = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  
  // Get state from Zustand store
  const bbox = useMapStore((state) => state.bbox)
  const basemap = useMapStore((state) => state.basemap)
  const drawingTool = useMapStore((state) => state.drawingTool)
  const center = useMapStore((state) => state.center)
  const zoom = useMapStore((state) => state.zoom)

  // Initialize map instance
  const mapRef = useMapInstance(mapContainerRef, basemap, center, zoom)
  
  // Use custom hooks for different map functionalities
  useMapBasemap(mapRef, basemap, bbox)
  useMapDrawing(mapRef, drawingTool)
  useMapBBox(mapRef, bbox)
  useMapNavigation(mapRef, center, zoom)

  return (
    <div className="w-full h-full" ref={mapContainerRef} />
  )
}

export default MapView
