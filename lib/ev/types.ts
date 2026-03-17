export interface EVModel {
  id: string
  name: string
  brand: string
  year: number
  batteryCapacity: number
  epaEfficiency: number   // mi/kWh
  wltpEfficiency: number  // km/kWh
  regions: string[]
  gasEquivalent: string
  gasEquivalentMpg: number
}

export type RegionCode = 'us' | 'gb' | 'de' | 'no' | 'nl' | 'fr' | 'cn' | 'au' | 'ca'

export interface ChargingRatio {
  home: number      // 0–1
  publicL2: number
  dcFast: number
}

export interface CalculationInput {
  vehicle: EVModel
  regionCode: RegionCode
  subRegionCode: string   // state/province/city code
  monthlyDistance: number
  distanceUnit: 'miles' | 'km'
  chargingRatio: ChargingRatio
  electricityRate: number  // $/kWh (local currency)
  dcFastRate: number
  gasPrice: number         // per gallon (US/CA) or per liter (others)
  gasPriceUnit: 'per_gallon' | 'per_liter'
  currency: string
  currencySymbol: string
}

export interface CostBreakdown {
  home: number
  publicL2: number
  dcFast: number
}

export interface CalculationResult {
  monthlyCost: number
  annualCost: number
  fiveYearCost: number
  monthlyGasCost: number
  annualGasCost: number
  annualGasSavings: number
  fiveYearGasSavings: number
  annualCO2SavedKg: number
  treesEquivalent: number
  costBreakdown: CostBreakdown
  monthlyKwh: number
  currency: string
  currencySymbol: string
}

// ─── Charger Map types ────────────────────────────────────────────────────────

export interface ChargerStation {
  id: number
  title: string
  lat: number
  lng: number
  address: string
  distance: number | null
  operator: string
  connections: {
    type: string
    powerKW: number | null
    currentType: string | null
  }[]
  level: 'level2' | 'dc_fast'
  isTesla: boolean
  usageCost: string | null
  isFree: boolean
  isOperational: boolean
}

export interface ChargerFilter {
  level2: boolean
  dcFast: boolean
  tesla: boolean
  freeOnly: boolean
}
