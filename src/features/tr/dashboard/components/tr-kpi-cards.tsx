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
import { Skeleton } from '@/shared/ui/skeleton'

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

export function TRKpiCardsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <section
      aria-busy='true'
      aria-label='Carregando indicadores'
      className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'
    >
      {Array.from({ length: count }).map((_, idx) => (
        <Card key={idx} className='rounded-2xl'>
          <CardHeader className='pb-2'>
            <Skeleton className='h-3.5 w-24' />
            <Skeleton className='h-8 w-16' />
            <Skeleton className='mt-1 h-5 w-14 rounded-md' />
          </CardHeader>
          <CardContent className='space-y-2'>
            <Skeleton className='h-3 w-full' />
            <Skeleton className='h-3 w-3/4' />
            <Skeleton className='mt-2 h-2.5 w-20' />
          </CardContent>
        </Card>
      ))}
    </section>
  )
}
