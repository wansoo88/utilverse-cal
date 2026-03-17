import type { CookingMethod, ConversionResult } from './types'

// Conversion factors relative to conventional oven
// Temperature adjustments (°F)
const TEMP_ADJUSTMENTS: Record<string, number> = {
  'conventional_oven->air_fryer': -25,
  'conventional_oven->convection_oven': -25,
  'air_fryer->conventional_oven': 25,
  'air_fryer->convection_oven': 0,
  'convection_oven->conventional_oven': 25,
  'convection_oven->air_fryer': 0,
}

// Time multipliers (from -> to)
const TIME_MULTIPLIERS: Record<string, number> = {
  'conventional_oven->air_fryer': 0.8,
  'conventional_oven->convection_oven': 0.85,
  'air_fryer->conventional_oven': 1.25,
  'air_fryer->convection_oven': 1.05,
  'convection_oven->conventional_oven': 1.18,
  'convection_oven->air_fryer': 0.95,
}

export function fToC(f: number): number {
  return Math.round(((f - 32) * 5) / 9)
}

export function cToF(c: number): number {
  return Math.round((c * 9) / 5 + 32)
}

export function convert(
  fromMethod: CookingMethod,
  toMethod: CookingMethod,
  tempF: number,
  timeMin: number,
  tempUnit: 'F' | 'C'
): ConversionResult | null {
  // Same method
  if (fromMethod === toMethod) {
    return {
      temperature: tempUnit === 'C' ? fToC(tempF) : tempF,
      tempUnit,
      time: timeMin,
      timeLabel: formatTime(timeMin),
      tips: [],
    }
  }

  // Instant Pot / Slow Cooker special handling
  if (toMethod === 'instant_pot') {
    return convertToInstantPot(tempF, timeMin, tempUnit)
  }
  if (toMethod === 'slow_cooker') {
    return convertToSlowCooker(tempF, timeMin, tempUnit)
  }
  if (fromMethod === 'instant_pot') {
    return convertFromInstantPot(toMethod, timeMin, tempUnit)
  }
  if (fromMethod === 'slow_cooker') {
    return convertFromSlowCooker(toMethod, timeMin, tempUnit)
  }

  // Standard oven/air fryer/convection conversions
  const key = `${fromMethod}->${toMethod}`
  const tempAdj = TEMP_ADJUSTMENTS[key] ?? 0
  const timeMult = TIME_MULTIPLIERS[key] ?? 1

  const newTempF = tempF + tempAdj
  const newTime = Math.round(timeMin * timeMult)

  const tips = getTips(fromMethod, toMethod)

  return {
    temperature: tempUnit === 'C' ? fToC(newTempF) : newTempF,
    tempUnit,
    time: newTime,
    timeLabel: formatTime(newTime),
    tips,
  }
}

function convertToInstantPot(
  _tempF: number,
  timeMin: number,
  tempUnit: 'F' | 'C'
): ConversionResult {
  // Instant Pot pressure cook: roughly 1/3 of oven time
  const newTime = Math.max(5, Math.round(timeMin * 0.33))
  return {
    temperature: tempUnit === 'C' ? fToC(250) : 250,
    tempUnit,
    time: newTime,
    timeLabel: formatTime(newTime) + ' (Pressure Cook)',
    tips: [
      'Use the Pressure Cook / Manual setting on High.',
      'Add at least 1 cup of liquid for the pot to pressurize.',
      'Allow 10-15 minutes for the pot to come to pressure before cooking starts.',
      'Use natural release for meats, quick release for vegetables.',
    ],
  }
}

function convertToSlowCooker(
  _tempF: number,
  timeMin: number,
  tempUnit: 'F' | 'C'
): ConversionResult {
  // Slow cooker on High: roughly 2x oven time; on Low: roughly 4x
  const highTime = Math.round(timeMin * 2)
  return {
    temperature: tempUnit === 'C' ? fToC(200) : 200,
    tempUnit,
    time: highTime,
    timeLabel: formatTime(highTime) + ' on High',
    tips: [
      `Or cook for ${formatTime(highTime * 2)} on Low setting.`,
      'Do not lift the lid during cooking — each peek adds 15-20 minutes.',
      'Add dairy and fresh herbs in the last 30 minutes.',
      'Reduce liquid by about 1/3 compared to oven recipes.',
    ],
  }
}

function convertFromInstantPot(
  toMethod: CookingMethod,
  timeMin: number,
  tempUnit: 'F' | 'C'
): ConversionResult {
  // Reverse: IP time * 3 ≈ oven time
  const ovenTime = Math.round(timeMin * 3)
  let tempF = 350
  let finalTime = ovenTime

  if (toMethod === 'air_fryer') {
    tempF = 325
    finalTime = Math.round(ovenTime * 0.8)
  } else if (toMethod === 'convection_oven') {
    tempF = 325
    finalTime = Math.round(ovenTime * 0.85)
  }

  return {
    temperature: tempUnit === 'C' ? fToC(tempF) : tempF,
    tempUnit,
    time: finalTime,
    timeLabel: formatTime(finalTime),
    tips: getTips('instant_pot', toMethod),
  }
}

function convertFromSlowCooker(
  toMethod: CookingMethod,
  timeMin: number,
  tempUnit: 'F' | 'C'
): ConversionResult {
  // Reverse: slow cooker High time / 2 ≈ oven time
  const ovenTime = Math.round(timeMin / 2)
  let tempF = 350
  let finalTime = ovenTime

  if (toMethod === 'air_fryer') {
    tempF = 325
    finalTime = Math.round(ovenTime * 0.8)
  } else if (toMethod === 'convection_oven') {
    tempF = 325
    finalTime = Math.round(ovenTime * 0.85)
  }

  return {
    temperature: tempUnit === 'C' ? fToC(tempF) : tempF,
    tempUnit,
    time: finalTime,
    timeLabel: formatTime(finalTime),
    tips: getTips('slow_cooker', toMethod),
  }
}

function getTips(from: CookingMethod, to: CookingMethod): string[] {
  const tips: string[] = []

  if (to === 'air_fryer') {
    tips.push('Preheat the air fryer for 3-5 minutes before cooking.')
    tips.push('Do not overcrowd the basket — leave space for air circulation.')
    tips.push('Shake the basket or flip food halfway through cooking.')
    tips.push('Lightly spray food with oil for extra crispiness.')
  }

  if (from === 'air_fryer' && to === 'conventional_oven') {
    tips.push('Place food on a wire rack over a baking sheet for better air circulation.')
    tips.push('You may need to broil for 2-3 minutes at the end for crispiness.')
  }

  if (to === 'convection_oven') {
    tips.push('Use a low-sided pan for better air circulation.')
    tips.push('Check food 5-10 minutes before the timer — convection can cook faster than expected.')
  }

  return tips
}

export function formatTime(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (m === 0) return `${h} hr`
  return `${h} hr ${m} min`
}
