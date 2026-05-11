import { type TRItem } from './schema'

export const trs: TRItem[] = [
  {
    id: 'TR-2026-014',
    title: 'Contratação de instrutor para NR-10',
    unit: 'SENAI',
    owner: 'Maykon Alves',
    status: 'in_review',
    updatedAt: '2026-04-07',
    currentStep: 'Revisão final',
    summary:
      'Contratação de instrutor temporário para turma intensiva com carga horária de 40 horas.',
  },
  {
    id: 'TR-2026-013',
    title: 'Serviço de manutenção preventiva em elevadores',
    unit: 'SESI',
    owner: 'Ana Costa',
    status: 'changes_requested',
    updatedAt: '2026-04-06',
    currentStep: 'Especificações',
    summary:
      'Atualização do escopo técnico e ajuste de critérios de atendimento em regime mensal.',
  },
  {
    id: 'TR-2026-012',
    title: 'Aquisição de kits didáticos para laboratório móvel',
    unit: 'IEL',
    owner: 'Juliana Ferraz',
    status: 'draft',
    updatedAt: '2026-04-05',
    currentStep: 'Objeto',
    summary:
      'Compra de kits educacionais e componentes para oficinas práticas de prototipagem.',
  },
  {
    id: 'TR-2026-011',
    title: 'Contratação de consultoria para inovação industrial',
    unit: 'FIEPE',
    owner: 'Carlos Henrique',
    status: 'approved',
    updatedAt: '2026-04-03',
    currentStep: 'Concluído',
    summary:
      'Consultoria especializada para desenho de programa de produtividade industrial com foco em PMEs.',
  },
  {
    id: 'TR-2026-010',
    title: 'Locação de equipamentos multimídia para evento corporativo',
    unit: 'CIEPE',
    owner: 'Renata Vieira',
    status: 'rejected',
    updatedAt: '2026-04-02',
    currentStep: 'Aprovação',
    summary:
      'Solicitação de locação de estrutura audiovisual para evento institucional com público externo.',
  },
  {
    id: 'TR-2026-009',
    title: 'Serviço de revisão de conteúdo pedagógico',
    unit: 'SENAI',
    owner: 'Pedro Lima',
    status: 'draft',
    updatedAt: '2026-04-01',
    currentStep: 'Justificativa',
    summary:
      'Revisão técnica e editorial de materiais de capacitação profissional para nova trilha de cursos.',
  },
]
