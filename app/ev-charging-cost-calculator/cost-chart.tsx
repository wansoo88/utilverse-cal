'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { formatCurrency } from '@/lib/ev/calculations'
import type { CalculationResult } from '@/lib/ev/types'
import type { EVModel } from '@/lib/ev/types'

interface Props {
  result: CalculationResult
  currencySymbol: string
  vehicle: EVModel
}

export function CostChart({ result, currencySymbol, vehicle }: Props) {
  const data = [
    {
      period: 'Monthly',
      EV: parseFloat(result.monthlyCost.toFixed(2)),
      Gas: parseFloat(result.monthlyGasCost.toFixed(2)),
    },
    {
      period: 'Annual',
      EV: parseFloat(result.annualCost.toFixed(2)),
      Gas: parseFloat(result.annualGasCost.toFixed(2)),
    },
    {
      period: '5-Year',
      EV: parseFloat(result.fiveYearCost.toFixed(2)),
      Gas: parseFloat((result.annualGasCost * 5).toFixed(2)),
    },
  ]

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <p className="text-sm font-medium text-foreground mb-1">EV vs Gas Cost Comparison</p>
      <p className="text-xs text-muted-foreground mb-5">
        {vehicle.brand} {vehicle.name} vs {vehicle.gasEquivalent}
      </p>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="period" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
          <YAxis
            tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
            tickFormatter={(v) => `${currencySymbol}${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
          />
          <Tooltip
            formatter={(value) => formatCurrency(Number(value), currencySymbol)}
            contentStyle={{
              background: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              fontSize: '13px',
            }}
          />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
          <Bar dataKey="EV" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Gas" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
