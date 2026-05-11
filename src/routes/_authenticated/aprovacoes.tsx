import { createFileRoute } from '@tanstack/react-router'
import { TRReviewPage } from '@/features/tr'

export const Route = createFileRoute('/_authenticated/aprovacoes')({
  component: TRReviewPage,
})
