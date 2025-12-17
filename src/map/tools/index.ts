import { mapController } from '../MapController'

import { PolygonTool } from './PolygonTool'

export function createTools() {
  const draw = mapController.getDraw()
  if (!draw) throw new Error('TerraDraw not initialized')
  return {
    polygon: new PolygonTool(draw),
    // other tools later
  }
}
