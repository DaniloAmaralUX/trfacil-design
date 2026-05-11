import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { TRListPage } from '@/features/tr'
import { trStatusValues, trUnitValues } from '@/features/tr/data/schema'

const trSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  status: z.array(z.enum(trStatusValues)).optional().catch([]),
  unit: z.array(z.enum(trUnitValues)).optional().catch([]),
  filter: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_authenticated/trs')({
  validateSearch: trSearchSchema,
  component: TRListPage,
})
