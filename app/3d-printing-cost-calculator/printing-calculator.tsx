'use client'

import { useState, useMemo } from 'react'
import filaments from '@/data/filaments.json'
import { calculatePrintCost, formatUsd } from '@/lib/printing/calculations'
import type { FilamentType } from '@/lib/printing/types'
import { CostPieChart } from './cost-pie-chart'

export function PrintingCalculator() {
  const [filamentId, setFilamentId] = useState('pla')
  const [filamentPrice, setFilamentPrice] = useState(22)
  const [modelWeight, setModelWeight] = useState(50)
  const [printTime, setPrintTime] = useState(5)
  const [printerPrice, setPrinterPrice] = useState(300)
  const [electricityRate, setElectricityRate] = useState(0.16)
  const [printerWattage, setPrinterWattage] = useState(200)
  const [failureMargin, setFailureMargin] = useState(10)

  const filament = (filaments as FilamentType[]).find((f) => f.id === filamentId) ?? filaments[0]

  function handleFilamentChange(id: string) {
    setFilamentId(id)
    const f = (filaments as FilamentType[]).find((x) => x.id === id)
    if (f && id !== 'custom') setFilamentPrice(f.avgPricePerKg)
  }

  const result = useMemo(
    () =>
      calculatePrintCost({
        filament: filament as FilamentType,
        filamentPricePerKg: filamentPrice,
        modelWeightG: modelWeight,
        printTimeHours: printTime,
        printerPriceUsd: printerPrice,
        electricityRate,
        printerWattage,
        failureMarginPct: failureMargin,
      }),
    [filament, filamentPrice, modelWeight, printTime, printerPrice, electricityRate, printerWattage, failureMargin]
  )

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left: Material & Model */}
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Filament Type
              </label>
              <select
                value={filamentId}
                onChange={(e) => handleFilamentChange(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {(filaments as FilamentType[]).map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} (~${f.avgPricePerKg}/kg)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-foreground">
                  Filament Price
                </label>
                <div className="flex items-center gap-1">
                  <span className="text-sm text-muted-foreground">$</span>
                  <input
                    type="number"
                    value={filamentPrice}
                    onChange={(e) => setFilamentPrice(Math.max(1, Number(e.target.value)))}
                    className="w-16 rounded-lg border border-input bg-background px-2 py-1 text-sm text-right text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <span className="text-sm text-muted-foreground">/kg</span>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-foreground">
                  Model Weight
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={modelWeight}
                    onChange={(e) => setModelWeight(Math.max(1, Number(e.target.value)))}
                    className="w-20 rounded-lg border border-input bg-background px-2 py-1 text-sm text-right text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <span className="text-sm text-muted-foreground">g</span>
                </div>
              </div>
              <input
                type="range" min={1} max={1000} step={1} value={modelWeight}
                onChange={(e) => setModelWeight(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>1g</span><span>1,000g</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-foreground">
                  Print Time
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number" step={0.5} value={printTime}
                    onChange={(e) => setPrintTime(Math.max(0.1, Number(e.target.value)))}
                    className="w-16 rounded-lg border border-input bg-background px-2 py-1 text-sm text-right text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <span className="text-sm text-muted-foreground">hours</span>
                </div>
              </div>
              <input
                type="range" min={0.5} max={72} step={0.5} value={printTime}
                onChange={(e) => setPrintTime(Number(e.target.value))}
                className="w-full accent-primary"
              />
            </div>
          </div>

          {/* Right: Printer & Costs */}
          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-foreground">
                  Printer Price
                </label>
                <div className="flex items-center gap-1">
                  <span className="text-sm text-muted-foreground">$</span>
                  <input
                    type="number" value={printerPrice}
                    onChange={(e) => setPrinterPrice(Math.max(0, Number(e.target.value)))}
                    className="w-20 rounded-lg border border-input bg-background px-2 py-1 text-sm text-right text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
              <input
                type="range" min={100} max={5000} step={50} value={printerPrice}
                onChange={(e) => setPrinterPrice(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Depreciated over 2,000 print hours
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-foreground">
                  Printer Wattage
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number" value={printerWattage}
                    onChange={(e) => setPrinterWattage(Math.max(10, Number(e.target.value)))}
                    className="w-16 rounded-lg border border-input bg-background px-2 py-1 text-sm text-right text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <span className="text-sm text-muted-foreground">W</span>
                </div>
              </div>
              <input
                type="range" min={50} max={500} step={10} value={printerWattage}
                onChange={(e) => setPrinterWattage(Number(e.target.value))}
                className="w-full accent-primary"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-foreground">
                  Electricity Rate
                </label>
                <div className="flex items-center gap-1">
                  <span className="text-sm text-muted-foreground">$</span>
                  <input
                    type="number" step={0.01} value={electricityRate}
                    onChange={(e) => setElectricityRate(Math.max(0.01, Number(e.target.value)))}
                    className="w-16 rounded-lg border border-input bg-background px-2 py-1 text-sm text-right text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <span className="text-sm text-muted-foreground">/kWh</span>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-foreground">
                  Failure Margin
                </label>
                <span className="text-sm font-medium text-foreground">
                  {failureMargin}%
                </span>
              </div>
              <input
                type="range" min={0} max={30} step={1} value={failureMargin}
                onChange={(e) => setFailureMargin(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>0% (optimistic)</span><span>30% (safe)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <p className="text-sm text-muted-foreground">Total Print Cost</p>
          <p className="mt-1 text-4xl font-bold gradient-text">
            {formatUsd(result.totalCost)}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            {modelWeight}g of {filament.name} · {printTime}h print time
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Material</p>
          <p className="mt-1 text-2xl font-bold text-foreground">
            {formatUsd(result.materialCost)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {result.breakdown.material.toFixed(0)}% of total
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Electricity</p>
          <p className="mt-1 text-2xl font-bold text-foreground">
            {formatUsd(result.electricityCost)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {result.breakdown.electricity.toFixed(0)}% of total
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Depreciation</p>
          <p className="mt-1 text-2xl font-bold text-foreground">
            {formatUsd(result.depreciationCost)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {result.breakdown.depreciation.toFixed(0)}% of total
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Failure Margin</p>
          <p className="mt-1 text-2xl font-bold text-foreground">
            {formatUsd(result.failureMarginCost)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {failureMargin}% buffer
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Sell at 50% margin</p>
          <p className="mt-1 text-2xl font-bold text-secondary">
            {formatUsd(result.suggestedPrice50)}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Sell at 100% margin</p>
          <p className="mt-1 text-2xl font-bold text-secondary">
            {formatUsd(result.suggestedPrice100)}
          </p>
        </div>
      </div>

      {/* Pie chart */}
      <CostPieChart result={result} />
    </div>
  )
}
