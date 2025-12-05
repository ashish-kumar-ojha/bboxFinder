import MapView from './components/MapView'
import SidePanel from './components/SidePanel'
import RightPanel from './components/RightPanel'
import GeocodingSearch from './components/GeocodingSearch'
import { useMapStore } from './store/mapStore'

const App = () => {
  const setBasemap = useMapStore((state) => state.setBasemap)
  const setDrawingTool = useMapStore((state) => state.setDrawingTool)
  const setCenter = useMapStore((state) => state.setCenter)
  const setZoom = useMapStore((state) => state.setZoom)
  const basemap = useMapStore((state) => state.basemap)
  const drawingTool = useMapStore((state) => state.drawingTool)

  const handleLocationSelect = (lat: number, lng: number) => {
    setCenter([lng, lat])
    setZoom(12)
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
          <MapView />
        </div>
        <RightPanel />
      </main>
    </div>
  )
}

export default App
