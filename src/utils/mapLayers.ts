import maplibregl, { Map } from 'maplibre-gl'
import type { BBox } from '../store/mapStore'

const BBOX_SOURCE_ID = 'bbox-source'
const BBOX_FILL_LAYER_ID = 'bbox-fill'
const BBOX_LINE_LAYER_ID = 'bbox-line'

export const addBBoxLayers = (map: Map) => {
  if (map.getSource(BBOX_SOURCE_ID)) {
    return
  }

  map.addSource(BBOX_SOURCE_ID, {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: [],
    },
  })

  map.addLayer({
    id: BBOX_FILL_LAYER_ID,
    type: 'fill',
    source: BBOX_SOURCE_ID,
    paint: {
      'fill-color': '#2563eb',
      'fill-opacity': 0.2,
    },
  })

  map.addLayer({
    id: BBOX_LINE_LAYER_ID,
    type: 'line',
    source: BBOX_SOURCE_ID,
    paint: {
      'line-color': '#1d4ed8',
      'line-width': 2,
    },
  })
}

export const updateBBoxLayer = (map: Map, bbox: BBox | null) => {
  if (!bbox) {
    const source = map.getSource(BBOX_SOURCE_ID) as maplibregl.GeoJSONSource | undefined
    if (source) {
      source.setData({
        type: 'FeatureCollection',
        features: [],
      })
    }
    return
  }

  const source = map.getSource(BBOX_SOURCE_ID) as maplibregl.GeoJSONSource | undefined
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

