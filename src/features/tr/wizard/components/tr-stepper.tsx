import { useState } from 'react'
import {
  Check,
  ChevronDown,
  CircleAlert,
  CircleDot,
} from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/shared/ui/collapsible'
import { Progress } from '@/shared/ui/progress'
import { type TRSectionDefinition } from '@/features/tr/data/templates'

type TRStepperProps = {
  currentStep: number
  steps: TRSectionDefinition[]
  onStepClick?: (step: number) => void
  pendingLabels?: string[]
  pendingByStep?: number[]
}

export function TRStepper({
  currentStep,
  steps,
  onStepClick,
  pendingLabels = [],
  pendingByStep = [],
}: TRStepperProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const totalSteps = steps.length
  const percent = Math.round(((currentStep + 1) / Math.max(totalSteps, 1)) * 100)
  const currentTitle = steps[currentStep]?.title ?? ''
  const currentPending = pendingByStep[currentStep] ?? 0

  return (
    <>
      {/* Compact view (< md) */}
      <Collapsible
        open={mobileOpen}
        onOpenChange={setMobileOpen}
        className='rounded-2xl border bg-card md:hidden'
      >
        <div className='space-y-3 px-4 py-3'>
          <div className='flex items-center justify-between gap-3'>
            <div className='min-w-0 space-y-0.5'>
              <div className='text-xs text-muted-foreground'>
                Etapa {currentStep + 1} de {totalSteps}
              </div>
              <div className='truncate text-sm font-medium'>{currentTitle}</div>
            </div>
            <div className='flex shrink-0 items-center gap-2'>
              {currentPending > 0 ? (
                <Badge
                  variant='outline'
                  className='border-amber-300 text-amber-700 dark:border-amber-800 dark:text-amber-200'
                >
                  {currentPending} pendente{currentPending === 1 ? '' : 's'}
                </Badge>
              ) : null}
              <CollapsibleTrigger asChild>
                <Button
                  variant='ghost'
                  size='sm'
                  className='gap-1 rounded-lg'
                  aria-label={mobileOpen ? 'Ocultar etapas' : 'Ver todas as etapas'}
                >
                  Etapas
                  <ChevronDown
                    aria-hidden='true'
                    className={cn(
                      'size-4 transition-transform',
                      mobileOpen && 'rotate-180'
                    )}
                  />
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>
          <Progress value={percent} aria-label='Progresso do wizard' />
        </div>
        <CollapsibleContent>
          <ol className='space-y-1 border-t px-2 py-2'>
            {steps.map((step, index) => (
              <li key={step.id}>
                <StepCardButton
                  step={step}
                  index={index}
                  currentStep={currentStep}
                  pendingLabels={pendingLabels}
                  pendingCount={pendingByStep[index] ?? 0}
                  onStepClick={(idx) => {
                    onStepClick?.(idx)
                    setMobileOpen(false)
                  }}
                  variant='list'
                />
              </li>
            ))}
          </ol>
        </CollapsibleContent>
      </Collapsible>

      {/* Full grid (>= md) */}
      <ol className='hidden gap-3 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {steps.map((step, index) => (
          <li key={step.id}>
            <StepCardButton
              step={step}
              index={index}
              currentStep={currentStep}
              pendingLabels={pendingLabels}
              pendingCount={pendingByStep[index] ?? 0}
              onStepClick={onStepClick}
              variant='grid'
            />
          </li>
        ))}
      </ol>
    </>
  )
}

type StepCardButtonProps = {
  step: TRSectionDefinition
  index: number
  currentStep: number
  pendingLabels: string[]
  pendingCount: number
  onStepClick?: (step: number) => void
  variant: 'grid' | 'list'
}

function StepCardButton({
  step,
  index,
  currentStep,
  pendingLabels,
  pendingCount,
  onStepClick,
  variant,
}: StepCardButtonProps) {
  const isActive = index === currentStep
  const isCompleted = index < currentStep
  const hasAttention =
    !isCompleted &&
    !isActive &&
    step.kind === 'review' &&
    pendingLabels.length > 0

  return (
    <Button
      type='button'
      variant='ghost'
      onClick={() => onStepClick?.(index)}
      aria-current={isActive ? 'step' : undefined}
      className={cn(
        'group h-auto w-full justify-start whitespace-normal rounded-2xl border px-4 py-3 text-left',
        'hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring',
        isActive &&
          'border-primary/30 bg-primary/5 shadow-sm hover:bg-primary/10',
        isCompleted &&
          'border-emerald-300/50 bg-emerald-50/60 hover:bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/20',
        hasAttention &&
          'border-amber-300/60 bg-amber-50/70 hover:bg-amber-50 dark:border-amber-900 dark:bg-amber-950/20',
        variant === 'list' && 'rounded-xl border-transparent shadow-none'
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
        <div className='min-w-0 flex-1 space-y-1'>
          <div className='flex items-center justify-between gap-2'>
            <div className='leading-none font-medium'>{step.title}</div>
            {pendingCount > 0 ? (
              <Badge
                variant='outline'
                className='shrink-0 border-amber-300 text-amber-700 dark:border-amber-800 dark:text-amber-200'
              >
                {pendingCount}
              </Badge>
            ) : null}
          </div>
          <p className='line-clamp-2 text-xs text-muted-foreground'>
            {step.description}
          </p>
        </div>
      </div>
    </Button>
  )
}
