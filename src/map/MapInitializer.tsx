// src/map/MapInitializer.tsx
import { useEffect, useRef } from "react"
import maplibregl from "maplibre-gl"
import { mapController } from "./MapController"




const DEFAULT_CENTER: [number, number] = [0, 0]
const DEFAULT_ZOOM = 2

const MapInitializer = () => {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: "https://demotiles.maplibre.org/style.json",
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
    })

    // Store instance globally
    mapController.setMap(map)

    map.addControl(new maplibregl.NavigationControl(), "bottom-right")

    return () => {
      map.remove()
      mapController.clear()
    }
  }, [])

  return <div ref={containerRef} className="w-full h-full" />
}

export default MapInitializer
