import { useEffect } from 'react'
import { Map } from 'maplibre-gl'
import { getBasemapStyle } from '../utils/mapStyles'
import { addBBoxLayers, updateBBoxLayer } from '../utils/mapLayers'
import type { Basemap } from '../components/SidePanel'
import type { BBox } from '../store/mapStore'

export const useMapBasemap = (
  mapRef: React.RefObject<Map | null>,
  basemap: Basemap,
  bbox: BBox | null
) => {
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    
    map.setStyle(getBasemapStyle(basemap))
    
    map.once('style.load', () => {
      addBBoxLayers(map)
      
      // Re-apply bbox if it exists
      if (bbox) {
        updateBBoxLayer(map, bbox)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [basemap])
}

