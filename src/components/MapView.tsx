import { useEffect, useRef } from 'react'
import maplibregl, { Map } from 'maplibre-gl'

export type BBox = {
  minLat: number
  minLng: number
  maxLat: number
  maxLng: number
}

type MapViewProps = {
  bbox: BBox | null
  onChangeBBox: (bbox: BBox) => void
}

const DEFAULT_CENTER: [number, number] = [0, 0]
const DEFAULT_ZOOM = 1.5

const MapView = ({ bbox, onChangeBBox }: MapViewProps) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<Map | null>(null)
  const clickStateRef = useRef<{ firstPoint: [number, number] | null }>({ firstPoint: null })

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: 'https://demotiles.maplibre.org/style.json',
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
    })

    mapRef.current = map

    map.addControl(new maplibregl.NavigationControl({ showCompass: true, showZoom: true }), 'top-right')

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

        const minLng = Math.min(lng1, lng2)
        const maxLng = Math.max(lng1, lng2)
        const minLat = Math.min(lat1, lat2)
        const maxLat = Math.max(lat1, lat2)

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
  }, [onChangeBBox])

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
