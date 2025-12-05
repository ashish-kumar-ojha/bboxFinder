import { create } from 'zustand'
import type { Basemap, DrawingTool } from '../components/SidePanel'

export type BBox = {
  minLat: number
  minLng: number
  maxLat: number
  maxLng: number
}

interface MapState {
  bbox: BBox | null
  basemap: Basemap
  drawingTool: DrawingTool
  center: [number, number] | undefined
  zoom: number | undefined
  setBBox: (bbox: BBox | null) => void
  setBasemap: (basemap: Basemap) => void
  setDrawingTool: (tool: DrawingTool) => void
  setCenter: (center: [number, number] | undefined) => void
  setZoom: (zoom: number | undefined) => void
}

export const useMapStore = create<MapState>((set) => ({
  bbox: null,
  basemap: 'street',
  drawingTool: 'rectangle',
  center: undefined,
  zoom: undefined,
  setBBox: (bbox) => set({ bbox }),
  setBasemap: (basemap) => set({ basemap }),
  setDrawingTool: (drawingTool) => set({ drawingTool }),
  setCenter: (center) => set({ center }),
  setZoom: (zoom) => set({ zoom }),
}))

