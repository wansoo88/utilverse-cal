import type { PrintCostInput, PrintCostResult } from './types'

// Assume printer lifespan of 2000 hours for depreciation
const PRINTER_LIFESPAN_HOURS = 2000

export function calculatePrintCost(input: PrintCostInput): PrintCostResult {
  const {
    filamentPricePerKg,
    modelWeightG,
    printTimeHours,
    printerPriceUsd,
    electricityRate,
    printerWattage,
    failureMarginPct,
  } = input

  // Material cost
  const materialCost = (modelWeightG / 1000) * filamentPricePerKg

  // Electricity cost
  const electricityCost = (printerWattage / 1000) * printTimeHours * electricityRate

  // Printer depreciation per print
  const depreciationCost = (printerPriceUsd / PRINTER_LIFESPAN_HOURS) * printTimeHours

  // Subtotal before failure margin
  const subtotal = materialCost + electricityCost + depreciationCost

  // Failure margin
  const failureMarginCost = subtotal * (failureMarginPct / 100)

  const totalCost = subtotal + failureMarginCost

  // Suggested selling prices
  const suggestedPrice30 = totalCost * 1.3
  const suggestedPrice50 = totalCost * 1.5
  const suggestedPrice100 = totalCost * 2.0

  // Breakdown percentages
  const breakdown = {
    material: totalCost > 0 ? (materialCost / totalCost) * 100 : 0,
    electricity: totalCost > 0 ? (electricityCost / totalCost) * 100 : 0,
    depreciation: totalCost > 0 ? (depreciationCost / totalCost) * 100 : 0,
    failureMargin: totalCost > 0 ? (failureMarginCost / totalCost) * 100 : 0,
  }

  return {
    materialCost,
    electricityCost,
    depreciationCost,
    failureMarginCost,
    totalCost,
    suggestedPrice30,
    suggestedPrice50,
    suggestedPrice100,
    breakdown,
  }
}

export function formatUsd(amount: number): string {
  return `$${amount.toFixed(2)}`
}
