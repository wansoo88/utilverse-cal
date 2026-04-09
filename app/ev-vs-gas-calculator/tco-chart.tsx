'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import type { YearlyData } from '@/lib/ev/tco-calculations'

interface TCOChartProps {
  data: YearlyData[]
  currencySymbol: string
  breakevenYear: number | null
}

export function TCOChart({ data, currencySymbol, breakevenYear }: TCOChartProps) {
  const formatY = (v: number) =>
    `${currencySymbol}${(v / 1000).toFixed(0)}k`

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          dataKey="year"
          tickFormatter={(v) => `Yr ${v}`}
          tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
        />
        <YAxis
          tickFormatter={formatY}
          tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
          width={45}
        />
        <Tooltip
          formatter={(value) =>
            `${currencySymbol}${Number(value).toLocaleString('en-US')}`
          }
          labelFormatter={(label) => `Year ${label}`}
          contentStyle={{
            background: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
            fontSize: '13px',
          }}
        />
        <Legend
          wrapperStyle={{ fontSize: '13px', paddingTop: '12px' }}
        />
        {breakevenYear && breakevenYear > 0 && (
          <ReferenceLine
            x={breakevenYear}
            stroke="hsl(var(--secondary))"
            strokeDasharray="4 4"
            label={{
              value: 'Breakeven',
              position: 'top',
              fontSize: 11,
              fill: 'hsl(var(--secondary))',
            }}
          />
        )}
        <Line
          type="monotone"
          dataKey="evCumulative"
          name="EV Total Cost"
          stroke="hsl(var(--primary))"
          strokeWidth={2.5}
          dot={false}
          activeDot={{ r: 5 }}
        />
        <Line
          type="monotone"
          dataKey="gasCumulative"
          name="Gas Total Cost"
          stroke="hsl(var(--destructive))"
          strokeWidth={2.5}
          dot={false}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
