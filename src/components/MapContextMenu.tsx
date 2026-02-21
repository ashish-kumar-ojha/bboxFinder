import { useEffect, useRef, useState } from 'react'
import { Pencil, Upload, X, Hexagon, Square, Copy } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { toast } from 'react-hot-toast'

import { ToolManager } from '../map/ToolManager'
import { createTools } from '../map/tools'
import { mapController } from '../map/MapController'
import { onSuccessSound } from '../utils/feedback_sounds'

interface ContextMenuPosition {
  x: number
  y: number
}

interface Coordinates {
  lat: number
  lng: number
}

interface MenuItem {
  id: string
  label: string
  icon: LucideIcon
  hasSubmenu?: boolean
  action?: () => void
  className?: string
}

interface SubMenuItem {
  id: string
  label: string
  icon?: LucideIcon
  action: () => void
}

const MapContextMenu = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState<ContextMenuPosition>({ x: 0, y: 0 })
  const [clickCoordinates, setClickCoordinates] = useState<Coordinates | null>(null)
  const [showDrawSubmenu, setShowDrawSubmenu] = useState(false)
  const [showCopySubmenu, setShowCopySubmenu] = useState(false)
  const [drawMenuPosition, setDrawMenuPosition] = useState<ContextMenuPosition>({ x: 0, y: 0 })
  const [copyMenuPosition, setCopyMenuPosition] = useState<ContextMenuPosition>({ x: 0, y: 0 })
  const menuRef = useRef<HTMLDivElement>(null)
  const drawMenuRef = useRef<HTMLDivElement>(null)
  const copyMenuRef = useRef<HTMLDivElement>(null)
  const toolManagerRef = useRef<ToolManager | null>(null)
  const [tools, setTools] = useState<ReturnType<typeof createTools> | null>(null)

  // Initialize ToolManager once
  useEffect(() => {
    toolManagerRef.current = new ToolManager()
  }, [])

  // Wait for map and draw to be ready, then create tools
  useEffect(() => {
    const checkAndCreateTools = () => {
      try {
        const draw = mapController.getDraw()
        if (draw) {
          const createdTools = createTools()
          setTools(createdTools)
        }
      } catch {
        // TerraDraw not ready yet, retry
        setTimeout(checkAndCreateTools, 100)
      }
    }

    checkAndCreateTools()
  }, [])

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      // Check if right-click is on the map container or map canvas
      const mapContainer = target.closest('[data-map-container]')
      const mapCanvas = target.closest('.maplibregl-canvas')

      // Don't show menu if clicking on other UI elements
      const isOnUIElement =
        target.closest('[data-ui-element]') ||
        target.closest('button') ||
        target.closest('input') ||
        target.closest('select')

      if ((mapContainer || mapCanvas) && !isOnUIElement) {
        e.preventDefault()

        // Get coordinates from the map
        const map = mapController.getMap()
        if (map) {
          // Get the map container's bounding rect to calculate relative coordinates
          const mapContainerEl = map.getContainer()
          const rect = mapContainerEl.getBoundingClientRect()
          const x = e.clientX - rect.left
          const y = e.clientY - rect.top

          // Convert pixel coordinates to lngLat
          const lngLat = map.unproject([x, y])
          setClickCoordinates({
            lat: Number(lngLat.lat.toFixed(6)),
            lng: Number(lngLat.lng.toFixed(6)),
          })
        }

        setPosition({ x: e.clientX, y: e.clientY })
        setIsVisible(true)
        setShowDrawSubmenu(false)
        setShowCopySubmenu(false)
      }
    }

    const handleClick = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        drawMenuRef.current &&
        !drawMenuRef.current.contains(e.target as Node) &&
        copyMenuRef.current &&
        !copyMenuRef.current.contains(e.target as Node)
      ) {
        setIsVisible(false)
        setShowDrawSubmenu(false)
        setShowCopySubmenu(false)
      }
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVisible) {
        setIsVisible(false)
        setShowDrawSubmenu(false)
        setShowCopySubmenu(false)
      }
    }

    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('click', handleClick)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('click', handleClick)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isVisible])

  const activateTool = (toolId: string) => {
    if (!tools || !toolManagerRef.current) return

    const tool = tools[toolId as keyof typeof tools]
    if (!tool) return

    toolManagerRef.current.activate(tool)
    setIsVisible(false)
    setShowDrawSubmenu(false)
  }

  const handleDrawClick = () => {
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect()
      // Position the draw menu to the right of the main menu
      setDrawMenuPosition({
        x: rect.right + 4,
        y: rect.top,
      })
      setShowDrawSubmenu(true)
      setShowCopySubmenu(false)
    }
  }

  const handleCopyClick = () => {
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect()
      // Position the copy menu to the right of the main menu
      setCopyMenuPosition({
        x: rect.right + 4,
        y: rect.top,
      })
      setShowCopySubmenu(true)
      setShowDrawSubmenu(false)
    }
  }

  // Coordinate format conversion functions
  const formatDD = (lat: number, lng: number): string => {
    return `${lat}, ${lng}`
  }

  const formatDMS = (lat: number, lng: number): string => {
    const formatCoordinate = (coord: number, isLat: boolean): string => {
      const abs = Math.abs(coord)
      const degrees = Math.floor(abs)
      const minutesFloat = (abs - degrees) * 60
      const minutes = Math.floor(minutesFloat)
      const seconds = (minutesFloat - minutes) * 60
      const direction = isLat ? (coord >= 0 ? 'N' : 'S') : coord >= 0 ? 'E' : 'W'
      return `${degrees}°${minutes}'${seconds.toFixed(2)}"${direction}`
    }
    return `${formatCoordinate(lat, true)} ${formatCoordinate(lng, false)}`
  }

  const formatDDM = (lat: number, lng: number): string => {
    const formatCoordinate = (coord: number, isLat: boolean): string => {
      const abs = Math.abs(coord)
      const degrees = Math.floor(abs)
      const minutes = (abs - degrees) * 60
      const direction = isLat ? (coord >= 0 ? 'N' : 'S') : coord >= 0 ? 'E' : 'W'
      return `${degrees}°${minutes.toFixed(4)}'${direction}`
    }
    return `${formatCoordinate(lat, true)} ${formatCoordinate(lng, false)}`
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('Copied to clipboard!', { duration: 2000 })
      onSuccessSound()
      setIsVisible(false)
      setShowCopySubmenu(false)
    } catch {
      toast.error('Failed to copy')
    }
  }

  const handleCopyFormat = (format: 'dd' | 'dms' | 'ddm') => {
    if (!clickCoordinates) return

    let formatted: string
    switch (format) {
      case 'dd':
        formatted = formatDD(clickCoordinates.lat, clickCoordinates.lng)
        break
      case 'dms':
        formatted = formatDMS(clickCoordinates.lat, clickCoordinates.lng)
        break
      case 'ddm':
        formatted = formatDDM(clickCoordinates.lat, clickCoordinates.lng)
        break
    }
    copyToClipboard(formatted)
  }

  const handleImport = () => {
    // TODO: Implement import functionality
    console.log('Import functionality to be implemented')
    setIsVisible(false)
  }

  const handleClose = () => {
    setIsVisible(false)
    setShowDrawSubmenu(false)
    setShowCopySubmenu(false)
  }

  // Menu items configuration
  const menuItems: MenuItem[] = [
    {
      id: 'draw',
      label: 'Draw',
      icon: Pencil,
      hasSubmenu: true,
      action: handleDrawClick,
    },
    {
      id: 'copy',
      label: 'Lat/Long',
      icon: Copy,
      hasSubmenu: true,
      action: handleCopyClick,
    },
    {
      id: 'import',
      label: 'Import',
      icon: Upload,
      action: handleImport,
    },
    {
      id: 'close',
      label: 'Close',
      icon: X,
      action: handleClose,
      className: 'text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20',
    },
  ]

  // Draw submenu items
  const drawSubmenuItems: SubMenuItem[] = [
    {
      id: 'polygon',
      label: 'Polygon',
      icon: Hexagon,
      action: () => activateTool('polygon'),
    },
    {
      id: 'rectangle',
      label: 'Rectangle',
      icon: Square,
      action: () => activateTool('rectangle'),
    },
  ]

  // Copy format submenu items
  const copySubmenuItems: SubMenuItem[] = [
    {
      id: 'dd',
      label: 'DD',
      action: () => handleCopyFormat('dd'),
    },
    {
      id: 'dms',
      label: 'DMS',
      action: () => handleCopyFormat('dms'),
    },
    {
      id: 'ddm',
      label: 'DDM',
      action: () => handleCopyFormat('ddm'),
    },
  ]

  // Arrow icon component
  const ArrowIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className="w-4 h-4 ml-auto" fill="currentColor">
      <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
    </svg>
  )

  if (!isVisible) return null

  return (
    <>
      {/* Main context menu */}
      <div
        ref={menuRef}
        className="fixed z-50 bg-surface border border-border rounded-lg shadow-2xl min-w-[180px]"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      >
        <div className="py-1">
          {menuItems.map(item => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={item.action}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-muted/50 transition-colors flex items-center gap-2 ${
                  item.className || ''
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
                {item.hasSubmenu && <ArrowIcon />}
              </button>
            )
          })}
        </div>
      </div>

      {/* Draw tools popup menu */}
      {showDrawSubmenu && (
        <div
          ref={drawMenuRef}
          className="fixed z-50 bg-surface border border-border rounded-lg shadow-2xl min-w-[180px]"
          style={{
            left: `${drawMenuPosition.x}px`,
            top: `${drawMenuPosition.y}px`,
          }}
        >
          <div className="py-1">
            {drawSubmenuItems.map(item => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-muted/50 transition-colors flex items-center gap-2"
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  <span>{item.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Copy Lat/Long format popup menu */}
      {showCopySubmenu && (
        <div
          ref={copyMenuRef}
          className="fixed z-50 bg-surface border border-border rounded-lg shadow-2xl min-w-[180px]"
          style={{
            left: `${copyMenuPosition.x}px`,
            top: `${copyMenuPosition.y}px`,
          }}
        >
          <div className="py-1">
            {copySubmenuItems.map(item => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-muted/50 transition-colors flex items-center gap-2"
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  <span>{item.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </>
  )
}

export default MapContextMenu
