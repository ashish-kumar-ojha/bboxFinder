import type { MapTool } from './tools/BaseTool'

export class ToolManager {
  private activeTool: MapTool | null = null

  activate(tool: MapTool) {
    if (this.activeTool?.id === tool.id) return

    this.activeTool?.disable()
    this.activeTool = tool
    tool.enable()
  }

  deactivate() {
    this.activeTool?.disable()
    this.activeTool = null
  }

  getActiveTool() {
    return this.activeTool
  }
}
