import MapInitializer from "./map/MapInitializer"
import SidePanel from './components/SidePanel'
import RightPanel from './components/RightPanel'
import GeocodingSearch from './components/GeocodingSearch'
import { useState } from 'react'
import { mapController } from './map/MapController'
import type { Basemap, DrawingTool } from './components/SidePanel'

const App = () => {
  const [basemap, setBasemap] = useState<Basemap>('street')
  const [drawingTool, setDrawingTool] = useState<DrawingTool>('rectangle')

  const handleLocationSelect = (lat: number, lng: number) => {
    const map = mapController.getMap()
    if (map) {
      map.flyTo({
        center: [lng, lat],
        zoom: 12,
        duration: 1000,
      })
    }
  }

  return (
    <div className="w-screen h-screen flex flex-col bg-bg text-(--color-text)">
      <main className="flex-1 flex min-h-0 relative">
        <SidePanel
          basemap={basemap}
          onBasemapChange={setBasemap}
          drawingTool={drawingTool}
          onDrawingToolChange={setDrawingTool}
        />
        <div className="flex-1 min-w-0 relative">
          <GeocodingSearch onLocationSelect={handleLocationSelect} />
          <div style={{ width: "100vw", height: "100vh" }}>
            <MapInitializer />
          </div>
        </div>
        <RightPanel />
      </main>
    </div>
  )
}

export default App
