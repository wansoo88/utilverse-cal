'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import dynamic from 'next/dynamic'
import { fetchNearbyChargers } from '@/lib/ev/open-charge-map'
import type { ChargerStation, ChargerFilter } from '@/lib/ev/types'

const LeafletMap = dynamic(() => import('./leaflet-map'), { ssr: false })

const RADIUS_OPTIONS = [10, 25, 50] as const
const OCM_API_KEY = process.env.NEXT_PUBLIC_OCM_API_KEY ?? ''
const OCM_AVAILABLE = OCM_API_KEY.length > 0

export function ChargerFinderMap() {
  const [stations, setStations] = useState<ChargerStation[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [radius, setRadius] = useState<number>(25)
  const [zipInput, setZipInput] = useState('')
  const [filters, setFilters] = useState<ChargerFilter>({
    level2: true,
    dcFast: true,
    tesla: true,
    freeOnly: false,
  })
  const [visible, setVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  // Intersection observer for lazy loading
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { rootMargin: '200px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const search = useCallback(async (lat: number, lng: number) => {
    setLoading(true)
    setError(null)
    setCoords({ lat, lng })
    try {
      const data = await fetchNearbyChargers(lat, lng, radius, filters, OCM_API_KEY)
      setStations(data)
      if (data.length === 0) setError('No chargers found in this area. Try a larger radius.')
    } catch {
      setError('Failed to load charger data. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [radius, filters])

  // Re-fetch when filters/radius change and we have coords
  useEffect(() => {
    if (coords) search(coords.lat, coords.lng)
  }, [radius, filters]) // eslint-disable-line react-hooks/exhaustive-deps

  function handleUseMyLocation() {
    if (!OCM_API_KEY) {
      setError('Charger search is temporarily unavailable. Please try again later.')
      return
    }
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.')
      return
    }
    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => search(pos.coords.latitude, pos.coords.longitude),
      () => { setError('Location access denied. Try entering a ZIP code.'); setLoading(false) }
    )
  }

  async function handleZipSearch() {
    if (!zipInput.trim()) return
    if (!OCM_API_KEY) {
      setError('Charger search is temporarily unavailable. Please try again later.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(zipInput.trim())}&limit=1`,
        { headers: { 'User-Agent': 'cal.utilverse.info' } }
      )
      const data = await res.json()
      if (data.length === 0) { setError('Location not found. Try a different search.'); setLoading(false); return }
      search(parseFloat(data[0].lat), parseFloat(data[0].lon))
    } catch {
      setError('Geocoding failed. Please try again.')
      setLoading(false)
    }
  }

  function toggleFilter(key: keyof ChargerFilter) {
    setFilters((f) => ({ ...f, [key]: !f[key] }))
  }

  return (
    <section ref={sectionRef} className="mt-8">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <span>🗺️</span> Find EV Chargers Near You
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Locate nearby charging stations with real-time data from Open Charge Map.
          </p>
        </div>

        {/* Location input */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <button
            onClick={handleUseMyLocation}
            disabled={loading || !OCM_AVAILABLE}
            className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            <span>📍</span> Use My Location
          </button>
          <div className="flex flex-1 gap-2">
            <input
              type="text"
              placeholder="ZIP code, city, or address..."
              value={zipInput}
              onChange={(e) => setZipInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleZipSearch()}
              disabled={!OCM_AVAILABLE}
              aria-label="Location search"
              className="flex-1 rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
            />
            <button
              onClick={handleZipSearch}
              disabled={loading || !zipInput.trim() || !OCM_AVAILABLE}
              className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent disabled:opacity-50"
            >
              Search
            </button>
          </div>
        </div>

        {!OCM_AVAILABLE && (
          <div className="mb-4 rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
            Live charger search is currently unavailable. The cost calculator above still works.
          </div>
        )}

        {/* Filters + radius */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-xs text-muted-foreground mr-1">Filters:</span>
          {([
            { key: 'level2' as const, label: 'Level 2', active: filters.level2 },
            { key: 'dcFast' as const, label: 'DC Fast', active: filters.dcFast },
            { key: 'tesla' as const, label: 'Tesla', active: filters.tesla },
            { key: 'freeOnly' as const, label: 'Free Only', active: filters.freeOnly },
          ]).map((f) => (
            <button
              key={f.key}
              onClick={() => toggleFilter(f.key)}
              className={`rounded-md border px-2.5 py-1 text-xs transition-colors ${
                f.active
                  ? 'border-primary bg-primary/10 text-primary font-medium'
                  : 'border-border text-muted-foreground hover:border-primary/50'
              }`}
            >
              {f.label}
            </button>
          ))}

          <span className="mx-2 text-xs text-muted-foreground">|</span>
          <span className="text-xs text-muted-foreground">Radius:</span>
          {RADIUS_OPTIONS.map((r) => (
            <button
              key={r}
              onClick={() => setRadius(r)}
              className={`rounded-md border px-2 py-1 text-xs transition-colors ${
                radius === r
                  ? 'border-primary bg-primary/10 text-primary font-medium'
                  : 'border-border text-muted-foreground hover:border-primary/50'
              }`}
            >
              {r} mi
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Map area */}
        {visible ? (
          <div className="relative">
            {loading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-background/60 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="animate-spin">⚡</span> Loading chargers...
                </div>
              </div>
            )}
            {coords ? (
              <LeafletMap center={coords} stations={stations} />
            ) : (
              <div className="flex h-[400px] items-center justify-center rounded-xl border border-dashed border-border bg-muted/30">
                <p className="text-sm text-muted-foreground">
                  Search a location or use your current position to see nearby chargers.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="h-[400px] rounded-xl bg-muted/30 animate-pulse" />
        )}

        {/* Station list */}
        {stations.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium text-foreground mb-3">
              {stations.length} station{stations.length !== 1 ? 's' : ''} found
            </p>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 max-h-[320px] overflow-y-auto pr-1">
              {stations.slice(0, 30).map((s) => (
                <div
                  key={s.id}
                  className="rounded-lg border border-border bg-background p-3 text-sm"
                >
                  <p className="font-medium text-foreground truncate">{s.title}</p>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">{s.address}</p>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-medium ${
                      s.level === 'dc_fast'
                        ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400'
                        : 'bg-primary/10 text-primary'
                    }`}>
                      {s.level === 'dc_fast' ? 'DC Fast' : 'Level 2'}
                    </span>
                    {s.isTesla && (
                      <span className="inline-block rounded bg-red-500/10 px-1.5 py-0.5 text-[10px] font-medium text-red-600 dark:text-red-400">
                        Tesla
                      </span>
                    )}
                    {s.isFree && (
                      <span className="inline-block rounded bg-secondary/10 px-1.5 py-0.5 text-[10px] font-medium text-secondary">
                        Free
                      </span>
                    )}
                    <span className="text-[10px] text-muted-foreground">{s.operator}</span>
                  </div>
                  {s.distance != null && (
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {s.distance.toFixed(1)} mi away
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
