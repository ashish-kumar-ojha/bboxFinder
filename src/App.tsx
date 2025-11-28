import { useState } from 'react'
import MapView, { type BBox } from './components/MapView'

const App = () => {
  const [bbox, setBBox] = useState<BBox | null>(null)

  return (
    <div className="w-screen h-screen flex flex-col bg-neutral-50">
      <header className="px-4 py-2 border-b bg-white flex items-center justify-between">
        {/* <div>
          <h1 className="text-base font-semibold">BBox Finder</h1>
          <p className="text-[11px] text-neutral-500">Utility to define bounding boxes using MapLibre.</p>
        </div> */}
      </header>
      <main className="flex-1 flex min-h-0">
        <div className="flex-1 min-w-0">
          <MapView bbox={bbox} onChangeBBox={setBBox} />
        </div>
      </main>
    </div>
  )
}

export default App