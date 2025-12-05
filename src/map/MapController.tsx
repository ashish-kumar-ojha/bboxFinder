// src/map/MapController.ts
import type maplibregl from "maplibre-gl"

class MapController {
  private map: maplibregl.Map | null = null

  setMap(map: maplibregl.Map) {
    this.map = map
  }

  getMap() {
    return this.map
  }

  clear() {
    this.map = null
  }
}

export const mapController = new MapController()
