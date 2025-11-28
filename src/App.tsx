import { useState } from 'react'
import MapView, { type BBox } from './components/MapView'
import SidePanel, { type Basemap, type DrawingTool } from './components/SidePanel'
import RightPanel from './components/RightPanel'

const App = () => {
  const [bbox, setBBox] = useState<BBox | null>(null)
  const [basemap, setBasemap] = useState<Basemap>('street')
  const [drawingTool, setDrawingTool] = useState<DrawingTool>('rectangle')

  return (
    <div className="w-screen h-screen flex flex-col bg-bg text-(--color-text)">
    
      <main className="flex-1 flex min-h-0 relative">
        <RightPanel bbox={bbox} />
        <div className="flex-1 min-w-0">
          <MapView 
            bbox={bbox} 
            onChangeBBox={setBBox} 
            basemap={basemap}
            drawingTool={drawingTool}
          />
        </div>
        <SidePanel
          basemap={basemap}
          onBasemapChange={setBasemap}
          drawingTool={drawingTool}
          onDrawingToolChange={setDrawingTool}
        />
      </main>
    </div>
  )
}

export default App