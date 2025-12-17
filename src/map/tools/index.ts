import { mapController } from '../MapController'

import { PolygonTool } from './PolygonTool'
import { RectangleTool } from './RectangleTool'

export function createTools() {
  const draw = mapController.getDraw()
  if (!draw) throw new Error('TerraDraw not initialized')
  return {
    polygon: new PolygonTool(draw),
    rectangle: new RectangleTool(draw),
    // other tools later
  }
}
