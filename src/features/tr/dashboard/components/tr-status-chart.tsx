import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

type StatusChartItem = {
  label: string
  value: number
  color: string
}

type TRStatusChartProps = {
  data: StatusChartItem[]
}

export function TRStatusChart({ data }: TRStatusChartProps) {
  return (
    <div className='rounded-[20px] bg-muted/20 p-3'>
      <ResponsiveContainer width='100%' height={320}>
        <PieChart>
          <Pie
            data={data}
            dataKey='value'
            nameKey='label'
            innerRadius={76}
            outerRadius={110}
            paddingAngle={3}
            stroke='transparent'
          >
            {data.map((entry) => (
              <Cell key={entry.label} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value ?? 0} TRs`} />
          <Legend verticalAlign='bottom' wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
