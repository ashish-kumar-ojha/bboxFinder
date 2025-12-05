import maplibregl from 'maplibre-gl'
import type { Basemap } from '../components/SidePanel'

export const getBasemapStyle = (basemap: Basemap): string | maplibregl.StyleSpecification => {
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

