import type { ReactElement } from 'react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import type { SalesTrendPoint } from '../../types/chart'

interface SalesTrendChartProps {
  data: SalesTrendPoint[]
}

export default function SalesTrendChart({ data }: SalesTrendChartProps): ReactElement {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
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
          formatter={(value) => {
            if (typeof value === 'number') {
              return [`$${value.toFixed(1)}M`, 'Revenue']
            }
            return ['-', 'Revenue']
          }}
        />
        <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 5 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}
