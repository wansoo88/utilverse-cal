export type CookingMethod =
  | 'conventional_oven'
  | 'air_fryer'
  | 'convection_oven'
  | 'instant_pot'
  | 'slow_cooker'

export interface ConversionResult {
  temperature: number
  tempUnit: 'F' | 'C'
  time: number // minutes
  timeLabel: string
  tips: string[]
}

export interface FoodPreset {
  id: string
  name: string
  category: string
  icon: string
  airFryer: { tempF: number; timeMin: number }
  conventionalOven: { tempF: number; timeMin: number }
  convectionOven: { tempF: number; timeMin: number }
  instantPot: { timeMin: number; mode: string } | null
  slowCooker: { timeMin: number; setting: 'low' | 'high' } | null
  tips: string[]
}
