import type { CalculationInput, CalculationResult } from './types'

// EPA eGRID average US grid emission factor (kg CO2 per kWh)
const GRID_EMISSION_FACTOR = 0.386
// CO2 per gallon of gasoline (kg)
const CO2_PER_GALLON = 8.887
// CO2 absorbed per tree per year (kg)
const CO2_PER_TREE_YEAR = 21.77
// Liters per gallon
const LITERS_PER_GALLON = 3.785
// km per mile
const KM_PER_MILE = 1.60934

export function calculate(input: CalculationInput): CalculationResult {
  const {
    vehicle,
    distanceUnit,
    monthlyDistance,
    chargingRatio,
    electricityRate,
    dcFastRate,
    gasPrice,
    gasPriceUnit,
    currency,
    currencySymbol,
  } = input

  // Normalize distance to miles for efficiency calc
  const monthlyMiles =
    distanceUnit === 'km' ? monthlyDistance / KM_PER_MILE : monthlyDistance

  // kWh consumed per month (using EPA efficiency for miles-based calc)
  const monthlyKwh = monthlyMiles / vehicle.epaEfficiency

  // Public L2 rate = home rate × markup (2.5×)
  const publicL2Rate = electricityRate * 2.5

  // Monthly charging cost by type
  const homeCost = monthlyKwh * chargingRatio.home * electricityRate
  const publicL2Cost = monthlyKwh * chargingRatio.publicL2 * publicL2Rate
  const dcFastCost = monthlyKwh * chargingRatio.dcFast * dcFastRate

  const monthlyCost = homeCost + publicL2Cost + dcFastCost
  const annualCost = monthlyCost * 12
  const fiveYearCost = annualCost * 5

  // Gas equivalent cost
  const monthlyGallons =
    gasPriceUnit === 'per_gallon'
      ? monthlyMiles / vehicle.gasEquivalentMpg
      : (monthlyMiles * KM_PER_MILE) / 100 * (1 / (vehicle.gasEquivalentMpg / 235.215)) / LITERS_PER_GALLON

  const gasPricePerGallon =
    gasPriceUnit === 'per_gallon' ? gasPrice : gasPrice * LITERS_PER_GALLON

  const monthlyGasCost = monthlyGallons * gasPricePerGallon
  const annualGasCost = monthlyGasCost * 12
  const annualGasSavings = annualGasCost - annualCost
  const fiveYearGasSavings = annualGasSavings * 5

  // CO2 savings
  const annualMiles = monthlyMiles * 12
  const gasCO2Kg = (annualMiles / vehicle.gasEquivalentMpg) * CO2_PER_GALLON
  const evCO2Kg = (annualMiles / vehicle.epaEfficiency) * GRID_EMISSION_FACTOR
  const annualCO2SavedKg = Math.max(0, gasCO2Kg - evCO2Kg)
  const treesEquivalent = Math.round(annualCO2SavedKg / CO2_PER_TREE_YEAR)

  return {
    monthlyCost,
    annualCost,
    fiveYearCost,
    monthlyGasCost,
    annualGasCost,
    annualGasSavings,
    fiveYearGasSavings,
    annualCO2SavedKg,
    treesEquivalent,
    costBreakdown: { home: homeCost, publicL2: publicL2Cost, dcFast: dcFastCost },
    monthlyKwh,
    currency,
    currencySymbol,
  }
}

export function formatCurrency(amount: number, symbol: string): string {
  const abs = Math.abs(amount)
  const formatted =
    abs >= 1000
      ? abs.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
      : abs.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  return `${amount < 0 ? '-' : ''}${symbol}${formatted}`
}

export function formatCO2(kg: number): string {
  if (kg >= 1000) return `${(kg / 1000).toFixed(1)} tons`
  return `${Math.round(kg)} kg`
}
