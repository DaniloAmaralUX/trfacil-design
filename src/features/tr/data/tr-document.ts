import {
  type TRDocumentSection,
  buildDocumentSections,
  createDocumentData,
  createEmptyDeliveryLocation,
  createEmptyLot,
  getTemplateDefinition,
} from './templates'
import { trs } from './trs'

export function getTRById(trId?: string) {
  return trs.find((item) => item.id === trId) ?? trs[0]
}

export function getTRDocument(trId?: string) {
  const tr = getTRById(trId)

  if (tr.unit === 'FIEPE') {
    const template = getTemplateDefinition('FIEPE', 'consultoria')
    const documentData = createDocumentData(template, {
      object:
        'Contratação de consultoria especializada para apoiar decisões de produtividade e redesenho operacional.',
      justification:
        'A unidade precisa acelerar o diagnóstico de oportunidades, reduzir retrabalho em processos críticos e direcionar um programa de produtividade.',
      serviceSummary:
        'Consultoria para diagnóstico, entrevistas, oficina executiva e consolidação de agenda priorizada para melhoria operacional.',
      programPeriod: 'Setembro a dezembro de 2026',
      deliveryMode: 'hibrida',
      workload: '56 horas',
      scopeSteps:
        '1. Kick-off.\n2. Diagnóstico documental.\n3. Entrevistas com gestores.\n4. Oficina de priorização.\n5. Consolidação do relatório.\n6. Apresentação executiva final.',
      finalDeliverables:
        'Relatório final, plano de ação priorizado, cronograma sugerido e registro executivo das recomendações.',
      deliveryLocation:
        'Reuniões presenciais na sede da FIEPE e entregas digitais para a equipe gestora.',
      monitoringArea: 'Gerência de Competitividade',
      monitoringResponsible: 'Juliana Ferraz',
      monitoringEmail: 'juliana.ferraz@fiepe.org.br',
      monitoringNotes:
        'Acompanhamento quinzenal com validação de marcos, cronograma e aceite final do patrocinador.',
      hiringRequirements:
        'Comprovação de experiência prévia, equipe sênior, portfólio similar e disponibilidade para execução no prazo proposto.',
      paymentMilestones:
        'Pagamento por marcos validados, condicionado à entrega dos produtos e aceite formal.',
      invoiceGuidance:
        'A nota fiscal deve trazer o nome do programa, convênio relacionado e descrição do marco entregue.',
      generalConditions:
        'A contratada deverá absorver ajustes de consolidação antes do aceite final sem custo adicional.',
    })

    return {
      ...tr,
      model: template.label,
      responsibleUnit: tr.unit,
      sections: buildDocumentSections(
        {
          institution: 'FIEPE',
          templateType: 'consultoria',
          title: tr.title,
          responsibleUnit: tr.unit,
        },
        template,
        documentData
      ),
      comments: baseComments,
    }
  }

  if (tr.unit === 'IEL') {
    const template = getTemplateDefinition('IEL', 'instrutoria')
    const documentData = createDocumentData(template, {
      object:
        'Contratação de instrutoria para condução de encontros formativos com abordagem aplicada.',
      justification:
        'A demanda apoia agenda institucional com necessidade de facilitação especializada, cronograma curto e alinhamento pedagógico.',
      serviceSummary:
        'Execução de trilha formativa com preparação, condução de encontros, materiais e sistematização dos resultados.',
      programPeriod: 'Outubro de 2026',
      deliveryMode: 'presencial',
      workload: '24 horas',
      scopeSteps:
        '1. Alinhamento com a equipe do IEL.\n2. Preparação dos materiais.\n3. Condução dos encontros.\n4. Consolidação das evidências e recomendações.',
      finalDeliverables:
        'Plano de aula, materiais de apoio, registro de presença e relatório de participação.',
      deliveryLocation:
        'Realização na unidade IEL com apoio remoto para preparação e entrega final.',
      monitoringArea: 'Coordenação de Educação Executiva',
      monitoringResponsible: 'Ana Costa',
      monitoringEmail: 'ana.costa@iel.org.br',
      monitoringNotes:
        'Acompanhamento por cronograma, presença, aderência pedagógica e avaliação de satisfação da turma.',
      hiringRequirements:
        'Experiência comprovada em facilitação, domínio do tema e disponibilidade nas datas previstas.',
      paymentMilestones:
        'Pagamento após execução validada, entrega dos materiais e apresentação da documentação exigida.',
      invoiceGuidance:
        'A NF deve identificar a turma, o período realizado e a carga horária executada.',
      generalConditions:
        'Os materiais deverão ser compartilhados em formato editável e PDF após o encerramento da ação.',
    })

    return {
      ...tr,
      model: template.label,
      responsibleUnit: tr.unit,
      sections: buildDocumentSections(
        {
          institution: 'IEL',
          templateType: 'instrutoria',
          title: tr.title,
          responsibleUnit: tr.unit,
        },
        template,
        documentData
      ),
      comments: baseComments,
    }
  }

  if (tr.unit === 'SESI') {
    const template = getTemplateDefinition('SESI', 'modelo_oficial_sesi')
    const lot = createEmptyLot()
    lot.number = '01'
    lot.name = 'Armário expositor para troféus'
    lot.items[0] = {
      ...lot.items[0],
      location: 'SESI Paulista — Rua João Teixeira, 123',
      itemCode: '1',
      summary:
        'Armário expositor em MDF com portas de vidro, iluminação e montagem no local.',
      unitMeasure: 'unidade',
      quantity: '1',
      delivery: 'Entrega com instalação em até 45 dias',
    }

    const delivery = createEmptyDeliveryLocation()
    delivery.institutionUnit = 'SESI Paulista'
    delivery.cnpj = '03.910.210/0001-06'
    delivery.address = 'Rua João Teixeira, 123, Paulista/PE'

    const documentData = createDocumentData(template, {
      object:
        'Aquisição e instalação de armário expositor para troféus, com fornecimento, transporte, montagem e garantia.',
      objective:
        'Garantir acondicionamento adequado dos troféus institucionais, valorizando a memória esportiva e a preservação do acervo da unidade.',
      hiringJustification:
        'A contratação é necessária para organizar o acervo existente, reduzir risco de dano aos itens expostos e qualificar a apresentação institucional.',
      lotGroupingJustification:
        'Os itens foram agrupados em lote único por compartilharem escopo, fornecimento, instalação, responsabilidade técnica e aceite integrado.',
      technicalSpecifications:
        'O fornecimento deve observar acabamento, medidas, iluminação, resistência, transporte, montagem e limpeza final do ambiente.',
      warrantyConditions:
        'Garantia mínima de 12 meses para estrutura, ferragens, portas, iluminação e eventuais ajustes pós-instalação.',
      deliveryInstallTerm:
        'A entrega, montagem e instalação devem ocorrer em até 45 dias corridos após a autorização de fornecimento.',
      installationWindow:
        'A instalação deverá ocorrer em horário previamente acordado com a unidade, respeitando acesso, circulação e segurança do ambiente.',
      operationalNotes:
        'A contratada deverá apresentar equipe identificada, cumprir regras de acesso e remover resíduos ao final da montagem.',
      sampleRequirement:
        'Não há exigência de amostra física, mas a proposta deve apresentar memorial descritivo, imagens de referência e detalhamento dos materiais.',
      contractTerm:
        'Vigência suficiente para fornecimento, instalação, aceite e cobertura da garantia prevista no TR.',
      budgetResources:
        'Recursos previstos no orçamento da unidade demandante, vinculados à rubrica de mobiliário e adequação de ambientes.',
      proposalRequirements:
        'A proposta deve apresentar preço global, memorial descritivo, prazo de entrega, garantia e condições de instalação.',
      qualificationRequirements:
        'Comprovação de fornecimentos similares, documentação fiscal regular e aptidão para montagem em ambiente institucional.',
      paymentConditions:
        'Pagamento após entrega, instalação, aceite formal e apresentação da nota fiscal com a descrição aderente ao objeto contratado.',
      contractingPartyObligations:
        'Disponibilizar acesso ao ambiente, validar medidas finais e registrar o aceite após conclusão do fornecimento.',
      contractorObligations:
        'Fornecer, transportar, instalar, ajustar o mobiliário e assegurar a garantia prevista no TR.',
      contractGovernance:
        'A fiscalização será realizada pela unidade demandante, com registro de entrega, instalação, pendências e aceite final.',
      penalties:
        'Descumprimentos contratuais sujeitam a advertência, multa e demais penalidades previstas nas condições da contratação.',
      lots: [lot],
      deliveries: [delivery],
    })

    return {
      ...tr,
      model: template.label,
      responsibleUnit: tr.unit,
      sections: buildDocumentSections(
        {
          institution: 'SESI',
          templateType: 'modelo_oficial_sesi',
          title: tr.title,
          responsibleUnit: tr.unit,
        },
        template,
        documentData
      ),
      comments: baseComments,
    }
  }

  return {
    ...tr,
    model: 'Contratação de Serviço',
    responsibleUnit: tr.unit,
    sections: buildFallbackSections(tr.owner),
    comments: baseComments,
  }
}

const baseComments = [
  {
    author: 'Ana Costa',
    date: '07/04/2026',
    message:
      'Ajustar o critério de aceite para deixar mais explícito o marco de validação da entrega.',
  },
  {
    author: 'Carlos Henrique',
    date: '06/04/2026',
    message:
      'A justificativa está boa, mas vale reforçar o impacto na continuidade da operação.',
  },
]

function buildFallbackSections(owner: string): TRDocumentSection[] {
  return [
    {
      kind: 'prose',
      title: 'Objeto',
      content:
        'Contratação de serviço especializado para atender demanda institucional com escopo definido, prazo estimado e critérios mínimos de entrega.',
    },
    {
      kind: 'prose',
      title: 'Justificativa',
      content:
        'A demanda atende necessidade operacional recorrente da unidade e busca reduzir retrabalho, assegurar conformidade e elevar a previsibilidade do processo de contratação.',
    },
    {
      kind: 'keyValue',
      title: 'Governança do documento',
      items: [
        { label: 'Gestor do contrato', value: owner },
        { label: 'Fiscal do contrato', value: 'Ana Costa' },
        { label: 'Responsável técnico', value: 'Juliana Ferraz' },
      ],
    },
  ]
}
