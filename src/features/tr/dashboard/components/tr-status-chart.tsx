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
  const total = data.reduce((sum, item) => sum + item.value, 0)
  const summary = data
    .map((item) => `${item.label}: ${item.value}`)
    .join(', ')

  return (
    <figure
      role='img'
      aria-label={`Distribuição de TRs por status. Total: ${total}. ${summary}.`}
      className='rounded-[20px] bg-muted/20 p-3'
    >
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
      <figcaption className='sr-only'>
        <table>
          <caption>Distribuição de TRs por status</caption>
          <thead>
            <tr>
              <th scope='col'>Status</th>
              <th scope='col'>Quantidade</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.label}>
                <td>{item.label}</td>
                <td>{item.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </figcaption>
    </figure>
  )
}
