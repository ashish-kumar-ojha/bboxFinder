import MapInitializer from './map/MapInitializer'
import LeftSidebar from './components/LeftSidebar'
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
    <div className="w-screen h-screen flex flex-col bg-bg text-text overflow-hidden">
      <main className="flex-1 flex min-h-0 relative overflow-hidden">
        <div className="flex-1 min-w-0 min-h-0 relative overflow-hidden">
          <GeocodingSearch onLocationSelect={handleLocationSelect} />
          <div className="absolute inset-0">
            <MapInitializer />
            <HoverCoordinates />
            <MapContextMenu />
          </div>
        </div>
        <LeftSidebar />
      </main>
    </div>
  )
}

export default App
