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

export const trUnits = [
  { label: 'SENAI', value: 'SENAI' as const, icon: ArrowRight },
  { label: 'SESI', value: 'SESI' as const, icon: ArrowRight },
  { label: 'IEL', value: 'IEL' as const, icon: ArrowRight },
  { label: 'FIEPE', value: 'FIEPE' as const, icon: ArrowRight },
  { label: 'CIEPE', value: 'CIEPE' as const, icon: ArrowRight },
] as const

export const trStatusLabels: Record<string, string> = {
  draft: 'Rascunho',
  in_review: 'Em revisão',
  changes_requested: 'Ajustes solicitados',
  approved: 'Aprovado',
  rejected: 'Rejeitado',
}

export const trStatusBadgeClass: Record<string, string> = {
  draft:
    'border-slate-300/70 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200',
  in_review:
    'border-amber-300/70 bg-amber-100 text-amber-800 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-200',
  changes_requested:
    'border-rose-300/70 bg-rose-100 text-rose-800 dark:border-rose-700 dark:bg-rose-950/40 dark:text-rose-200',
  approved:
    'border-emerald-300/70 bg-emerald-100 text-emerald-800 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200',
  rejected:
    'border-red-300/70 bg-red-100 text-red-800 dark:border-red-700 dark:bg-red-950/40 dark:text-red-200',
}
