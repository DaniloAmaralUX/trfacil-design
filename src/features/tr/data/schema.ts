import { z } from 'zod'

export const trStatusValues = [
  'draft',
  'in_review',
  'changes_requested',
  'approved',
  'rejected',
] as const

export const trUnitValues = ['SENAI', 'SESI', 'IEL', 'FIEPE', 'CIEPE'] as const

export const trSchema = z.object({
  id: z.string(),
  title: z.string(),
  unit: z.enum(trUnitValues),
  owner: z.string(),
  status: z.enum(trStatusValues),
  updatedAt: z.string(),
  currentStep: z.string(),
  summary: z.string(),
})

export type TRItem = z.infer<typeof trSchema>
