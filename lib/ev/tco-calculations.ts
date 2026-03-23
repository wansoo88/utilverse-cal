// EV vs Gas Total Cost of Ownership calculations

const KM_PER_MILE = 1.60934
const CO2_PER_GALLON = 8.887 // kg
const GRID_EMISSION_FACTOR = 0.386 // kg CO2/kWh

export interface TCOInput {
  // EV params
  evEfficiencyMiPerKwh: number
  electricityRatePerKwh: number
  evPurchasePrice: number
  evAnnualMaintenance: number // default ~$800
  evInsurance: number // annual
  evTaxCredit: number // federal/state credit

  // Gas params
  gasMpg: number
  gasPricePerGallon: number
  gasPurchasePrice: number
  gasAnnualMaintenance: number // default ~$1,500
  gasInsurance: number // annual

  // Shared
  annualMiles: number
  years: number // 5 or 10
  distanceUnit: 'miles' | 'km'
}

export interface YearlyData {
  year: number
  evCumulative: number
  gasCumulative: number
  evAnnual: number
  gasAnnual: number
}

export interface TCOResult {
  // Annual costs
  evAnnualFuel: number
  gasAnnualFuel: number
  evAnnualTotal: number
  gasAnnualTotal: number

  // Total over period
  evTotal: number
  gasTotal: number
  totalSavings: number

  // Breakeven
  breakevenYear: number | null // null = never breaks even in period
  breakevenMonths: number | null

  // CO2
  annualCO2SavedKg: number

  // Year-by-year data for chart
  yearlyData: YearlyData[]
}

export function calculateTCO(input: TCOInput): TCOResult {
  const {
    evEfficiencyMiPerKwh,
    electricityRatePerKwh,
    evPurchasePrice,
    evAnnualMaintenance,
    evInsurance,
    evTaxCredit,
    gasMpg,
    gasPricePerGallon,
    gasPurchasePrice,
    gasAnnualMaintenance,
    gasInsurance,
    annualMiles: rawAnnualMiles,
    years,
    distanceUnit,
  } = input

  const annualMiles =
    distanceUnit === 'km' ? rawAnnualMiles / KM_PER_MILE : rawAnnualMiles

  // Annual fuel costs
  const evAnnualFuel = (annualMiles / evEfficiencyMiPerKwh) * electricityRatePerKwh
  const gasAnnualFuel = (annualMiles / gasMpg) * gasPricePerGallon

  // Annual totals (fuel + maintenance + insurance, no depreciation for simplicity)
  const evAnnualTotal = evAnnualFuel + evAnnualMaintenance + evInsurance
  const gasAnnualTotal = gasAnnualFuel + gasAnnualMaintenance + gasInsurance

  // Net purchase price difference (EV - gas, after tax credit)
  const evNetPrice = evPurchasePrice - evTaxCredit
  const priceDiff = evNetPrice - gasPurchasePrice // positive = EV costs more upfront

  // Year-by-year cumulative costs (including purchase price)
  const yearlyData: YearlyData[] = []
  let evCumulative = evNetPrice
  let gasCumulative = gasPurchasePrice
  let breakevenYear: number | null = null
  let breakevenMonths: number | null = null

  for (let y = 1; y <= years; y++) {
    evCumulative += evAnnualTotal
    gasCumulative += gasAnnualTotal
    yearlyData.push({
      year: y,
      evCumulative: Math.round(evCumulative),
      gasCumulative: Math.round(gasCumulative),
      evAnnual: Math.round(evAnnualTotal),
      gasAnnual: Math.round(gasAnnualTotal),
    })

    // Check breakeven (when EV cumulative drops below gas cumulative)
    if (breakevenYear === null && evCumulative <= gasCumulative) {
      breakevenYear = y
      // Interpolate months within the year
      const prevEvCum = evCumulative - evAnnualTotal
      const prevGasCum = gasCumulative - gasAnnualTotal
      const annualDiff = (gasAnnualTotal - evAnnualTotal)
      if (annualDiff > 0) {
        const remaining = prevEvCum - prevGasCum
        const monthsInYear = Math.ceil((remaining / annualDiff) * 12)
        breakevenMonths = (y - 1) * 12 + monthsInYear
      }
    }
  }

  // If EV starts cheaper (negative priceDiff), breakeven is immediate
  if (priceDiff <= 0 && breakevenYear === null) {
    breakevenYear = 0
    breakevenMonths = 0
  }

  const evTotal = yearlyData[years - 1]?.evCumulative ?? evNetPrice
  const gasTotal = yearlyData[years - 1]?.gasCumulative ?? gasPurchasePrice
  const totalSavings = gasTotal - evTotal

  // CO2
  const gasCO2 = (annualMiles / gasMpg) * CO2_PER_GALLON
  const evCO2 = (annualMiles / evEfficiencyMiPerKwh) * GRID_EMISSION_FACTOR
  const annualCO2SavedKg = Math.max(0, gasCO2 - evCO2)

  return {
    evAnnualFuel,
    gasAnnualFuel,
    evAnnualTotal,
    gasAnnualTotal,
    evTotal,
    gasTotal,
    totalSavings,
    breakevenYear,
    breakevenMonths,
    annualCO2SavedKg,
    yearlyData,
  }
}
