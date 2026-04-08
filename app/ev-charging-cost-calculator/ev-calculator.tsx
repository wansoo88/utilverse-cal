'use client'

import { useState, useMemo } from 'react'
import evModels from '@/data/ev-models.json'
import ratesData from '@/data/electricity-rates.json'
import gasPricesData from '@/data/gas-prices.json'
import { calculate, formatCurrency, formatCO2 } from '@/lib/ev/calculations'
import type { EVModel, RegionCode, ChargingRatio, CalculationInput } from '@/lib/ev/types'
import { CostChart } from './cost-chart'

// ─── Region config ────────────────────────────────────────────────────────────

const REGIONS: { code: RegionCode; flag: string; label: string }[] = [
  { code: 'us', flag: '🇺🇸', label: 'United States' },
  { code: 'gb', flag: '🇬🇧', label: 'United Kingdom' },
  { code: 'de', flag: '🇩🇪', label: 'Germany' },
  { code: 'no', flag: '🇳🇴', label: 'Norway' },
  { code: 'nl', flag: '🇳🇱', label: 'Netherlands' },
  { code: 'fr', flag: '🇫🇷', label: 'France' },
  { code: 'cn', flag: '🇨🇳', label: 'China' },
  { code: 'au', flag: '🇦🇺', label: 'Australia' },
  { code: 'ca', flag: '🇨🇦', label: 'Canada' },
]

