'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import type { ChargerStation } from '@/lib/ev/types'
import 'leaflet/dist/leaflet.css'

// Fix default marker icons in Next.js/webpack
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const MARKER_COLORS = {
  level2: '#3b82f6',   // blue
  dc_fast: '#f97316',  // orange
  tesla: '#ef4444',    // red
}

function createIcon(station: ChargerStation) {
  const color = station.isTesla
    ? MARKER_COLORS.tesla
    : MARKER_COLORS[station.level]
  return L.divIcon({
    className: '',
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24],
    html: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="${color}" stroke="white" stroke-width="1.5"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/></svg>`,
  })
}

function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap()
  useEffect(() => { map.setView([lat, lng], 11) }, [map, lat, lng])
  return null
}

interface Props {
  center: { lat: number; lng: number }
  stations: ChargerStation[]
}

export default function LeafletMap({ center, stations }: Props) {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains('dark'))
    check()
    const obs = new MutationObserver(check)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])

  const tileUrl = isDark
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

  const attribution = isDark
    ? '&copy; <a href="https://carto.com/">CARTO</a>'
    : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'

  return (
    <div className="h-[400px] w-full rounded-xl overflow-hidden border border-border">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={11}
        className="h-full w-full"
        scrollWheelZoom={true}
      >
        <TileLayer url={tileUrl} attribution={attribution} />
        <RecenterMap lat={center.lat} lng={center.lng} />

        {/* User location marker */}
        <Marker position={[center.lat, center.lng]}>
          <Popup>
            <span className="text-sm font-medium">Your location</span>
          </Popup>
        </Marker>

        {/* Station markers */}
        {stations.map((s) => (
          <Marker key={s.id} position={[s.lat, s.lng]} icon={createIcon(s)}>
            <Popup maxWidth={260}>
              <div className="text-xs space-y-1">
                <p className="font-semibold text-sm">{s.title}</p>
                <p className="text-gray-600">{s.address}</p>
                <p><strong>Operator:</strong> {s.operator}</p>
                {s.connections.length > 0 && (
                  <div>
                    <strong>Connectors:</strong>
                    <ul className="ml-3 list-disc">
                      {s.connections.slice(0, 4).map((c, i) => (
                        <li key={i}>
                          {c.type}{c.powerKW ? ` — ${c.powerKW} kW` : ''}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {s.usageCost && <p><strong>Cost:</strong> {s.usageCost}</p>}
                {s.isFree && <p className="text-green-600 font-medium">✓ Free charging</p>}
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-1 text-blue-600 underline"
                >
                  Get Directions →
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
