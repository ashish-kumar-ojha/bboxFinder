import { useState, useEffect, useRef } from 'react'

interface GeocodingResult {
  display_name: string
  lat: string
  lon: string
  place_id: number
}

interface GeocodingSearchProps {
  onLocationSelect: (lat: number, lng: number) => void
}

const GeocodingSearch = ({ onLocationSelect }: GeocodingSearchProps) => {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<GeocodingResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    const timeoutId = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`,
          {
            headers: {
              'User-Agent': 'BBoxFinder/1.0'
            }
          }
        )
        const data = await response.json()
        setSuggestions(data)
      } catch (error) {
        console.error('Geocoding error:', error)
        setSuggestions([])
      } finally {
        setIsLoading(false)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query])

  const handleSelect = (result: GeocodingResult) => {
    setQuery(result.display_name)
    setShowSuggestions(false)
    onLocationSelect(parseFloat(result.lat), parseFloat(result.lon))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    setShowSuggestions(true)
  }

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true)
    }
  }

  return (
    <div ref={searchRef} className="absolute top-4 left-1/2 -translate-x-1/2 z-20 w-full max-w-md">
      <div className="relative">
        <div className="relative flex items-center">
          <div className="absolute left-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-(--color-text-muted)"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            placeholder="Search for a city or place..."
            className="w-full pl-10 pr-4 py-2 bg-surface border border-border rounded-3xl shadow-sm text-(--color-text) placeholder:text-(--color-text-muted) focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent opacity-70 focus:opacity-100"
          />
          {isLoading && (
            <div className="absolute right-3">
              <svg
                className="animate-spin h-5 w-5 text-(--color-text-muted)"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="#7AE2CF"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute mt-1 w-full bg-surface border border-border rounded-lg shadow-lg overflow-hidden z-30 max-h-60 overflow-y-auto">
            {suggestions.map((result) => (
              <button
                key={result.place_id}
                onClick={() => handleSelect(result)}
                className="w-full px-4 py-3 text-left hover:bg-bg transition-colors border-b border-border last:border-b-0 text-(--color-text)"
              >
                <div className="text-sm font-medium">{result.display_name}</div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default GeocodingSearch

