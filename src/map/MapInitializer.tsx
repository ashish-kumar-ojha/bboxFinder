// src/map/MapInitializer.tsx
import { useEffect, useRef } from "react"
import maplibregl from "maplibre-gl"
import { mapController } from "./MapController"
import { TerraDraw, TerraDrawPointMode, TerraDrawPolygonMode, TerraDrawRectangleMode, TerraDrawSelectMode } from "terra-draw";
import { TerraDrawMapLibreGLAdapter } from "terra-draw-maplibre-gl-adapter";


const DEFAULT_CENTER: [number, number] = [0, 0]
const DEFAULT_ZOOM = 4

export function createTerraDraw(map: maplibregl.Map) {
  const draw = new TerraDraw({
    adapter: new TerraDrawMapLibreGLAdapter({ map }),
    modes: [
      new TerraDrawPolygonMode({
        modeName: "polygon",
      }),
      new TerraDrawRectangleMode({
        modeName: "rectangle",
      }),
      new TerraDrawPointMode({
        modeName: "point",
      }),
      new TerraDrawSelectMode({
        modeName: "select",
      }),
    ],
  });

  draw.start();
  return draw;
}

const MapInitializer = () => {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: "https://api.maptiler.com/maps/streets-v4/style.json?key=f0yZJGx23tgPHGNq8DQf",
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      renderWorldCopies:false
    })


    map.on("load", () => {
      // Set the map and draw instances to the controller
      mapController.setMap(map)
      const draw = createTerraDraw(map)
      mapController.setDraw(draw)

      // Add the navigation control
      map.addControl(new maplibregl.NavigationControl(), "bottom-right")
    })


    return () => {
      map.remove()
      mapController.clear()
    }
  }, [])

  return <div ref={containerRef} className="w-full h-full" />
}

export default MapInitializer
