import { TerraDraw } from "terra-draw";
import type { MapTool } from "./BaseTool";

export class PolygonTool implements MapTool {
    id: string;
    name: string;
    // icon: string;

    private draw: TerraDraw;
    constructor(draw: TerraDraw){
        this.draw = draw
        this.id = "polygon"
        this.name = "Polygon"
    }

    enable(): void {
        this.draw.setMode("polygon");
    }
    disable(): void {
        this.draw.setMode("select");
    }
}