export const appIdentity = {
  name: 'TR Fácil',
  shortName: 'TR',
  subtitle: 'Sistema FIEPE',
}

export const currentUser = {
  name: 'Equipe TR Fácil',
  email: 'trfacil@sistemafiepe.org.br',
  avatar: '',
  role: 'Operação de Contratações',
}

export const trKpis = [
  {
    label: 'Total de TRs',
    value: 48,
    description: 'Documentos ativos entre rascunho, revisão e aprovação.',
    trend: { value: 12, direction: 'up' as const, period: 'vs. mês passado' },
  },
  {
    label: 'Rascunhos',
    value: 14,
    description: 'TRs iniciados e ainda em elaboração pelas áreas.',
    trend: { value: 5, direction: 'up' as const, period: 'vs. mês passado' },
  },
  {
    label: 'Em revisão',
    value: 9,
    description: 'Documentos aguardando validação formal ou técnica.',
    trend: { value: 3, direction: 'down' as const, period: 'vs. mês passado' },
  },
  {
    label: 'Aprovados',
    value: 21,
    description: 'TRs prontos para seguir o fluxo de contratação.',
    trend: { value: 18, direction: 'up' as const, period: 'vs. mês passado' },
  },
] as const

import { trStatusTokens } from './data'

export const trStatusData = [
  {
    status: 'draft' as const,
    label: trStatusTokens.draft.label,
    value: 14,
    percentage: 29,
    color: trStatusTokens.draft.chartColor,
  },
  {
    status: 'in_review' as const,
    label: trStatusTokens.in_review.label,
    value: 9,
    percentage: 19,
    color: trStatusTokens.in_review.chartColor,
  },
  {
    status: 'changes_requested' as const,
    label: trStatusTokens.changes_requested.label,
    value: 4,
    percentage: 8,
    color: trStatusTokens.changes_requested.chartColor,
  },
  {
    status: 'approved' as const,
    label: trStatusTokens.approved.label,
    value: 21,
    percentage: 44,
    color: trStatusTokens.approved.chartColor,
  },
] as const

export const trUnitData = [
  { unit: 'SENAI', records: 16 },
  { unit: 'SESI', records: 11 },
  { unit: 'IEL', records: 9 },
  { unit: 'FIEPE', records: 7 },
  { unit: 'CIEPE', records: 5 },
] as const

export const recentTrs = [
  {
    id: 'TR-2026-014',
    title: 'Contratação de instrutor para NR-10',
    unit: 'SENAI',
    owner: 'Maykon Alves',
    status: 'in_review' as const,
    updatedAt: '07/04/2026',
  },
  {
    id: 'TR-2026-013',
    title: 'Serviço de manutenção preventiva em elevadores',
    unit: 'SESI',
    owner: 'Ana Costa',
    status: 'changes_requested' as const,
    updatedAt: '06/04/2026',
  },
  {
    id: 'TR-2026-012',
    title: 'Aquisição de kits didáticos para laboratório móvel',
    unit: 'IEL',
    owner: 'Juliana Ferraz',
    status: 'draft' as const,
    updatedAt: '05/04/2026',
  },
  {
    id: 'TR-2026-011',
    title: 'Contratação de consultoria para inovação industrial',
    unit: 'FIEPE',
    owner: 'Carlos Henrique',
    status: 'approved' as const,
    updatedAt: '03/04/2026',
  },
] as const
