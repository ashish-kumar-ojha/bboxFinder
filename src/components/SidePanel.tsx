import { useState } from 'react'
import { useTheme } from '../hooks/useTheme'


export type Basemap = 'street' | 'satellite'
export type DrawingTool = 'rectangle' | 'square'

interface SidePanelProps {
  basemap: Basemap
  onBasemapChange: (basemap: Basemap) => void
  drawingTool: DrawingTool
  onDrawingToolChange: (tool: DrawingTool) => void
}

const SidePanel = ({ basemap, onBasemapChange, drawingTool, onDrawingToolChange }: SidePanelProps) => {
  const [hoveredBasemap, setHoveredBasemap] = useState(false)
  const [hoveredTool, setHoveredTool] = useState(false)
  const { theme, toggleTheme } = useTheme()


  return (
    <div className="maplibregl-ctrl maplibregl-ctrl-group absolute top-2.5 left-2.5 z-10">
      {/* Basemap Selector */}
      <div
        className="relative"
        onMouseEnter={() => setHoveredBasemap(true)}
        onMouseLeave={() => setHoveredBasemap(false)}
      >
        <button
          className=" w-9 h-9 bg-surface border-0 rounded-sm flex items-center justify-center hover:bg-bg transition-colors cursor-pointer text-text"
          aria-label="Basemap"
          type="button"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        </button>
        
        {hoveredBasemap && (
          <div className="absolute left-0 top-0 mt-9 w-32 bg-surface border border-border rounded-sm shadow-lg overflow-hidden text-text">
            <button
              onClick={() => {
                onBasemapChange('street')
                setHoveredBasemap(false)
              }}
              className={`w-full px-3 py-2 text-left text-xs hover:bg-bg transition-colors ${
                basemap === 'street' ? 'bg-primary/10 text-primary' : ''
              }`}
              type="button"
            >
              Street
            </button>
            <button
              onClick={() => {
                onBasemapChange('satellite')
                setHoveredBasemap(false)
              }}
              className={`w-full px-3 py-2 text-left text-xs hover:bg-bg transition-colors border-t border-border ${
                basemap === 'satellite' ? 'bg-primary/10 text-primary' : ''
              }`}
              type="button"
            >
              Satellite
            </button>
          </div>
        )}
      </div>

      {/* Drawing Tool Selector */}
      <div
        className="relative border-t border-border"
        onMouseEnter={() => setHoveredTool(true)}
        onMouseLeave={() => setHoveredTool(false)}
      >
        <button
          className="maplibregl-ctrl-icon w-9 h-9 bg-surface border-0 rounded-sm flex items-center justify-center hover:bg-bg transition-colors cursor-pointer text-text"
          aria-label="Drawing Tool"
          type="button"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
        
        {hoveredTool && (
          <div className="absolute left-0 top-0 mt-9 w-32 bg-surface border border-border rounded-sm shadow-lg overflow-hidden text-text">
            <button
              onClick={() => {
                onDrawingToolChange('rectangle')
                setHoveredTool(false)
              }}
              className={`w-full px-3 py-2 text-left text-xs hover:bg-bg transition-colors ${
                drawingTool === 'rectangle' ? 'bg-primary/10 text-primary' : ''
              }`}
              type="button"
            >
              Rectangle
            </button>
            <button
              onClick={() => {
                onDrawingToolChange('square')
                setHoveredTool(false)
              }}
              className={`w-full px-3 py-2 text-left text-xs hover:bg-bg transition-colors border-t border-border ${
                drawingTool === 'square' ? 'bg-primary/10 text-primary' : ''
              }`}
              type="button"
            >
              Square
            </button>
          </div>
        )}
      </div>

      {/* Theme Toggle */}
      <div className="relative border-t border-border">
        <button
          onClick={toggleTheme}
          className="maplibregl-ctrl-icon w-9 h-9 bg-surface border-0 rounded-sm flex items-center justify-center hover:bg-bg transition-colors cursor-pointer text-text"
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          type="button"
        >
          {theme === 'light' ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  )
}

export default SidePanel

