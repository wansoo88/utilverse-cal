'use client'

import { useState } from 'react'

interface UnitConversion {
  slug: string; from: string; to: string; fromUnit: string; toUnit: string
  factor: number; category: string
  formula?: string; multiply?: number; add?: number; subtract?: number; divide?: number
}

function doConvert(conv: UnitConversion, val: number): number {
  if (conv.formula === 'multiply_add') return val * (conv.multiply ?? 1) + (conv.add ?? 0)
  if (conv.formula === 'subtract_divide') return (val - (conv.subtract ?? 0)) / (conv.divide ?? 1)
  return val * conv.factor
}

export function UnitConverterWidget({ conversion }: { conversion: UnitConversion }) {
  const [value, setValue] = useState(1)
  const result = doConvert(conversion, value)

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr] items-end">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            {conversion.from} ({conversion.fromUnit})
          </label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            className="w-full rounded-lg border border-input bg-background px-4 py-3 text-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex items-center justify-center pb-1">
          <span className="text-xl text-muted-foreground">=</span>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            {conversion.to} ({conversion.toUnit})
          </label>
          <div className="w-full rounded-lg border border-border bg-muted/30 px-4 py-3 text-lg font-bold gradient-text">
            {result.toLocaleString('en-US', { maximumFractionDigits: 6 })}
          </div>
        </div>
      </div>
    </div>
  )
}
