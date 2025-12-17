// src/map/MapController.ts
import type maplibregl from 'maplibre-gl'
import { TerraDraw } from 'terra-draw'

class MapController {
  private map: maplibregl.Map | null = null
  private draw: TerraDraw | null = null

  //Map Methods
  setMap(map: maplibregl.Map) {
    this.map = map
  }

  getMap() {
    return this.map
  }

  //TerraDraw Methods
  setDraw(draw: TerraDraw) {
    this.draw = draw
  }

  getDraw() {
    if (!this.draw) throw new Error('TerraDraw not initialized')
    return this.draw
  }

  // Clean Up Methods

  clear() {
    this.draw = null
    this.map = null
  }
}

export const mapController = new MapController()
