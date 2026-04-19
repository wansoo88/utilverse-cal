'use client'

import { useState, useMemo } from 'react'
import electricityRatesRaw from '@/data/electricity-rates.json'
import gasPricesRaw from '@/data/gas-prices.json'
import evModels from '@/data/ev-models.json'
import type { EVModel } from '@/lib/ev/types'
import { calculateTCO } from '@/lib/ev/tco-calculations'
import { TCOChart } from './tco-chart'

interface SubRegion { code: string; name: string; rate: number }
interface ElecEntry {
  name?: string; rate?: number; currency: string; symbol: string
  distanceUnit: string; defaultMonthlyDistance: number; dcFastRate: number
  states?: SubRegion[]; provinces?: SubRegion[]; cities?: SubRegion[]
}
interface GasSubRegion { code: string; price: number }
interface GasEntry {
  unit: string; price?: number
  states?: GasSubRegion[]; provinces?: GasSubRegion[]; cities?: GasSubRegion[]
}

const elecData = electricityRatesRaw as unknown as Record<string, ElecEntry>
const gasData = gasPricesRaw as unknown as Record<string, GasEntry>
const allModels = evModels as unknown as EVModel[]

const REGION_NAMES: Record<string, string> = {
  us: 'United States', gb: 'United Kingdom', de: 'Germany',
  no: 'Norway', nl: 'Netherlands', fr: 'France',
  cn: 'China', au: 'Australia', ca: 'Canada',
}

const GAS_CARS = [
  { id: 'toyota-camry',    name: 'Toyota Camry',     mpg: 32 },
  { id: 'honda-accord',    name: 'Honda Accord',      mpg: 33 },
  { id: 'toyota-rav4',     name: 'Toyota RAV4',       mpg: 30 },
  { id: 'honda-crv',       name: 'Honda CR-V',        mpg: 30 },
  { id: 'ford-f150',       name: 'Ford F-150',        mpg: 20 },
  { id: 'chevy-silverado', name: 'Chevy Silverado',   mpg: 20 },
  { id: 'toyota-corolla',  name: 'Toyota Corolla',    mpg: 35 },
  { id: 'honda-civic',     name: 'Honda Civic',       mpg: 36 },
  { id: 'bmw-3series',     name: 'BMW 3 Series',      mpg: 28 },
  { id: 'mercedes-c',      name: 'Mercedes C-Class',  mpg: 27 },
]

const YEARS_OPTIONS = [5, 10] as const
const KM_PER_MILE = 1.60934

function getSubRegions(code: string): SubRegion[] {
  const e = elecData[code]
  return e?.states ?? e?.provinces ?? e?.cities ?? []
}

function getElecRate(regionCode: string, subCode: string): number {
  const e = elecData[regionCode]
  if (!e) return 0.13
  const subs = getSubRegions(regionCode)
  return subs.find((s) => s.code === subCode)?.rate ?? e.rate ?? 0.13
}

function getGasPrice(regionCode: string, subCode: string): number {
  const g = gasData[regionCode]
  if (!g) return 3.5
  const subs: GasSubRegion[] = g.states ?? g.provinces ?? g.cities ?? []
  return subs.find((s) => s.code === subCode)?.price ?? g.price ?? 3.5
}

