import { useEffect, useRef, useState } from "react";
import { ToolManager } from "../map/ToolManager";
import { createTools } from "../map/tools";
import { mapController } from "../map/MapController";

const SidePanel = () => {
  const toolManagerRef = useRef<ToolManager | null>(null);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [tools, setTools] = useState<ReturnType<typeof createTools> | null>(null);

  // Initialize ToolManager once
  useEffect(() => {
    toolManagerRef.current = new ToolManager();
  }, []);

  // Wait for map and draw to be ready, then create tools
  useEffect(() => {
    const checkAndCreateTools = () => {
      try {
        const draw = mapController.getDraw();
        if (draw) {
          const createdTools = createTools();
          setTools(createdTools);
        }
      } catch {
        // TerraDraw not ready yet, retry
        setTimeout(checkAndCreateTools, 100);
      }
    };

    checkAndCreateTools();
  }, []);

  const activateTool = (toolId: string) => {
    if (!tools || !toolManagerRef.current) return;

    const tool = tools[toolId as keyof typeof tools];
    if (!tool) return;

    toolManagerRef.current.activate(tool);
    setActiveTool(tool.id);
  };

  return (
    <div className="absolute left-2 top-2 z-40 bg-surface border border-border rounded shadow-2xl">
      <div className="p-1.5 flex flex-col gap-1.5">

        {/* Polygon Tool */}
        <button
          onClick={() => activateTool("polygon")}
          className={`relative p-2 rounded-lg border transition-all duration-200 cursor-pointer ${
            activeTool === "polygon"
              ? "bg-primary border-primary shadow-md scale-[1.02]" 
              : "bg-surface border-border hover:border-primary/50 hover:bg-muted/50 hover:shadow-sm"
          }`}
          title="Draw Polygon"
          aria-label="Draw Polygon"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 -960 960 960" 
            className={`w-4 h-4 transition-colors duration-200 ${
              activeTool === "polygon" ? "fill-white" : "fill-accent"
            }`}
          >
            <path d="M298-200h364l123-369-305-213-305 213 123 369Zm-58 80L80-600l400-280 400 280-160 480H240Zm240-371Z"/>
          </svg>
        </button>

        {/* More tools will go here */}
      </div>
    </div>
  );
};

export default SidePanel;
