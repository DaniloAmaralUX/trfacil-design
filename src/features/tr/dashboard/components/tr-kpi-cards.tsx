import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card'

type KPIItem = {
  label: string
  value: number
  description: string
}

type TRKpiCardsProps = {
  items: KPIItem[]
}

export function TRKpiCards({ items }: TRKpiCardsProps) {
  return (
    <section className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
      {items.map((item) => (
        <Card
          key={item.label}
          className='rounded-[24px] border-black/5 surface-card dark:border-white/10'
        >
          <CardHeader className='pb-2'>
            <CardDescription>{item.label}</CardDescription>
            <CardTitle className='text-3xl font-semibold tabular-nums'>
              {item.value}
            </CardTitle>
          </CardHeader>
          <CardContent className='text-sm leading-6 text-pretty text-muted-foreground'>
            {item.description}
          </CardContent>
        </Card>
      ))}
    </section>
  )
}