export function TCOCalculator() {
  const [regionCode, setRegionCode] = useState('us')
  const [subRegion, setSubRegion] = useState('CA')
  const [annualMiles, setAnnualMiles] = useState(12000)
  const [distanceUnit, setDistanceUnit] = useState<'miles' | 'km'>('miles')
  const [years, setYears] = useState<5 | 10>(5)
  const [evId, setEvId] = useState(allModels[0]?.id ?? '')
  const [evPrice, setEvPrice] = useState(40000)
  const [taxCredit, setTaxCredit] = useState(7500)
  const [evMaintenance, setEvMaintenance] = useState(800)
  const [evInsurance, setEvInsurance] = useState(1800)
  const [gasCarId, setGasCarId] = useState('toyota-camry')
  const [gasPrice, setGasPrice] = useState(28000)
  const [gasMaintenance, setGasMaintenance] = useState(1500)
  const [gasInsurance, setGasInsurance] = useState(1600)

  const elecEntry = elecData[regionCode]
  const subRegions = getSubRegions(regionCode)
  const currencySymbol = elecEntry?.symbol ?? '$'
  const electricityRate = getElecRate(regionCode, subRegion)
  const rawGasPrice = getGasPrice(regionCode, subRegion)
  const gasPricePerGallon =
    gasData[regionCode]?.unit === 'per_liter' ? rawGasPrice * 3.785 : rawGasPrice
  const selectedEV = allModels.find((m) => m.id === evId) ?? allModels[0]
  const selectedGasCar = GAS_CARS.find((c) => c.id === gasCarId) ?? GAS_CARS[0]

  const result = useMemo(
    () =>
      calculateTCO({
        evEfficiencyMiPerKwh: selectedEV?.epaEfficiency ?? 3.5,
        electricityRatePerKwh: electricityRate,
        evPurchasePrice: evPrice,
        evAnnualMaintenance: evMaintenance,
        evInsurance,
        evTaxCredit: taxCredit,
        gasMpg: selectedGasCar.mpg,
        gasPricePerGallon,
        gasPurchasePrice: gasPrice,
        gasAnnualMaintenance: gasMaintenance,
        gasInsurance,
        annualMiles,
        years,
        distanceUnit: distanceUnit as 'miles' | 'km',
      }),
    [
      selectedEV, electricityRate, evPrice, evMaintenance, evInsurance, taxCredit,
      selectedGasCar, gasPricePerGallon, gasPrice, gasMaintenance, gasInsurance,
      annualMiles, years, distanceUnit,
    ],
  )

  const fmt = (n: number) =>
    `${currencySymbol}${Math.abs(n).toLocaleString('en-US', { maximumFractionDigits: 0 })}`

  const handleRegionChange = (code: string) => {
    setRegionCode(code)
    setSubRegion(getSubRegions(code)[0]?.code ?? '')
    const unit = (elecData[code]?.distanceUnit ?? 'miles') as 'miles' | 'km'
    setDistanceUnit(unit)
  }

  const handleUnitToggle = (newUnit: 'miles' | 'km') => {
    if (newUnit === distanceUnit) return
    setAnnualMiles((prev) =>
      newUnit === 'km'
        ? Math.round(prev * KM_PER_MILE)
        : Math.round(prev / KM_PER_MILE),
    )
    setDistanceUnit(newUnit)
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-base font-semibold text-foreground mb-4">Settings</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Region</label>
            <select value={regionCode} onChange={(e) => handleRegionChange(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm">
              {Object.keys(REGION_NAMES).map((r) => (
                <option key={r} value={r}>{REGION_NAMES[r]}</option>
              ))}
            </select>
          </div>
          {subRegions.length > 0 && (
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                {regionCode === 'us' ? 'State' : regionCode === 'ca' ? 'Province' : 'City'}
              </label>
              <select value={subRegion} onChange={(e) => setSubRegion(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm">
                {subRegions.map((s) => (
                  <option key={s.code} value={s.code}>{s.name}</option>
                ))}
              </select>
            </div>
          )}
          <div>
            <div className="flex items-center justify-between mb-1.5 gap-2">
              <label className="block text-xs font-medium text-muted-foreground">
                Annual Distance ({distanceUnit})
              </label>
              <div className="inline-flex rounded-md border border-border bg-background p-0.5">
                {(['miles', 'km'] as const).map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => handleUnitToggle(u)}
                    className={`px-2 py-0.5 text-[11px] font-medium rounded transition-colors ${
                      distanceUnit === u
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                    aria-pressed={distanceUnit === u}
                    aria-label={`Switch to ${u}`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>
            <input type="number" value={annualMiles} onChange={(e) => setAnnualMiles(Number(e.target.value))}
              min={distanceUnit === 'miles' ? 1000 : 1600}
              max={distanceUnit === 'miles' ? 50000 : 80000}
              step={distanceUnit === 'miles' ? 1000 : 1000}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Period</label>
            <div className="flex gap-2">
              {YEARS_OPTIONS.map((y) => (
                <button key={y} onClick={() => setYears(y)}
                  className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                    years === y ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:bg-muted'
                  }`}>
                  {y}yr
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-primary/30 bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">EV</span>
            <h2 className="text-base font-semibold text-foreground">Electric Vehicle</h2>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Model</label>
              <select value={evId} onChange={(e) => setEvId(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm">
                {allModels.filter((m) => m.regions.includes(regionCode)).map((m) => (
                  <option key={m.id} value={m.id}>{m.brand} {m.name}</option>
                ))}
              </select>
              {selectedEV && <p className="mt-1 text-xs text-muted-foreground">{selectedEV.epaEfficiency} mi/kWh · {selectedEV.batteryCapacity} kWh</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: `Purchase Price (${currencySymbol})`, val: evPrice, set: setEvPrice },
                { label: `Tax Credit (${currencySymbol})`, val: taxCredit, set: setTaxCredit },
                { label: `Maintenance/yr (${currencySymbol})`, val: evMaintenance, set: setEvMaintenance },
                { label: `Insurance/yr (${currencySymbol})`, val: evInsurance, set: setEvInsurance },
              ].map(({ label, val, set }) => (
                <div key={label}>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">{label}</label>
                  <input type="number" value={val} onChange={(e) => set(Number(e.target.value))}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-destructive/30 bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-destructive/10 text-destructive text-xs font-bold">⛽</span>
            <h2 className="text-base font-semibold text-foreground">Gas Vehicle</h2>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Model</label>
              <select value={gasCarId} onChange={(e) => setGasCarId(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm">
                {GAS_CARS.map((c) => (
                  <option key={c.id} value={c.id}>{c.name} ({c.mpg} MPG)</option>
                ))}
              </select>
              <p className="mt-1 text-xs text-muted-foreground">{selectedGasCar.mpg} MPG · {fmt(gasPricePerGallon)}/gal</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Purchase Price ({currencySymbol})</label>
                <input type="number" value={gasPrice} onChange={(e) => setGasPrice(Number(e.target.value))}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Gas Price ({currencySymbol}/gal)</label>
                <input type="number" value={gasPricePerGallon.toFixed(2)} readOnly
                  className="w-full rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-muted-foreground cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Maintenance/yr ({currencySymbol})</label>
                <input type="number" value={gasMaintenance} onChange={(e) => setGasMaintenance(Number(e.target.value))}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Insurance/yr ({currencySymbol})</label>
                <input type="number" value={gasInsurance} onChange={(e) => setGasInsurance(Number(e.target.value))}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-base font-semibold text-foreground mb-5">{years}-Year Total Cost of Ownership</h2>
        <div className="grid gap-4 sm:grid-cols-3 mb-6">
          <div className="rounded-xl bg-muted/50 p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">EV Total ({years}yr)</p>
            <p className="text-2xl font-bold text-primary">{fmt(result.evTotal)}</p>
          </div>
          <div className="rounded-xl bg-muted/50 p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Gas Total ({years}yr)</p>
            <p className="text-2xl font-bold text-destructive">{fmt(result.gasTotal)}</p>
          </div>
          <div className={`rounded-xl p-4 text-center ${result.totalSavings >= 0 ? 'bg-secondary/10' : 'bg-destructive/10'}`}>
            <p className="text-xs text-muted-foreground mb-1">{result.totalSavings >= 0 ? 'EV Saves' : 'EV Costs More'}</p>
            <p className={`text-2xl font-bold ${result.totalSavings >= 0 ? 'text-secondary' : 'text-destructive'}`}>
              {fmt(Math.abs(result.totalSavings))}
            </p>
          </div>
        </div>

        <div className="mb-6 rounded-xl border border-border bg-muted/30 p-4">
          {result.breakevenMonths === null ? (
            <p className="text-sm text-muted-foreground">⚠️ EV does not break even within {years} years at these settings.</p>
          ) : result.breakevenMonths === 0 ? (
            <p className="text-sm text-secondary font-medium">✅ EV is cheaper from day one (lower net purchase price after tax credit).</p>
          ) : (
            <p className="text-sm text-foreground">
              📅 Breakeven:{' '}
              <span className="font-semibold text-secondary">
                {result.breakevenYear} year{result.breakevenYear !== 1 ? 's' : ''}
                {(result.breakevenMonths ?? 0) % 12 > 0 ? ` ${(result.breakevenMonths ?? 0) % 12} months` : ''}
              </span>{' '}
              — after that, every mile saves money.
            </p>
          )}
        </div>

        <TCOChart data={result.yearlyData} currencySymbol={currencySymbol} breakevenYear={result.breakevenYear} />

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-border p-4">
            <p className="text-xs font-medium text-muted-foreground mb-2">Annual Costs — EV</p>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Electricity</span><span>{fmt(result.evAnnualFuel)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Maintenance</span><span>{fmt(evMaintenance)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Insurance</span><span>{fmt(evInsurance)}</span></div>
              <div className="flex justify-between border-t border-border pt-1.5 font-medium"><span>Total/year</span><span className="text-primary">{fmt(result.evAnnualTotal)}</span></div>
            </div>
          </div>
          <div className="rounded-xl border border-border p-4">
            <p className="text-xs font-medium text-muted-foreground mb-2">Annual Costs — Gas</p>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Gasoline</span><span>{fmt(result.gasAnnualFuel)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Maintenance</span><span>{fmt(gasMaintenance)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Insurance</span><span>{fmt(gasInsurance)}</span></div>
              <div className="flex justify-between border-t border-border pt-1.5 font-medium"><span>Total/year</span><span className="text-destructive">{fmt(result.gasAnnualTotal)}</span></div>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-secondary/30 bg-secondary/5 p-4">
          <p className="text-sm text-foreground">
            🌱 By driving an EV, you avoid approximately{' '}
            <span className="font-semibold text-secondary">
              {result.annualCO2SavedKg >= 1000 ? `${(result.annualCO2SavedKg / 1000).toFixed(1)} tons` : `${Math.round(result.annualCO2SavedKg)} kg`}
            </span>{' '}
            of CO₂ per year — equivalent to planting{' '}
            <span className="font-semibold text-secondary">{Math.round(result.annualCO2SavedKg / 21.77)} trees</span>.
          </p>
        </div>
      </div>
    </div>
  )
}
