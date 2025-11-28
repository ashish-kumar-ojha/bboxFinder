import { useEffect, useRef } from 'react'
import maplibregl, { Map } from 'maplibre-gl'
import type { Basemap, DrawingTool } from './SidePanel'

export type BBox = {
  minLat: number
  minLng: number
  maxLat: number
  maxLng: number
}

type MapViewProps = {
  bbox: BBox | null
  onChangeBBox: (bbox: BBox) => void
  basemap?: Basemap
  drawingTool?: DrawingTool
}

const DEFAULT_CENTER: [number, number] = [0, 0]
const DEFAULT_ZOOM = 1.5

const getBasemapStyle = (basemap: Basemap): string | maplibregl.StyleSpecification => {
  if (basemap === 'street') {
    return `https://api.maptiler.com/maps/base-v4/style.json?key=${import.meta.env.VITE_MAPTILER_KEY}`
  }
  
  // Satellite style using Esri World Imagery
  return {
    version: 8,
    sources: {
      'raster-tiles': {
        type: 'raster',
        tiles: [
          'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        ],
        tileSize: 256,
        attribution: '© Esri',
      },
    },
    layers: [
      {
        id: 'simple-tiles',
        type: 'raster',
        source: 'raster-tiles',
        minzoom: 0,
        maxzoom: 22,
      },
    ],
  }
}

const MapView = ({ bbox, onChangeBBox, basemap = 'street', drawingTool = 'rectangle' }: MapViewProps) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<Map | null>(null)
  const clickStateRef = useRef<{ firstPoint: [number, number] | null }>({ firstPoint: null })
  const drawingToolRef = useRef<DrawingTool>(drawingTool)
  
  // Update ref when drawingTool changes and reset click state
  useEffect(() => {
    drawingToolRef.current = drawingTool
    clickStateRef.current = { firstPoint: null }
  }, [drawingTool])

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: getBasemapStyle(basemap),
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
    })

    mapRef.current = map

    map.addControl(new maplibregl.NavigationControl({ showCompass: true, showZoom: true }), 'bottom-right')

    map.on('load', () => {
      map.addSource('bbox-source', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      })

      map.addLayer({
        id: 'bbox-fill',
        type: 'fill',
        source: 'bbox-source',
        paint: {
          'fill-color': '#2563eb',
          'fill-opacity': 0.2,
        },
      })

      map.addLayer({
        id: 'bbox-line',
        type: 'line',
        source: 'bbox-source',
        paint: {
          'line-color': '#1d4ed8',
          'line-width': 2,
        },
      })
    })

    // Click interaction to set bbox corners
    const handleClick = (e: maplibregl.MapMouseEvent) => {
      const lngLat = e.lngLat
      const current = clickStateRef.current

      if (!current.firstPoint) {
        clickStateRef.current = { firstPoint: [lngLat.lng, lngLat.lat] }
      } else {
        const [lng1, lat1] = current.firstPoint
        const lng2 = lngLat.lng
        const lat2 = lngLat.lat

        let minLng = Math.min(lng1, lng2)
        let maxLng = Math.max(lng1, lng2)
        let minLat = Math.min(lat1, lat2)
        let maxLat = Math.max(lat1, lat2)

        // For square tool, enforce equal dimensions
        if (drawingToolRef.current === 'square') {
          const lngDiff = maxLng - minLng
          const latDiff = maxLat - minLat
          const maxDiff = Math.max(lngDiff, latDiff)
          
          // Center the square on the first point
          const centerLng = (lng1 + lng2) / 2
          const centerLat = (lat1 + lat2) / 2
          
          minLng = centerLng - maxDiff / 2
          maxLng = centerLng + maxDiff / 2
          minLat = centerLat - maxDiff / 2
          maxLat = centerLat + maxDiff / 2
        }

        clickStateRef.current = { firstPoint: null }
        onChangeBBox({ minLat, minLng, maxLat, maxLng })
      }
    }

    map.on('click', handleClick)

    return () => {
      map.off('click', handleClick)
      map.remove()
      mapRef.current = null
    }
  }, [onChangeBBox, basemap])

  // Update basemap when it changes
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    
    map.setStyle(getBasemapStyle(basemap))
    
    map.once('style.load', () => {
      // Re-add layers after style change
      if (map.getSource('bbox-source')) {
        return
      }
      
      map.addSource('bbox-source', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      })

      map.addLayer({
        id: 'bbox-fill',
        type: 'fill',
        source: 'bbox-source',
        paint: {
          'fill-color': '#2563eb',
          'fill-opacity': 0.2,
        },
      })

      map.addLayer({
        id: 'bbox-line',
        type: 'line',
        source: 'bbox-source',
        paint: {
          'line-color': '#1d4ed8',
          'line-width': 2,
        },
      })
      
      // Re-apply bbox if it exists
      if (bbox) {
        const source = map.getSource('bbox-source') as maplibregl.GeoJSONSource | undefined
        if (source) {
          const { minLat, minLng, maxLat, maxLng } = bbox
          source.setData({
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                geometry: {
                  type: 'Polygon',
                  coordinates: [[
                    [minLng, minLat],
                    [minLng, maxLat],
                    [maxLng, maxLat],
                    [maxLng, minLat],
                    [minLng, minLat],
                  ]],
                },
                properties: {},
              },
            ],
          })
        }
      }
    })
  }, [basemap, bbox])

  // Update bbox layer when bbox changes
  useEffect(() => {
    const map = mapRef.current
    if (!map || !bbox) return

    const applyBBox = () => {
      const source = map.getSource('bbox-source') as maplibregl.GeoJSONSource | undefined
      if (!source) return

      const { minLat, minLng, maxLat, maxLng } = bbox

      source.setData({
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [[
                [minLng, minLat],
                [minLng, maxLat],
                [maxLng, maxLat],
                [maxLng, minLat],
                [minLng, minLat],
              ]],
            },
            properties: {},
          },
        ],
      })
    }

    if (map.isStyleLoaded()) {
      applyBBox()
    } else {
      map.once('load', applyBBox)
    }
  }, [bbox])

  return (
    <div className="w-full h-full" ref={mapContainerRef} />
  )
}

export default MapView
