'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { formatUsd } from '@/lib/printing/calculations'
import type { PrintCostResult } from '@/lib/printing/types'

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--secondary))',
  'hsl(30, 90%, 55%)',
  'hsl(0, 70%, 55%)',
]

interface Props {
  result: PrintCostResult
}

export function CostPieChart({ result }: Props) {
  const data = [
    { name: 'Material', value: parseFloat(result.materialCost.toFixed(2)) },
    { name: 'Electricity', value: parseFloat(result.electricityCost.toFixed(2)) },
    { name: 'Depreciation', value: parseFloat(result.depreciationCost.toFixed(2)) },
    { name: 'Failure Margin', value: parseFloat(result.failureMarginCost.toFixed(2)) },
  ].filter((d) => d.value > 0)

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <p className="text-sm font-medium text-foreground mb-1">
        Cost Breakdown
      </p>
      <p className="text-xs text-muted-foreground mb-5">
        Where your money goes on each print
      </p>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={3}
            dataKey="value"
            stroke="none"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => formatUsd(Number(value))}
            contentStyle={{
              background: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              fontSize: '13px',
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: '12px' }}
            formatter={(value) => (
              <span style={{ color: 'hsl(var(--foreground))' }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
