import { useEffect, useRef } from 'react'
import maplibregl, { Map } from 'maplibre-gl'
import { getBasemapStyle } from '../utils/mapStyles'
import { DEFAULT_CENTER, DEFAULT_ZOOM } from '../utils/mapConstants'
import { addBBoxLayers } from '../utils/mapLayers'
import type { Basemap } from '../components/SidePanel'

export const useMapInstance = (
  mapContainerRef: React.RefObject<HTMLDivElement | null>,
  basemap: Basemap,
  center?: [number, number],
  zoom?: number
) => {
  const mapRef = useRef<Map | null>(null)

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: getBasemapStyle(basemap),
      center: center || DEFAULT_CENTER,
      zoom: zoom || DEFAULT_ZOOM,
    })

    mapRef.current = map

    map.addControl(new maplibregl.NavigationControl({ showCompass: true, showZoom: true }), 'bottom-right')

    map.on('load', () => {
      addBBoxLayers(map)
    })

    return () => {
      map.remove()
      mapRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return mapRef
}

