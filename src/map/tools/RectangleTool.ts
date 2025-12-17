import { TerraDraw } from 'terra-draw'

import type { MapTool } from './BaseTool'

export class RectangleTool implements MapTool {
  id: string
  name: string
  private draw: TerraDraw
  constructor(draw: TerraDraw) {
    this.draw = draw
    this.id = 'rectangle'
    this.name = 'Rectangle'
  }
  enable(): void {
    this.draw.setMode('rectangle')
  }
  disable(): void {
    this.draw.setMode('select')
  }
}
