import { TrendingDown, TrendingUp } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { Badge } from '@/shared/ui/badge'
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
  trend?: {
    value: number
    direction: 'up' | 'down'
    period: string
  }
}

type TRKpiCardsProps = {
  items: KPIItem[]
}

export function TRKpiCards({ items }: TRKpiCardsProps) {
  return (
    <section className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
      {items.map((item) => (
        <Card key={item.label} className='rounded-2xl'>
          <CardHeader className='pb-2'>
            <CardDescription>{item.label}</CardDescription>
            <CardTitle className='text-3xl font-semibold tabular-nums'>
              {item.value}
            </CardTitle>
            {item.trend ? (
              <Badge
                variant='outline'
                className={cn(
                  'mt-1 w-fit gap-1 rounded-md text-xs font-medium',
                  item.trend.direction === 'up'
                    ? 'border-emerald-200 text-emerald-700 dark:border-emerald-900 dark:text-emerald-300'
                    : 'border-rose-200 text-rose-700 dark:border-rose-900 dark:text-rose-300'
                )}
              >
                {item.trend.direction === 'up' ? (
                  <TrendingUp aria-hidden='true' className='size-3' />
                ) : (
                  <TrendingDown aria-hidden='true' className='size-3' />
                )}
                {item.trend.direction === 'up' ? '+' : '−'}
                {item.trend.value}%
              </Badge>
            ) : null}
          </CardHeader>
          <CardContent className='text-sm leading-6 text-pretty text-muted-foreground'>
            {item.description}
            {item.trend ? (
              <div className='mt-2 text-xs text-muted-foreground/70'>
                {item.trend.period}
              </div>
            ) : null}
          </CardContent>
        </Card>
      ))}
    </section>
  )
}
