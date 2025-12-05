import { useEffect } from 'react'
import { Map } from 'maplibre-gl'
import { updateBBoxLayer } from '../utils/mapLayers'
import type { BBox } from '../store/mapStore'

export const useMapBBox = (
  mapRef: React.RefObject<Map | null>,
  bbox: BBox | null
) => {
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    const applyBBox = () => {
      updateBBoxLayer(map, bbox)
    }

    if (map.isStyleLoaded()) {
      applyBBox()
    } else {
      map.once('load', applyBBox)
    }
  }, [mapRef, bbox])
}

