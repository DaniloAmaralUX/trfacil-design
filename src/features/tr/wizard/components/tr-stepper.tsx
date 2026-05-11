import { Check, CircleAlert, CircleDot } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/button'
import { type TRSectionDefinition } from '@/features/tr/data/templates'

type TRStepperProps = {
  currentStep: number
  steps: TRSectionDefinition[]
  onStepClick?: (step: number) => void
  pendingLabels?: string[]
}

export function TRStepper({
  currentStep,
  steps,
  onStepClick,
  pendingLabels = [],
}: TRStepperProps) {
  return (
    <ol className='grid gap-3 lg:grid-cols-3 xl:grid-cols-4'>
      {steps.map((step, index) => {
        const isActive = index === currentStep
        const isCompleted = index < currentStep
        const hasAttention =
          !isCompleted &&
          !isActive &&
          step.kind === 'review' &&
          pendingLabels.length > 0

        return (
          <li key={step.id}>
            <Button
              type='button'
              variant='ghost'
              onClick={() => onStepClick?.(index)}
              aria-current={isActive ? 'step' : undefined}
              className={cn(
                'group h-auto w-full justify-start rounded-2xl border px-4 py-3 text-left',
                'hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring',
                isActive &&
                  'border-primary/30 bg-primary/5 shadow-sm hover:bg-primary/10',
                isCompleted &&
                  'border-emerald-300/50 bg-emerald-50/60 hover:bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/20',
                hasAttention &&
                  'border-amber-300/60 bg-amber-50/70 hover:bg-amber-50 dark:border-amber-900 dark:bg-amber-950/20'
              )}
            >
              <div className='flex w-full items-start gap-3'>
                <div
                  className={cn(
                    'mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold',
                    isActive &&
                      'border-primary/30 bg-primary text-primary-foreground',
                    isCompleted &&
                      'border-emerald-300 bg-emerald-500 text-white dark:border-emerald-800',
                    hasAttention &&
                      'border-amber-300 bg-amber-100 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200',
                    !isActive &&
                      !isCompleted &&
                      !hasAttention &&
                      'border-border bg-background text-muted-foreground'
                  )}
                >
                  {isCompleted ? (
                    <Check aria-hidden='true' className='size-4' />
                  ) : hasAttention ? (
                    <CircleAlert aria-hidden='true' className='size-4' />
                  ) : isActive ? (
                    <CircleDot aria-hidden='true' className='size-4' />
                  ) : (
                    index + 1
                  )}
                </div>
                <div className='min-w-0 space-y-1'>
                  <div className='leading-none font-medium'>{step.title}</div>
                  <p className='line-clamp-2 text-xs text-muted-foreground'>
                    {step.description}
                  </p>
                </div>
              </div>
            </Button>
          </li>
        )
      })}
    </ol>
  )
}
