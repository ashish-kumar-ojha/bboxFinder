import { useState } from 'react'
import type { BBox } from './MapView'

interface RightPanelProps {
  bbox: BBox | null
}

const MIN_WIDTH = 0
const DEFAULT_WIDTH = 300

const RightPanel = ({ bbox }: RightPanelProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed)
  }

  const currentWidth = isCollapsed ? MIN_WIDTH : DEFAULT_WIDTH

  return (
    <div className="relative h-full">
      {/* Toggle Button - appears when collapsed */}
      {isCollapsed && (
        <button
          onClick={handleToggle}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-16 bg-surface border border-r border-border rounded-r-lg shadow-lg flex items-center justify-center hover:bg-bg transition-colors"
          aria-label="Open panel"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Panel */}
      <div
        className="h-full bg-surface border-r border-border flex flex-col transition-all duration-200 relative"
        style={{ width: `${currentWidth}px` }}
      >
        {/* Panel Content */}
        {!isCollapsed && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">

              <div className='flex flex-row justify-center items-center'>
                  <img src="/bbox-finder-logo.svg" alt="" className='w-5 inline' />
                  <h1 className='p-0'>Bbox Finder</h1>
              </div>
              <button
                onClick={handleToggle}
                className="p-1 rounded hover:bg-bg transition-colors"
                aria-label="Collapse panel"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {bbox ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex flex-col gap-1">
                      <label className="font-medium text-xs text-(--color-text-muted)">Min Lat</label>
                      <div className="px-3 py-2 bg-bg rounded border boder-border">
                        {bbox.minLat.toFixed(6)}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-medium text-xs text-(--color-text-muted)">Min Lng</label>
                      <div className="px-3 py-2 bg-bg rounded border boder-border">
                        {bbox.minLng.toFixed(6)}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-medium text-xs text-(--color-text-muted)">Max Lat</label>
                      <div className="px-3 py-2 bg-bg rounded border boder-border">
                        {bbox.maxLat.toFixed(6)}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-medium text-xs text-(--color-text-muted)">Max Lng</label>
                      <div className="px-3 py-2 bg-bg rounded border boder-border">
                        {bbox.maxLng.toFixed(6)}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Array Format</span>
                      <button
                        onClick={async () => {
                          if (!bbox) return
                          const array = [bbox.minLng, bbox.minLat, bbox.maxLng, bbox.maxLat]
                          const text = JSON.stringify(array)
                          try {
                            await navigator.clipboard.writeText(text)
                          } catch {
                            // ignore clipboard errors
                          }
                        }}
                        className="px-3 py-1 text-xs border boder-border rounded hover:bg-bg transition-colors"
                      >
                        Copy
                      </button>
                    </div>
                    <code className="block text-xs bg-bg rounded p-2 border boder-border break-all">
                      {JSON.stringify([bbox.minLng, bbox.minLat, bbox.maxLng, bbox.maxLat])}
                    </code>
                  </div>
                </div>
              ) : (
                <div className="text-center text-(--color-text-muted) text-sm py-8">
                  <p>Click two points on the map to define a bounding box</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default RightPanel

