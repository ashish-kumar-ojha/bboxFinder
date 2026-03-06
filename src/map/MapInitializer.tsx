// src/map/MapInitializer.tsx
import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import {
  TerraDraw,
  TerraDrawPointMode,
  TerraDrawPolygonMode,
  TerraDrawRectangleMode,
  TerraDrawSelectMode,
} from 'terra-draw'
import { TerraDrawMapLibreGLAdapter } from 'terra-draw-maplibre-gl-adapter'

import { mapController } from './MapController'

const DEFAULT_CENTER: [number, number] = [0, 0]
const DEFAULT_ZOOM = 4

export function createTerraDraw(map: maplibregl.Map) {
  const draw = new TerraDraw({
    adapter: new TerraDrawMapLibreGLAdapter({ map }),
    modes: [
      new TerraDrawPolygonMode({
        modeName: 'polygon',
        styles: {
          fillColor: '#4357AD',
          fillOpacity: 0.5,
          outlineColor: '#3f5fbd',
          outlineWidth: 2,
          closingPointColor: '#ff0000',
          closingPointOutlineColor: '#ffffff',
          closingPointOutlineWidth: 2,
          closingPointWidth: 8,
        },
      }),
      new TerraDrawRectangleMode({
        modeName: 'rectangle',
      }),
      new TerraDrawPointMode({
        modeName: 'point',
      }),
      new TerraDrawSelectMode({
        modeName: 'select',
      }),
    ],
  })

  draw.start()
  return draw
}

const MapInitializer = () => {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: 'https://api.maptiler.com/maps/streets-v4/style.json?key=f0yZJGx23tgPHGNq8DQf',
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      renderWorldCopies: false,
    })

    map.on('load', () => {
      // Set the map and draw instances to the controller
      mapController.setMap(map)
      const draw = createTerraDraw(map)
      mapController.setDraw(draw)

      // Add scale bar and navigation at bottom-right (scale at bottom, nav above)
      map.addControl(new maplibregl.ScaleControl({ maxWidth: 100, unit: 'metric' }), 'bottom-right')
      map.addControl(new maplibregl.NavigationControl(), 'bottom-right')
    })

    return () => {
      map.remove()
      mapController.clear()
    }
  }, [])

  return <div ref={containerRef} className="w-full h-full" data-map-container />
}

export default MapInitializer
