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
  },
  {
    label: 'Rascunhos',
    value: 14,
    description: 'TRs iniciados e ainda em elaboração pelas áreas.',
  },
  {
    label: 'Em revisão',
    value: 9,
    description: 'Documentos aguardando validação formal ou técnica.',
  },
  {
    label: 'Aprovados',
    value: 21,
    description: 'TRs prontos para seguir o fluxo de contratação.',
  },
] as const

export const trStatusData = [
  { label: 'Rascunho', value: 14, percentage: 29, color: '#94a3b8' },
  { label: 'Em revisão', value: 9, percentage: 19, color: '#f59e0b' },
  {
    label: 'Ajustes solicitados',
    value: 4,
    percentage: 8,
    color: '#fb7185',
  },
  { label: 'Aprovado', value: 21, percentage: 44, color: '#10b981' },
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
    status: 'Em revisão',
    updatedAt: '07/04/2026',
  },
  {
    id: 'TR-2026-013',
    title: 'Serviço de manutenção preventiva em elevadores',
    unit: 'SESI',
    owner: 'Ana Costa',
    status: 'Ajustes solicitados',
    updatedAt: '06/04/2026',
  },
  {
    id: 'TR-2026-012',
    title: 'Aquisição de kits didáticos para laboratório móvel',
    unit: 'IEL',
    owner: 'Juliana Ferraz',
    status: 'Rascunho',
    updatedAt: '05/04/2026',
  },
  {
    id: 'TR-2026-011',
    title: 'Contratação de consultoria para inovação industrial',
    unit: 'FIEPE',
    owner: 'Carlos Henrique',
    status: 'Aprovado',
    updatedAt: '03/04/2026',
  },
] as const
