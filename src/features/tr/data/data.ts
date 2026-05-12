import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Circle,
  Clock3,
  FileWarning,
} from 'lucide-react'

export const trStatuses = [
  {
    label: 'Rascunho',
    value: 'draft' as const,
    icon: Circle,
  },
  {
    label: 'Em revisão',
    value: 'in_review' as const,
    icon: Clock3,
  },
  {
    label: 'Ajustes solicitados',
    value: 'changes_requested' as const,
    icon: FileWarning,
  },
  {
    label: 'Aprovado',
    value: 'approved' as const,
    icon: CheckCircle2,
  },
  {
    label: 'Rejeitado',
    value: 'rejected' as const,
    icon: AlertCircle,
  },
] as const

export type TRStatus = (typeof trStatuses)[number]['value']

export type TRStatusTone =
  | 'neutral'
  | 'warning'
  | 'destructive'
  | 'success'
  | 'danger'

export type TRStatusToken = {
  label: string
  icon: React.ComponentType<{ className?: string }>
  badgeClass: string
  chartColor: string
  tone: TRStatusTone
}

/**
 * Single source of truth para tokens de status do TR.
 * Consumido por Badge, pie chart, alerts, recent table.
 */
export const trStatusTokens: Record<TRStatus, TRStatusToken> = {
  draft: {
    label: 'Rascunho',
    icon: Circle,
    badgeClass:
      'border-slate-300/70 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200',
    chartColor: '#94a3b8',
    tone: 'neutral',
  },
  in_review: {
    label: 'Em revisão',
    icon: Clock3,
    badgeClass:
      'border-amber-300/70 bg-amber-100 text-amber-800 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-200',
    chartColor: '#f59e0b',
    tone: 'warning',
  },
  changes_requested: {
    label: 'Ajustes solicitados',
    icon: FileWarning,
    badgeClass:
      'border-rose-300/70 bg-rose-100 text-rose-800 dark:border-rose-700 dark:bg-rose-950/40 dark:text-rose-200',
    chartColor: '#fb7185',
    tone: 'destructive',
  },
  approved: {
    label: 'Aprovado',
    icon: CheckCircle2,
    badgeClass:
      'border-emerald-300/70 bg-emerald-100 text-emerald-800 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200',
    chartColor: '#10b981',
    tone: 'success',
  },
  rejected: {
    label: 'Rejeitado',
    icon: AlertCircle,
    badgeClass:
      'border-red-300/70 bg-red-100 text-red-800 dark:border-red-700 dark:bg-red-950/40 dark:text-red-200',
    chartColor: '#dc2626',
    tone: 'danger',
  },
}

// Backward-compat aliases (derived from trStatusTokens)
export const trStatusLabels: Record<string, string> = Object.fromEntries(
  Object.entries(trStatusTokens).map(([key, token]) => [key, token.label])
)

export const trStatusBadgeClass: Record<string, string> = Object.fromEntries(
  Object.entries(trStatusTokens).map(([key, token]) => [key, token.badgeClass])
)

export const trUnits = [
  { label: 'SENAI', value: 'SENAI' as const, icon: ArrowRight },
  { label: 'SESI', value: 'SESI' as const, icon: ArrowRight },
  { label: 'IEL', value: 'IEL' as const, icon: ArrowRight },
  { label: 'FIEPE', value: 'FIEPE' as const, icon: ArrowRight },
  { label: 'CIEPE', value: 'CIEPE' as const, icon: ArrowRight },
] as const
