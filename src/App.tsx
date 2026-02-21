import MapInitializer from './map/MapInitializer'
import SidePanel from './components/SidePanel'
import GeocodingSearch from './components/GeocodingSearch'
import MapContextMenu from './components/MapContextMenu'
import { mapController } from './map/MapController'
import HoverCoordinates from './widgets/HoverCoordinates'

const App = () => {
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
        <SidePanel />
        <div className="flex-1 min-w-0 relative">
          <GeocodingSearch onLocationSelect={handleLocationSelect} />
          <div style={{ width: '100vw', height: '100vh' }}>
            <MapInitializer />
            <HoverCoordinates />
            <MapContextMenu />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
