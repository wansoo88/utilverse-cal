export interface FilamentType {
  id: string
  name: string
  density: number // g/cm³
  avgPricePerKg: number // USD
}

export interface PrintCostInput {
  filament: FilamentType
  filamentPricePerKg: number
  modelWeightG: number
  printTimeHours: number
  printerPriceUsd: number
  electricityRate: number // $/kWh
  printerWattage: number // watts
  failureMarginPct: number // 0-100
}

export interface PrintCostResult {
  materialCost: number
  electricityCost: number
  depreciationCost: number
  failureMarginCost: number
  totalCost: number
  suggestedPrice30: number
  suggestedPrice50: number
  suggestedPrice100: number
  breakdown: {
    material: number // percentage
    electricity: number
    depreciation: number
    failureMargin: number
  }
}
