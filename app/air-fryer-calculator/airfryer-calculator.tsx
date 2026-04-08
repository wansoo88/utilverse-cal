'use client'

import { useState, useMemo } from 'react'
import presets from '@/data/food-presets.json'
import { convert, fToC, cToF, formatTime } from '@/lib/airfryer/conversions'
import type { CookingMethod, FoodPreset } from '@/lib/airfryer/types'

const METHODS: { code: CookingMethod; label: string; icon: string }[] = [
  { code: 'conventional_oven', label: 'Oven', icon: '🔥' },
  { code: 'air_fryer', label: 'Air Fryer', icon: '💨' },
  { code: 'convection_oven', label: 'Convection', icon: '🌀' },
  { code: 'instant_pot', label: 'Instant Pot', icon: '⚡' },
  { code: 'slow_cooker', label: 'Slow Cooker', icon: '🍲' },
]

const CATEGORIES = [
  'All',
  ...Array.from(new Set((presets as FoodPreset[]).map((p) => p.category))),
]

export function AirFryerCalculator() {
  const [fromMethod, setFromMethod] = useState<CookingMethod>('conventional_oven')
  const [toMethod, setToMethod] = useState<CookingMethod>('air_fryer')
  const [tempF, setTempF] = useState(400)
  const [timeMin, setTimeMin] = useState(30)
  const [tempUnit, setTempUnit] = useState<'F' | 'C'>('F')
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null)
  const [categoryFilter, setCategoryFilter] = useState('All')

  const filteredPresets = useMemo(() => {
    const all = presets as FoodPreset[]
    if (categoryFilter === 'All') return all
    return all.filter((p) => p.category === categoryFilter)
  }, [categoryFilter])

  const result = useMemo(
    () => convert(fromMethod, toMethod, tempF, timeMin, tempUnit),
    [fromMethod, toMethod, tempF, timeMin, tempUnit]
  )

  function handlePresetSelect(preset: FoodPreset) {
    setSelectedPreset(preset.id)
    setFromMethod('conventional_oven')
    setToMethod('air_fryer')
    setTempF(preset.conventionalOven.tempF)
    setTimeMin(preset.conventionalOven.timeMin)
    setTempUnit('F')
  }

  function swapMethods() {
    const tmp = fromMethod
    setFromMethod(toMethod)
    setToMethod(tmp)
  }

  function handleTempChange(val: number) {
    if (tempUnit === 'C') {
      setTempF(cToF(val))
    } else {
      setTempF(val)
    }
  }

  const displayTemp = tempUnit === 'C' ? fToC(tempF) : tempF

  return (
    <div className="space-y-6">
      {/* Presets */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <p className="text-sm font-medium text-foreground mb-3">
          Quick presets
        </p>
        <div className="flex flex-wrap gap-1.5 mb-3 overflow-x-auto pb-0.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`shrink-0 rounded-md border px-2.5 py-1.5 text-xs transition-colors ${
                categoryFilter === cat
                  ? 'border-primary bg-primary/10 text-primary font-medium'
                  : 'border-border text-muted-foreground hover:border-primary/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
          {filteredPresets.map((p) => (
            <button
              key={p.id}
              onClick={() => handlePresetSelect(p)}
              className={`flex items-center gap-2 rounded-lg border p-2.5 text-left text-sm transition-colors ${
                selectedPreset === p.id
                  ? 'border-primary bg-primary/10 text-primary font-medium'
                  : 'border-border bg-background text-foreground hover:border-primary/50'
              }`}
            >
              <span className="text-lg">{p.icon}</span>
              <span className="truncate">{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Converter */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto_1fr]">
          {/* From */}
          <div className="space-y-4">
            <p className="text-sm font-medium text-foreground">Convert from</p>
            <div className="grid grid-cols-2 gap-1.5 sm:flex sm:flex-wrap">
              {METHODS.map((m) => (
                <button
                  key={m.code}
                  onClick={() => setFromMethod(m.code)}
                  className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 sm:py-1.5 text-sm transition-colors ${
                    fromMethod === m.code
                      ? 'border-primary bg-primary/10 text-primary font-medium'
                      : 'border-border text-muted-foreground hover:border-primary/50'
                  }`}
                >
                  <span>{m.icon}</span> {m.label}
                </button>
              ))}
            </div>

            {/* Temperature input (not for IP/SC) */}
            {fromMethod !== 'instant_pot' && fromMethod !== 'slow_cooker' && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-foreground">
                    Temperature
                  </label>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setTempUnit('F')}
                      className={`rounded px-2 py-0.5 text-xs ${
                        tempUnit === 'F'
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      °F
                    </button>
                    <button
                      onClick={() => setTempUnit('C')}
                      className={`rounded px-2 py-0.5 text-xs ${
                        tempUnit === 'C'
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      °C
                    </button>
                  </div>
                </div>
                <input
                  type="number"
                  value={displayTemp}
                  onChange={(e) => handleTempChange(Number(e.target.value))}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <input
                  type="range"
                  min={tempUnit === 'F' ? 200 : 90}
                  max={tempUnit === 'F' ? 500 : 260}
                  step={5}
                  value={displayTemp}
                  onChange={(e) => handleTempChange(Number(e.target.value))}
                  className="w-full mt-2 accent-primary"
                />
              </div>
            )}

            {/* Time input */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Cooking Time
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={timeMin}
                  onChange={(e) =>
                    setTimeMin(Math.max(1, Math.min(1440, Number(e.target.value))))
                  }
                  className="w-24 rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <span className="text-sm text-muted-foreground">
                  minutes ({formatTime(timeMin)})
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={fromMethod === 'slow_cooker' ? 720 : 120}
                step={1}
                value={Math.min(
                  timeMin,
                  fromMethod === 'slow_cooker' ? 720 : 120
                )}
                onChange={(e) => setTimeMin(Number(e.target.value))}
                className="w-full mt-2 accent-primary"
              />
            </div>
          </div>

          {/* Swap button */}
          <div className="flex items-center justify-center lg:flex-col">
            <button
              onClick={swapMethods}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Swap conversion direction"
            >
              ⇄
            </button>
          </div>

          {/* To */}
          <div className="space-y-4">
            <p className="text-sm font-medium text-foreground">Convert to</p>
            <div className="grid grid-cols-2 gap-1.5 sm:flex sm:flex-wrap">
              {METHODS.map((m) => (
                <button
                  key={m.code}
                  onClick={() => setToMethod(m.code)}
                  className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 sm:py-1.5 text-sm transition-colors ${
                    toMethod === m.code
                      ? 'border-secondary bg-secondary/10 text-secondary font-medium'
                      : 'border-border text-muted-foreground hover:border-secondary/50'
                  }`}
                >
                  <span>{m.icon}</span> {m.label}
                </button>
              ))}
            </div>

            {/* Result */}
            {result && (
              <div className="rounded-xl border border-border bg-muted/30 p-5 space-y-3">
                {toMethod !== 'instant_pot' && toMethod !== 'slow_cooker' && (
                  <div>
                    <p className="text-xs text-muted-foreground">Temperature</p>
                    <p className="text-3xl font-bold gradient-text">
                      {result.temperature}°{result.tempUnit}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-muted-foreground">Cooking Time</p>
                  <p className="text-3xl font-bold text-foreground">
                    {result.timeLabel}
                  </p>
                </div>
                {result.tips.length > 0 && (
                  <div className="border-t border-border pt-3">
                    <p className="text-xs font-medium text-foreground mb-1.5">
                      Tips
                    </p>
                    <ul className="space-y-1">
                      {result.tips.map((tip, i) => (
                        <li
                          key={i}
                          className="text-xs text-muted-foreground flex gap-1.5"
                        >
                          <span className="shrink-0">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Comparison table */}
      {selectedPreset && (() => {
        const preset = (presets as FoodPreset[]).find(
          (p) => p.id === selectedPreset
        )
        if (!preset) return null
        return (
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <p className="text-sm font-medium text-foreground mb-4">
              {preset.icon} {preset.name} — All cooking methods
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-2 pr-4 text-left text-xs font-medium text-muted-foreground">
                      Method
                    </th>
                    <th className="py-2 px-4 text-left text-xs font-medium text-muted-foreground">
                      Temp
                    </th>
                    <th className="py-2 px-4 text-left text-xs font-medium text-muted-foreground">
                      Time
                    </th>
                    <th className="py-2 pl-4 text-left text-xs font-medium text-muted-foreground">
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {preset.airFryer && (
                    <tr className="border-b border-border/50">
                      <td className="py-2.5 pr-4 font-medium">💨 Air Fryer</td>
                      <td className="py-2.5 px-4">
                        {tempUnit === 'C'
                          ? fToC(preset.airFryer.tempF)
                          : preset.airFryer.tempF}
                        °{tempUnit}
                      </td>
                      <td className="py-2.5 px-4">
                        {formatTime(preset.airFryer.timeMin)}
                      </td>
                      <td className="py-2.5 pl-4 text-muted-foreground">
                        Fastest dry-heat option
                      </td>
                    </tr>
                  )}
                  <tr className="border-b border-border/50">
                    <td className="py-2.5 pr-4 font-medium">🔥 Oven</td>
                    <td className="py-2.5 px-4">
                      {tempUnit === 'C'
                        ? fToC(preset.conventionalOven.tempF)
                        : preset.conventionalOven.tempF}
                      °{tempUnit}
                    </td>
                    <td className="py-2.5 px-4">
                      {formatTime(preset.conventionalOven.timeMin)}
                    </td>
                    <td className="py-2.5 pl-4 text-muted-foreground">
                      Standard method
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2.5 pr-4 font-medium">
                      🌀 Convection
                    </td>
                    <td className="py-2.5 px-4">
                      {tempUnit === 'C'
                        ? fToC(preset.convectionOven.tempF)
                        : preset.convectionOven.tempF}
                      °{tempUnit}
                    </td>
                    <td className="py-2.5 px-4">
                      {formatTime(preset.convectionOven.timeMin)}
                    </td>
                    <td className="py-2.5 pl-4 text-muted-foreground">
                      Good for larger batches
                    </td>
                  </tr>
                  {preset.instantPot && (
                    <tr className="border-b border-border/50">
                      <td className="py-2.5 pr-4 font-medium">
                        ⚡ Instant Pot
                      </td>
                      <td className="py-2.5 px-4 text-muted-foreground">—</td>
                      <td className="py-2.5 px-4">
                        {formatTime(preset.instantPot.timeMin)}
                      </td>
                      <td className="py-2.5 pl-4 text-muted-foreground">
                        {preset.instantPot.mode}
                      </td>
                    </tr>
                  )}
                  {preset.slowCooker && (
                    <tr>
                      <td className="py-2.5 pr-4 font-medium">
                        🍲 Slow Cooker
                      </td>
                      <td className="py-2.5 px-4 text-muted-foreground">—</td>
                      <td className="py-2.5 px-4">
                        {formatTime(preset.slowCooker.timeMin)}
                      </td>
                      <td className="py-2.5 pl-4 text-muted-foreground">
                        On {preset.slowCooker.setting}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {preset.tips.length > 0 && (
              <div className="mt-4 pt-3 border-t border-border">
                <p className="text-xs font-medium text-foreground mb-1">
                  Tips for {preset.name}
                </p>
                <ul className="space-y-0.5">
                  {preset.tips.map((tip, i) => (
                    <li
                      key={i}
                      className="text-xs text-muted-foreground flex gap-1.5"
                    >
                      <span>•</span> {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )
      })()}
    </div>
  )
}
