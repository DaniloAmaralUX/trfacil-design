import { createFileRoute } from '@tanstack/react-router'
import { TRWizardPage } from '@/features/tr'

export const Route = createFileRoute('/_authenticated/novo-tr')({
  component: TRWizardPage,
})
