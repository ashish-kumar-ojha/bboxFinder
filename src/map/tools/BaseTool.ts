export interface MapTool {
    id: string;
    name: string;
    enable(): void;
    disable(): void;
}
