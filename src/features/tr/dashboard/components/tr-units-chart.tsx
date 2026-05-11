import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

type UnitsChartItem = {
  unit: string
  records: number
}

type TRUnitsChartProps = {
  data: UnitsChartItem[]
}

export function TRUnitsChart({ data }: TRUnitsChartProps) {
  const total = data.reduce((sum, item) => sum + item.records, 0)
  const summary = data
    .map((item) => `${item.unit}: ${item.records}`)
    .join(', ')

  return (
    <figure
      role='img'
      aria-label={`Distribuição de TRs por unidade. Total: ${total}. ${summary}.`}
      className='rounded-[20px] bg-muted/20 p-3'
    >
      <ResponsiveContainer width='100%' height={320}>
        <BarChart
          data={data}
          layout='vertical'
          margin={{ top: 8, right: 12, left: 12, bottom: 8 }}
        >
          <XAxis
            type='number'
            stroke='#888888'
            fontSize={12}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type='category'
            dataKey='unit'
            stroke='#888888'
            fontSize={12}
            width={88}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip formatter={(value) => `${value ?? 0} TRs`} />
          <Bar
            dataKey='records'
            radius={[0, 8, 8, 0]}
            className='fill-primary'
          />
        </BarChart>
      </ResponsiveContainer>
      <figcaption className='sr-only'>
        <table>
          <caption>Distribuição de TRs por unidade</caption>
          <thead>
            <tr>
              <th scope='col'>Unidade</th>
              <th scope='col'>Quantidade</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.unit}>
                <td>{item.unit}</td>
                <td>{item.records}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </figcaption>
    </figure>
  )
}