const CHARGING_PRESETS: { label: string; ratio: ChargingRatio }[] = [
  { label: 'Mostly Home', ratio: { home: 0.9, publicL2: 0.05, dcFast: 0.05 } },
  { label: 'Mixed', ratio: { home: 0.6, publicL2: 0.2, dcFast: 0.2 } },
  { label: 'Mostly Public', ratio: { home: 0.2, publicL2: 0.4, dcFast: 0.4 } },
  { label: 'Apartment', ratio: { home: 0, publicL2: 0.5, dcFast: 0.5 } },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getRegionData(code: RegionCode) {
  return (ratesData as Record<string, unknown>)[code] as {
    rate?: number
    states?: { code: string; name: string; rate: number }[]
    cities?: { code: string; name: string; rate: number }[]
    provinces?: { code: string; name: string; rate: number }[]
    currency: string
    symbol: string
    distanceUnit: 'miles' | 'km'
    defaultMonthlyDistance: number
    dcFastRate: number
    publicL2Markup: number
  }
}

function getSubRegions(code: RegionCode) {
  const d = getRegionData(code)
  if ('states' in d && d.states) return d.states
  if ('cities' in d && d.cities) return d.cities
  if ('provinces' in d && d.provinces) return d.provinces
  return null
}

function getElectricityRate(regionCode: RegionCode, subCode: string): number {
  const d = getRegionData(regionCode)
  const subs = getSubRegions(regionCode)
  if (subs) {
    const found = subs.find((s) => s.code === subCode)
    return found?.rate ?? subs[0].rate
  }
  return (d as { rate: number }).rate
}

function getGasPrice(regionCode: RegionCode, subCode: string): { price: number; unit: 'per_gallon' | 'per_liter' } {
  const gp = (gasPricesData as Record<string, unknown>)[regionCode] as {
    unit: 'per_gallon' | 'per_liter'
    price?: number
    states?: { code: string; price: number }[]
    cities?: { code: string; price: number }[]
    provinces?: { code: string; price: number }[]
  }
  const unit = gp.unit
  if (gp.price !== undefined) return { price: gp.price, unit }
  const arr = gp.states ?? gp.cities ?? gp.provinces ?? []
  const found = arr.find((s) => s.code === subCode)
  return { price: found?.price ?? arr[0]?.price ?? 3.5, unit }
}

// ─── Component ────────────────────────────────────────────────────────────────

export function EVCalculator() {
  const [regionCode, setRegionCode] = useState<RegionCode>('us')
  const [subCode, setSubCode] = useState('CA')
  const [vehicleId, setVehicleId] = useState('tesla-model-3-lr')
  const [vehicleSearch, setVehicleSearch] = useState('')
  const [monthlyDistance, setMonthlyDistance] = useState(1000)
  const [chargingRatio, setChargingRatio] = useState<ChargingRatio>({ home: 0.8, publicL2: 0.1, dcFast: 0.1 })

  const regionData = getRegionData(regionCode)
  const subRegions = getSubRegions(regionCode)
  const distanceUnit = regionData.distanceUnit
  const currencySymbol = regionData.symbol

  const filteredVehicles = useMemo(() => {
    const byRegion = (evModels as EVModel[]).filter((v) => v.regions.includes(regionCode))
    if (!vehicleSearch) return byRegion
    const q = vehicleSearch.toLowerCase()
    return byRegion.filter(
      (v) => v.name.toLowerCase().includes(q) || v.brand.toLowerCase().includes(q)
    )
  }, [regionCode, vehicleSearch])

  const vehicle = (evModels as EVModel[]).find((v) => v.id === vehicleId) ?? (evModels as EVModel[])[0]

  const electricityRate = getElectricityRate(regionCode, subCode)
  const { price: gasPrice, unit: gasPriceUnit } = getGasPrice(regionCode, subCode)

  const input: CalculationInput = {
    vehicle,
    regionCode,
    subRegionCode: subCode,
    monthlyDistance,
    distanceUnit,
    chargingRatio,
    electricityRate,
    dcFastRate: regionData.dcFastRate,
    gasPrice,
    gasPriceUnit,
    currency: regionData.currency,
    currencySymbol,
  }

  const result = useMemo(() => calculate(input), [
    vehicle, regionCode, subCode, monthlyDistance, chargingRatio, electricityRate,
  ])

  function handleRegionChange(code: RegionCode) {
    setRegionCode(code)
    const d = getRegionData(code)
    setMonthlyDistance(d.defaultMonthlyDistance)
    const subs = getSubRegions(code)
    setSubCode(subs ? subs[0].code : '')
    // Reset vehicle to first available in region
    const first = (evModels as EVModel[]).find((v) => v.regions.includes(code))
    if (first) setVehicleId(first.id)
  }

  function handlePreset(ratio: ChargingRatio) {
    setChargingRatio(ratio)
  }

  function handleRatioChange(key: keyof ChargingRatio, val: number) {
    const others = Object.keys(chargingRatio).filter((k) => k !== key) as (keyof ChargingRatio)[]
    const remaining = 1 - val
    const otherSum = others.reduce((s, k) => s + chargingRatio[k], 0)
    const newRatio = { ...chargingRatio, [key]: val }
    if (otherSum > 0) {
      others.forEach((k) => {
        newRatio[k] = (chargingRatio[k] / otherSum) * remaining
      })
    } else {
      const share = remaining / others.length
      others.forEach((k) => { newRatio[k] = share })
    }
    setChargingRatio(newRatio)
  }

  const maxDistance = distanceUnit === 'miles' ? 5000 : 8000
  const minDistance = distanceUnit === 'miles' ? 100 : 160

  return (
    <div className="space-y-6">
      {/* ── Inputs card ── */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left column */}
          <div className="space-y-5">
            {/* Region */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Region</label>
              <div className="flex flex-wrap gap-2">
                {REGIONS.map((r) => (
                  <button
                    key={r.code}
                    onClick={() => handleRegionChange(r.code)}
                    className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 sm:py-1.5 text-sm transition-colors ${
                      regionCode === r.code
                        ? 'border-primary bg-primary/10 text-primary font-medium'
                        : 'border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground'
                    }`}
                  >
                    <span>{r.flag}</span>
                    <span className="hidden sm:inline">{r.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sub-region */}
            {subRegions && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {regionCode === 'cn' ? 'City' : regionCode === 'ca' ? 'Province' : regionCode === 'au' ? 'State' : 'State'}
                </label>
                <select
                  value={subCode}
                  onChange={(e) => setSubCode(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {subRegions.map((s) => (
                    <option key={s.code} value={s.code}>{s.name}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Vehicle */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Vehicle</label>
              <input
                type="text"
                placeholder="Search vehicles..."
                value={vehicleSearch}
                onChange={(e) => setVehicleSearch(e.target.value)}
                className="mb-2 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <select
                value={vehicleId}
                onChange={(e) => setVehicleId(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                size={4}
              >
                {filteredVehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.brand} {v.name} ({v.year})
                  </option>
                ))}
              </select>
              {vehicle && (
                <p className="mt-1.5 text-xs text-muted-foreground">
                  {vehicle.batteryCapacity} kWh battery · {vehicle.epaEfficiency} mi/kWh EPA
                </p>
              )}
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-5">
            {/* Monthly distance */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-foreground">
                  Monthly Distance
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={monthlyDistance}
                    onChange={(e) => setMonthlyDistance(Math.min(maxDistance, Math.max(minDistance, Number(e.target.value))))}
                    className="w-24 sm:w-20 rounded-lg border border-input bg-background px-2.5 sm:px-2 py-2 sm:py-1 text-sm text-right text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <span className="text-sm text-muted-foreground">{distanceUnit}</span>
                </div>
              </div>
              <input
                type="range"
                min={minDistance}
                max={maxDistance}
                step={distanceUnit === 'miles' ? 50 : 100}
                value={monthlyDistance}
                onChange={(e) => setMonthlyDistance(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>{minDistance.toLocaleString()} {distanceUnit}</span>
                <span>{maxDistance.toLocaleString()} {distanceUnit}</span>
              </div>
            </div>

            {/* Electricity rate */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-foreground">Electricity Rate</label>
                <div className="flex items-center gap-1">
                  <span className="text-sm text-muted-foreground">{currencySymbol}</span>
                  <span className="text-sm font-medium text-foreground">{electricityRate.toFixed(3)}</span>
                  <span className="text-sm text-muted-foreground">/kWh</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Based on {subRegions ? 'your selected region' : regionCode.toUpperCase()} average residential rate
              </p>
            </div>

            {/* Charging ratio */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Charging Habits</label>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {CHARGING_PRESETS.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => handlePreset(p.ratio)}
                    className="rounded-md border border-border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              {(['home', 'publicL2', 'dcFast'] as const).map((key) => {
                const labels = { home: 'Home L2', publicL2: 'Public L2', dcFast: 'DC Fast' }
                return (
                  <div key={key} className="mb-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">{labels[key]}</span>
                      <span className="font-medium text-foreground">{Math.round(chargingRatio[key] * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      step={5}
                      value={Math.round(chargingRatio[key] * 100)}
                      onChange={(e) => handleRatioChange(key, Number(e.target.value) / 100)}
                      className="w-full accent-primary"
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Results ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <p className="text-sm text-muted-foreground">Monthly Charging Cost</p>
          <p className="mt-1 text-4xl font-bold gradient-text">
            {formatCurrency(result.monthlyCost, currencySymbol)}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            {result.monthlyKwh.toFixed(0)} kWh/month
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Annual Cost</p>
          <p className="mt-1 text-2xl font-bold text-foreground">
            {formatCurrency(result.annualCost, currencySymbol)}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">5-Year Cost</p>
          <p className="mt-1 text-2xl font-bold text-foreground">
            {formatCurrency(result.fiveYearCost, currencySymbol)}
          </p>
        </div>
      </div>

      {/* Savings vs gas */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">vs Gas (monthly)</p>
          <p className={`mt-1 text-xl font-bold ${result.annualGasSavings > 0 ? 'text-secondary' : 'text-destructive'}`}>
            {result.annualGasSavings > 0 ? 'Save ' : 'Cost '}
            {formatCurrency(Math.abs(result.monthlyGasCost - result.monthlyCost), currencySymbol)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Gas: {formatCurrency(result.monthlyGasCost, currencySymbol)}/mo
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Annual Savings vs Gas</p>
          <p className={`mt-1 text-xl font-bold ${result.annualGasSavings > 0 ? 'text-secondary' : 'text-destructive'}`}>
            {result.annualGasSavings > 0 ? '+' : ''}{formatCurrency(result.annualGasSavings, currencySymbol)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            vs {vehicle.gasEquivalent}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">🌱 CO₂ Saved / Year</p>
          <p className="mt-1 text-xl font-bold text-secondary">
            {formatCO2(result.annualCO2SavedKg)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            ≈ {result.treesEquivalent} trees planted
          </p>
        </div>
      </div>

      {/* Cost breakdown bar */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <p className="text-sm font-medium text-foreground mb-4">Monthly Cost Breakdown</p>
        <div className="space-y-3">
          {[
            { key: 'home', label: 'Home L2', color: 'bg-primary', val: result.costBreakdown.home },
            { key: 'publicL2', label: 'Public L2', color: 'bg-secondary', val: result.costBreakdown.publicL2 },
            { key: 'dcFast', label: 'DC Fast', color: 'bg-orange-500', val: result.costBreakdown.dcFast },
          ].map((item) => (
            <div key={item.key}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">{item.label}</span>
                <span className="font-medium text-foreground">{formatCurrency(item.val, currencySymbol)}</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full ${item.color} transition-all duration-500`}
                  style={{ width: `${result.monthlyCost > 0 ? (item.val / result.monthlyCost) * 100 : 0}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chart */}
      <CostChart result={result} currencySymbol={currencySymbol} vehicle={vehicle} />
    </div>
  )
}
