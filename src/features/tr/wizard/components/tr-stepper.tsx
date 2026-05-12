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
      {/* Compact mobile/tablet view (< lg) */}
      <Collapsible
        open={mobileOpen}
        onOpenChange={setMobileOpen}
        className='rounded-2xl border bg-card lg:hidden'
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
          <nav
            aria-label='Etapas do wizard'
            className='space-y-0.5 border-t px-2 py-2'
          >
            {steps.map((step, index) => (
              <StepRailItem
                key={step.id}
                step={step}
                index={index}
                currentStep={currentStep}
                pendingLabels={pendingLabels}
                pendingCount={pendingByStep[index] ?? 0}
                onStepClick={(idx) => {
                  onStepClick?.(idx)
                  setMobileOpen(false)
                }}
              />
            ))}
          </nav>
        </CollapsibleContent>
      </Collapsible>

      {/* Vertical rail (>= lg) */}
      <nav
        aria-label='Etapas do wizard'
        className='hidden lg:sticky lg:top-20 lg:flex lg:flex-col lg:gap-3 lg:self-start'
      >
        <div className='space-y-2 rounded-2xl border bg-card px-3 py-3'>
          <div className='flex items-center justify-between px-1 text-xs text-muted-foreground'>
            <span>Progresso</span>
            <span className='tabular-nums'>
              {currentStep + 1}/{totalSteps}
            </span>
          </div>
          <Progress value={percent} aria-label='Progresso do wizard' />
        </div>
        <ol className='space-y-0.5 rounded-2xl border bg-card p-2'>
          {steps.map((step, index) => (
            <li key={step.id}>
              <StepRailItem
                step={step}
                index={index}
                currentStep={currentStep}
                pendingLabels={pendingLabels}
                pendingCount={pendingByStep[index] ?? 0}
                onStepClick={onStepClick}
              />
            </li>
          ))}
        </ol>
      </nav>
    </>
  )
}

type StepRailItemProps = {
  step: TRSectionDefinition
  index: number
  currentStep: number
  pendingLabels: string[]
  pendingCount: number
  onStepClick?: (step: number) => void
}

function StepRailItem({
  step,
  index,
  currentStep,
  pendingLabels,
  pendingCount,
  onStepClick,
}: StepRailItemProps) {
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
      size='sm'
      onClick={() => onStepClick?.(index)}
      aria-current={isActive ? 'step' : undefined}
      className={cn(
        'group h-auto w-full justify-start gap-3 whitespace-normal rounded-xl border-l-2 border-transparent px-3 py-2 text-left transition-colors',
        'hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring',
        isActive && 'border-l-primary bg-primary/5 hover:bg-primary/10',
        isCompleted &&
          'border-l-emerald-300 bg-emerald-50/40 hover:bg-emerald-50 dark:border-l-emerald-800 dark:bg-emerald-950/10',
        hasAttention &&
          'border-l-amber-400 bg-amber-50/50 hover:bg-amber-50 dark:border-l-amber-700 dark:bg-amber-950/15'
      )}
    >
      <div
        className={cn(
          'flex size-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold',
          isActive && 'border-primary/40 bg-primary text-primary-foreground',
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
          <Check aria-hidden='true' className='size-3.5' />
        ) : hasAttention ? (
          <CircleAlert aria-hidden='true' className='size-3.5' />
        ) : isActive ? (
          <CircleDot aria-hidden='true' className='size-3.5' />
        ) : (
          index + 1
        )}
      </div>
      <span
        className={cn(
          'min-w-0 flex-1 truncate text-sm leading-tight',
          isActive ? 'font-semibold' : 'font-medium',
          isCompleted && !isActive && 'text-muted-foreground'
        )}
      >
        {step.title}
      </span>
      {pendingCount > 0 ? (
        <Badge
          variant='outline'
          className='hidden shrink-0 border-amber-300 px-1.5 text-[10px] text-amber-700 xl:inline-flex dark:border-amber-800 dark:text-amber-200'
          aria-label={`${pendingCount} pendência(s) nesta etapa`}
        >
          {pendingCount}
        </Badge>
      ) : null}
      {pendingCount > 0 ? (
        <span
          aria-hidden='true'
          className='size-1.5 shrink-0 rounded-full bg-amber-500 xl:hidden'
        />
      ) : null}
    </Button>
  )
}
