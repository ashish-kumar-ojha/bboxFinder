import { BoxSelect, BookOpen, Settings } from 'lucide-react'
import { useState } from 'react'

type NavId = 'bbox' | 'knowledge' | 'settings'

const LeftSidebar = () => {
  const [active, setActive] = useState<NavId>('bbox')

  const navItems: { id: NavId; icon: typeof BoxSelect; ariaLabel: string }[] = [
    { id: 'bbox', icon: BoxSelect, ariaLabel: 'Bbox Finder' },
    { id: 'knowledge', icon: BookOpen, ariaLabel: 'Knowledge Base' },
    { id: 'settings', icon: Settings, ariaLabel: 'Settings' },
  ]

  return (
    <aside className="absolute left-0 top-4 bottom-4 z-10 w-14 flex flex-col rounded-r-xl border border-border border-l-0 bg-sidebar text-text shadow-[0_4px_20px_rgba(0,0,0,0.08),0_0_1px_rgba(0,0,0,0.06)]">
      <div className="p-3 flex justify-center">
        <img src="/bbox-finder-logo.svg" alt="Bbox Finder" className="w-8 h-8" />
      </div>
      <div className="h-px shrink-0 bg-border" aria-hidden />
      <nav className="flex flex-col items-center gap-1 p-2" aria-label="Main navigation">
        {navItems.map(({ id, icon: Icon, ariaLabel }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActive(id)}
            aria-label={ariaLabel}
            aria-current={active === id ? 'page' : undefined}
            className={`p-2 rounded-lg transition-colors ${
              active === id ? 'bg-primary text-white' : 'text-text-muted hover:bg-border hover:text-text'
            }`}
          >
            <Icon className="w-4 h-4" strokeWidth={2} aria-hidden />
          </button>
        ))}
      </nav>
    </aside>
  )
}

export default LeftSidebar
