import type { ChargerStation, ChargerFilter } from './types'

const OCM_BASE = 'https://api.openchargemap.io/v3/poi/'

export async function fetchNearbyChargers(
  lat: number,
  lng: number,
  radiusMiles: number,
  filters: ChargerFilter,
  apiKey: string
): Promise<ChargerStation[]> {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lng.toString(),
    distance: radiusMiles.toString(),
    distanceunit: 'Miles',
    maxresults: '100',
    compact: 'true',
    verbose: 'false',
    key: apiKey,
  })

  // Level filters → ConnectionTypeID
  // Level 2 (J1772/Type2) = 1,2,25  |  DC Fast (CCS/CHAdeMO/Tesla) = 32,33,2,27
  const levelIds: number[] = []
  if (filters.level2) levelIds.push(1, 2, 25)
  if (filters.dcFast) levelIds.push(32, 33, 27)
  if (filters.tesla) levelIds.push(30) // Tesla Supercharger connector
  if (levelIds.length > 0) {
    params.set('connectiontypeid', levelIds.join(','))
  }

  // Free only → UsageCost filter done client-side (API doesn't support it well)

  try {
    const res = await fetch(`${OCM_BASE}?${params.toString()}`)
    if (!res.ok) throw new Error(`OCM API ${res.status}`)
    const data = await res.json()
    return parseStations(data, filters.freeOnly)
  } catch {
    console.error('Failed to fetch chargers')
    return []
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function parseStations(raw: any[], freeOnly: boolean): ChargerStation[] {
  const stations: ChargerStation[] = raw
    .map((poi: any) => {
      const addr = poi.AddressInfo ?? {}
      const connections: ChargerStation['connections'] = (poi.Connections ?? []).map((c: any) => ({
        type: c.ConnectionType?.Title ?? 'Unknown',
        powerKW: c.PowerKW ?? null,
        currentType: c.CurrentType?.Title ?? null,
      }))

      const maxPower = Math.max(0, ...connections.map((c) => c.powerKW ?? 0))
      const level: ChargerStation['level'] =
        maxPower >= 50 ? 'dc_fast' : maxPower > 0 ? 'level2' : 'level2'

      const isTesla =
        (poi.OperatorInfo?.Title ?? '').toLowerCase().includes('tesla') ||
        connections.some((c) => c.type.toLowerCase().includes('tesla'))

      const usageCost: string | null = poi.UsageCost ?? null
      const isFree =
        usageCost?.toLowerCase().includes('free') ||
        usageCost === '$0.00' ||
        usageCost === '0' ||
        false

      return {
        id: poi.ID,
        title: addr.Title ?? 'Charging Station',
        lat: addr.Latitude,
        lng: addr.Longitude,
        address: [addr.AddressLine1, addr.Town, addr.StateOrProvince]
          .filter(Boolean)
          .join(', '),
        distance: addr.Distance ?? null,
        operator: poi.OperatorInfo?.Title ?? 'Unknown',
        connections,
        level,
        isTesla,
        usageCost,
        isFree,
        isOperational: poi.StatusType?.IsOperational !== false,
      } satisfies ChargerStation
    })
    .filter((s: ChargerStation) => s.lat && s.lng && s.isOperational)

  if (freeOnly) return stations.filter((s) => s.isFree)
  return stations
}
