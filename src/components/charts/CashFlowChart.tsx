import type { ReactElement } from 'react'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import type { CashFlowPoint } from '../../types/chart'

interface CashFlowChartProps {
  data: CashFlowPoint[]
}

export default function CashFlowChart({ data }: CashFlowChartProps): ReactElement {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
        <defs>
          <linearGradient id="inflowGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.75} />
            <stop offset="100%" stopColor="#14b8a6" stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id="outflowGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fb7185" stopOpacity={0.75} />
            <stop offset="100%" stopColor="#fb7185" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="rgba(148,163,184,0.15)" vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tick={{ fill: 'rgba(100,116,139,0.9)', fontSize: 12 }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fill: 'rgba(100,116,139,0.9)', fontSize: 12 }}
          tickFormatter={(value) => `$${value}M`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(15,23,42,0.95)',
            border: 'none',
            borderRadius: 12,
            color: '#fff',
          }}
          labelStyle={{ color: '#fff' }}
          formatter={(value, name) => {
            if (typeof value === 'number') {
              return [`$${value.toFixed(1)}M`, name as string]
            }
            return ['-', name as string]
          }}
        />
        <Area type="monotone" dataKey="inflow" stroke="#14b8a6" fill="url(#inflowGradient)" strokeWidth={2} />
        <Area type="monotone" dataKey="outflow" stroke="#fb7185" fill="url(#outflowGradient)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  )
}
