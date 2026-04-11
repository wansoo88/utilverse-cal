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
  // 모든 타입이 ON이면 connectiontypeid 파라미터 생략 → 전체 조회 (한국 등 다양한 규격 포함)
  // 특정 타입만 선택 시에만 필터링 적용
  const allTypesOn = filters.level2 && filters.dcFast && filters.tesla
  if (!allTypesOn) {
    // Level 2: J1772(1), Type2(25), Blue Commando(2)
    // DC Fast: CCS Type1(32), CCS Type2(33), CHAdeMO(27), GB/T DC(3)
    // Tesla: Supercharger(30)
    const levelIds: number[] = []
    if (filters.level2) levelIds.push(1, 25, 2)
    if (filters.dcFast) levelIds.push(32, 33, 27, 3)
    if (filters.tesla) levelIds.push(30)
    if (levelIds.length > 0) {
      params.set('connectiontypeid', levelIds.join(','))
    }
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
