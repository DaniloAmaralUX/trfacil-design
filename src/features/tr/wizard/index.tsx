import { useEffect, useMemo, useState } from 'react'
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ClipboardList,
  FileText,
  Plus,
  Save,
  ShieldCheck,
  Trash2,
} from 'lucide-react'
import { toast } from 'sonner'
import { Header } from '@/shared/layout/header'
import { HeaderActions } from '@/shared/layout/header-actions'
import { Main } from '@/shared/layout/main'
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui/alert-dialog'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { ScrollArea } from '@/shared/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'
import { Separator } from '@/shared/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table'
import { Textarea } from '@/shared/ui/textarea'
import {
  type TRDeliveryLocation,
  type TRFieldDefinition,
  type TRInstitution,
  type TRLot,
  type TRLotItem,
  type TRSectionDefinition,
  type TRTemplateType,
  buildDocumentSections,
  getDefaultTemplateForInstitution,
  getInstitutionOptions,
  getResponsibleUnitOptions,
  getTemplateDefinition,
  getTemplateOptions,
} from '@/features/tr/data/templates'
import { TRDocumentView } from '@/features/tr/view/components/tr-document-view'
import { TRStepper } from './components/tr-stepper'
import { useTRWizard } from './store/use-tr-wizard'

type StepErrors = Record<string, string>

type PendingTemplateChange = {
  institution: TRInstitution
  templateType: TRTemplateType
}

type StepErrorState = {
  scope: string
  values: StepErrors
}

export function TRWizardPage() {
  const {
    currentStep,
    submission,
    context,
    documentData,
    reviewState,
    isDirty,
    nextStep,
    prevStep,
    goToStep,
    updateContext,
    changeTemplate,
    setFieldValue,
    addLot,
    removeLot,
    updateLot,
    addLotItem,
    updateLotItem,
    removeLotItem,
    addDeliveryLocation,
    updateDeliveryLocation,
    removeDeliveryLocation,
    saveDraft,
    startSubmission,
    completeSubmission,
  } = useTRWizard()

  const template = getTemplateDefinition(
    context.institution,
    context.templateType
  )
  const wizardSteps = useMemo<TRSectionDefinition[]>(
    () => [
      {
        id: 'setup',
        title: 'Configuração do Modelo',
        description:
          'Escolha instituição, modelo oficial e identificação básica do documento.',
        kind: 'fields',
        fieldIds: [],
      },
      ...template.sections,
    ],
    [template]
  )
  const currentSection = wizardSteps[currentStep]
  const templateOptions = getTemplateOptions(context.institution)
  const errorScope = `${currentStep}:${context.institution}:${context.templateType}`
  const [stepErrorState, setStepErrorState] = useState<StepErrorState>({
    scope: '',
    values: {},
  })
  const [pendingTemplateChange, setPendingTemplateChange] =
    useState<PendingTemplateChange | null>(null)

  const errors =
    stepErrorState.scope === errorScope ? stepErrorState.values : {}

  const documentSections = useMemo(
    () => buildDocumentSections(context, template, documentData),
    [context, template, documentData]
  )

  const completionPercent = Math.round(
    (reviewState.completedRequired / Math.max(reviewState.totalRequired, 1)) *
      100
  )

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    params.set('step', String(currentStep + 1))
    params.set('institution', context.institution)
    params.set('model', context.templateType)
    window.history.replaceState(
      null,
      '',
      `${window.location.pathname}?${params.toString()}`
    )
  }, [currentStep, context.institution, context.templateType])

  useEffect(() => {
    if (!isDirty) return

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ''
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isDirty])

  const handleSaveDraft = () => {
    saveDraft()
    toast.success('Rascunho salvo com sucesso.')
  }

  const handleSubmit = () => {
    if (!reviewState.isReady) {
      goToStep(wizardSteps.length - 1)
      toast.error('Preencha os campos obrigatórios antes de enviar.')
      return
    }

    startSubmission()
    completeSubmission()
    toast.success('TR enviada para revisão.')
  }

  const handleAdvance = () => {
    const nextErrors = validateCurrentStep(
      currentSection,
      context,
      documentData,
      template
    )
    setStepErrorState({ scope: errorScope, values: nextErrors })

    if (Object.keys(nextErrors).length > 0) {
      focusField(Object.keys(nextErrors)[0])
      toast.error('Revise os campos destacados antes de continuar.')
      return
    }

    nextStep()
  }

  const queueTemplateChange = (
    institution: TRInstitution,
    templateType: TRTemplateType
  ) => {
    const isChanging =
      institution !== context.institution ||
      templateType !== context.templateType

    if (!isChanging) return

    if (!isDirty) {
      changeTemplate(institution, templateType)
      return
    }

    setPendingTemplateChange({ institution, templateType })
  }

  const handleInstitutionChange = (value: string) => {
    const institution = value as TRInstitution
    const nextTemplateType = getDefaultTemplateForInstitution(institution)
    queueTemplateChange(institution, nextTemplateType)
  }

  const handleTemplateChange = (value: string) => {
    queueTemplateChange(context.institution, value as TRTemplateType)
  }

  const applyPendingTemplateChange = () => {
    if (!pendingTemplateChange) return
    changeTemplate(
      pendingTemplateChange.institution,
      pendingTemplateChange.templateType
    )
    setPendingTemplateChange(null)
  }

  return (
    <>
      <Header fixed>
        <HeaderActions />
      </Header>

      <Main className='space-y-6 pb-8'>
        <section className='rounded-[32px] border border-black/5 bg-[radial-gradient(circle_at_top_left,rgba(15,23,42,0.06),transparent_38%),linear-gradient(180deg,rgba(248,250,252,0.95),rgba(241,245,249,0.78))] p-6 shadow-sm dark:border-white/10 dark:bg-[radial-gradient(circle_at_top_left,rgba(148,163,184,0.14),transparent_36%),linear-gradient(180deg,rgba(2,6,23,0.92),rgba(15,23,42,0.72))]'>
          <div className='flex flex-wrap items-start justify-between gap-5'>
            <div className='max-w-3xl space-y-3'>
              <div className='inline-flex items-center gap-2 rounded-full border border-black/5 bg-background/85 px-3 py-1 text-xs font-semibold tracking-[0.16em] text-primary uppercase dark:border-white/10'>
                <ClipboardList aria-hidden='true' className='size-3.5' />
                Sala de preparo documental
              </div>
              <div className='space-y-2'>
                <h1 className='text-3xl font-semibold tracking-tight text-balance'>
                  Criação de TR com modelos oficiais
                </h1>
                <p className='max-w-2xl text-pretty text-muted-foreground'>
                  O fluxo agora acompanha a lógica dos documentos reais de
                  FIEPE, IEL e SESI, com etapas estruturadas, matriz de lotes,
                  revisão final e checklist por obrigatoriedade.
                </p>
              </div>
            </div>

            <Card className='w-full max-w-sm rounded-[24px] border-black/5 bg-background/90 shadow-none dark:border-white/10'>
              <CardHeader className='pb-3'>
                <CardTitle className='text-base'>
                  Prontidão do documento
                </CardTitle>
                <CardDescription>
                  O progresso é recalculado pelo modelo oficial selecionado.
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-2'>
                  <div className='flex items-center justify-between text-sm'>
                    <span className='text-muted-foreground'>
                      Obrigatórios completos
                    </span>
                    <span className='font-semibold tabular-nums'>
                      {reviewState.completedRequired}/
                      {reviewState.totalRequired}
                    </span>
                  </div>
                  <div className='h-2 overflow-hidden rounded-full bg-muted'>
                    <div
                      className='h-full rounded-full bg-primary transition-[width]'
                      style={{ width: `${completionPercent}%` }}
                    />
                  </div>
                </div>

                <div className='grid gap-3 rounded-2xl bg-muted/30 p-4 text-sm'>
                  <SummaryLine
                    label='Instituição'
                    value={context.institution}
                  />
                  <SummaryLine label='Modelo' value={template.label} />
                  <SummaryLine
                    label='Etapa atual'
                    value={currentSection.title}
                  />
                  <SummaryLine
                    label='Status'
                    value={
                      reviewState.isReady
                        ? 'Pronto para envio'
                        : 'Pendências em aberto'
                    }
                  />
                </div>

                {submission.savedAt ? (
                  <p className='text-xs text-muted-foreground'>
                    Último rascunho salvo em {submission.savedAt}.
                  </p>
                ) : null}
              </CardContent>
            </Card>
          </div>
        </section>

        <TRStepper
          currentStep={currentStep}
          steps={wizardSteps}
          onStepClick={goToStep}
          pendingLabels={reviewState.pendingLabels}
        />

        <div className='grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]'>
          <Card className='rounded-[28px] border-black/5 surface-card dark:border-white/10'>
            <CardHeader>
              <div className='flex flex-wrap items-start justify-between gap-3'>
                <div className='space-y-2'>
                  <div className='flex flex-wrap items-center gap-2'>
                    <Badge variant='outline'>{template.badge}</Badge>
                    <Badge variant='secondary'>
                      Etapa {currentStep + 1} de {wizardSteps.length}
                    </Badge>
                    {reviewState.pendingLabels.length ? (
                      <Badge
                        variant='outline'
                        className='border-amber-300 text-amber-700 dark:border-amber-800 dark:text-amber-200'
                      >
                        {reviewState.pendingLabels.length} pendência(s)
                      </Badge>
                    ) : null}
                  </div>
                  <CardTitle>{currentSection.title}</CardTitle>
                  <CardDescription>
                    {currentSection.description}
                  </CardDescription>
                </div>

                {currentSection.kind === 'review' ? (
                  <div className='inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/20 dark:text-emerald-200'>
                    <ShieldCheck aria-hidden='true' className='size-3.5' />
                    Prévia oficial consolidada
                  </div>
                ) : null}
              </div>
            </CardHeader>
            <CardContent className='space-y-6'>
              {currentStep === 0 ? (
                <SetupStep
                  context={context}
                  templateIntro={template.intro}
                  templateOptions={templateOptions}
                  errors={errors}
                  onInstitutionChange={handleInstitutionChange}
                  onTemplateChange={handleTemplateChange}
                  onContextChange={updateContext}
                />
              ) : currentSection.kind === 'fields' ? (
                <FieldSection
                  title={currentSection.title}
                  fields={(currentSection.fieldIds ?? []).map(
                    (fieldId) => template.fields[fieldId]
                  )}
                  values={documentData}
                  errors={errors}
                  onChange={setFieldValue}
                />
              ) : currentSection.kind === 'lots' ? (
                <LotsSection
                  lots={(documentData.lots as TRLot[] | undefined) ?? []}
                  errors={errors}
                  onAddLot={addLot}
                  onRemoveLot={removeLot}
                  onUpdateLot={updateLot}
                  onAddLotItem={addLotItem}
                  onUpdateLotItem={updateLotItem}
                  onRemoveLotItem={removeLotItem}
                />
              ) : currentSection.kind === 'deliveries' ? (
                <DeliveriesSection
                  deliveries={
                    (documentData.deliveries as
                      | TRDeliveryLocation[]
                      | undefined) ?? []
                  }
                  errors={errors}
                  onAddDelivery={addDeliveryLocation}
                  onUpdateDelivery={updateDeliveryLocation}
                  onRemoveDelivery={removeDeliveryLocation}
                />
              ) : (
                <ReviewSection
                  title={context.title}
                  reviewState={reviewState}
                  sections={documentSections}
                />
              )}
            </CardContent>
          </Card>

          <div className='space-y-6'>
            <Card className='rounded-[28px] border-black/5 dark:border-white/10'>
              <CardHeader>
                <CardTitle>Resumo operacional</CardTitle>
                <CardDescription>
                  Leitura rápida do documento em preparação e do próximo passo.
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4 text-sm'>
                <SummaryLine
                  label='Referência'
                  value={context.referenceCode || 'Não informada'}
                />
                <SummaryLine
                  label='Título'
                  value={context.title || 'Sem título'}
                />
                <SummaryLine
                  label='Unidade responsável'
                  value={context.responsibleUnit || 'Não informada'}
                />
                <SummaryLine label='Modelo oficial' value={template.label} />
                <Separator />
                <div className='rounded-2xl bg-muted/30 p-4'>
                  <div className='flex items-center gap-2 font-medium'>
                    <FileText
                      aria-hidden='true'
                      className='size-4 text-primary'
                    />
                    O que vem agora
                  </div>
                  <p className='mt-2 text-muted-foreground'>
                    {wizardSteps[currentStep + 1]?.description ??
                      'Revise o documento consolidado e envie para revisão.'}
                  </p>
                </div>
                {!reviewState.isReady ? (
                  <Alert>
                    <AlertCircle aria-hidden='true' className='size-4' />
                    <AlertTitle>Pendências do modelo</AlertTitle>
                    <AlertDescription>
                      Ainda há {reviewState.pendingLabels.length} requisito(s)
                      obrigatório(s) em aberto.
                    </AlertDescription>
                  </Alert>
                ) : null}
              </CardContent>
            </Card>

            <Card className='rounded-[28px] border-black/5 dark:border-white/10'>
              <CardHeader>
                <CardTitle>Checklist de prontidão</CardTitle>
                <CardDescription>
                  O documento só fica pronto quando o modelo oficial estiver
                  consistente.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className='h-[320px] pr-4'>
                  <div aria-live='polite' className='space-y-2 text-sm'>
                    {reviewState.pendingLabels.length ? (
                      reviewState.pendingLabels.map((label) => (
                        <div
                          key={label}
                          className='flex items-start gap-2 rounded-xl bg-muted/30 px-3 py-2'
                        >
                          <AlertCircle
                            aria-hidden='true'
                            className='mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-300'
                          />
                          <span className='text-muted-foreground'>{label}</span>
                        </div>
                      ))
                    ) : (
                      <div className='flex items-start gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-200'>
                        <CheckCircle2
                          aria-hidden='true'
                          className='mt-0.5 size-4 shrink-0'
                        />
                        Todos os requisitos obrigatórios do modelo estão
                        preenchidos.
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className='sticky bottom-4 z-30'>
          <Card className='rounded-[24px] border-black/5 bg-background/95 shadow-lg backdrop-blur dark:border-white/10'>
            <CardContent className='flex flex-wrap items-center justify-between gap-3 px-5 py-4'>
              <div className='text-sm text-muted-foreground'>
                {submission.status === 'completed'
                  ? 'Documento enviado para revisão com base no modelo oficial selecionado.'
                  : reviewState.isReady
                    ? 'Tudo pronto para finalizar e encaminhar para revisão.'
                    : 'Preencha os blocos obrigatórios. O checklist será atualizado automaticamente.'}
              </div>
              <div className='flex flex-wrap gap-2'>
                <Button
                  type='button'
                  variant='outline'
                  className='rounded-xl'
                  onClick={handleSaveDraft}
                >
                  <Save data-icon='inline-start' />
                  Salvar rascunho
                </Button>
                <Button
                  type='button'
                  variant='outline'
                  className='rounded-xl'
                  onClick={prevStep}
                  disabled={currentStep === 0}
                >
                  <ChevronLeft data-icon='inline-start' />
                  Voltar
                </Button>
                {currentSection.kind === 'review' ? (
                  <Button
                    type='button'
                    className='rounded-xl'
                    onClick={handleSubmit}
                    disabled={
                      !reviewState.isReady || submission.status === 'submitting'
                    }
                  >
                    <CheckCircle2 data-icon='inline-start' />
                    Enviar para revisão
                  </Button>
                ) : (
                  <Button
                    type='button'
                    className='rounded-xl'
                    onClick={handleAdvance}
                  >
                    Próxima etapa
                    <ArrowRight data-icon='inline-end' />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </Main>

      <AlertDialog
        open={Boolean(pendingTemplateChange)}
        onOpenChange={(open) => {
          if (!open) setPendingTemplateChange(null)
        }}
      >
        <AlertDialogContent className='rounded-[24px]'>
          <AlertDialogHeader>
            <AlertDialogTitle>Trocar instituição ou modelo?</AlertDialogTitle>
            <AlertDialogDescription>
              O wizard preserva apenas os campos compatíveis entre os modelos.
              Os dados específicos do modelo atual podem ser limpos nessa troca.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className='rounded-xl'>
              Continuar editando
            </AlertDialogCancel>
            <AlertDialogAction
              className='rounded-xl'
              onClick={applyPendingTemplateChange}
            >
              Trocar modelo
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

function SetupStep({
  context,
  templateIntro,
  templateOptions,
  errors,
  onInstitutionChange,
  onTemplateChange,
  onContextChange,
}: {
  context: {
    institution: TRInstitution
    templateType: string
    title: string
    responsibleUnit: string
    referenceCode: string
  }
  templateIntro: string
  templateOptions: Array<{ label: string; value: string }>
  errors: StepErrors
  onInstitutionChange: (value: string) => void
  onTemplateChange: (value: string) => void
  onContextChange: (
    values: Partial<{
      title: string
      responsibleUnit: string
      referenceCode: string
    }>
  ) => void
}) {
  return (
    <div className='space-y-6'>
      <Alert>
        <ClipboardList aria-hidden='true' className='size-4' />
        <AlertTitle>Modelo selecionado</AlertTitle>
        <AlertDescription>{templateIntro}</AlertDescription>
      </Alert>

      <div className='grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]'>
        <Card className='rounded-[24px] border-black/5 shadow-none dark:border-white/10'>
          <CardHeader>
            <CardTitle className='text-base'>Estrutura do documento</CardTitle>
            <CardDescription>
              Defina a família institucional e a forma oficial do TR antes do
              preenchimento.
            </CardDescription>
          </CardHeader>
          <CardContent className='grid gap-5 md:grid-cols-2'>
            <FieldBlock
              label='Instituição'
              htmlFor='institution'
              error={errors.institution}
            >
              <Select
                value={context.institution}
                onValueChange={onInstitutionChange}
              >
                <SelectTrigger
                  id='institution'
                  name='institution'
                  data-field-id='institution'
                  className='rounded-xl'
                >
                  <SelectValue placeholder='Selecione a instituição' />
                </SelectTrigger>
                <SelectContent>
                  {getInstitutionOptions().map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FieldBlock>

            <FieldBlock
              label='Modelo oficial'
              htmlFor='templateType'
              error={errors.templateType}
            >
              <Select
                value={context.templateType}
                onValueChange={onTemplateChange}
              >
                <SelectTrigger
                  id='templateType'
                  name='templateType'
                  data-field-id='templateType'
                  className='rounded-xl'
                >
                  <SelectValue placeholder='Selecione o modelo' />
                </SelectTrigger>
                <SelectContent>
                  {templateOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FieldBlock>
          </CardContent>
        </Card>

        <Card className='rounded-[24px] border-black/5 shadow-none dark:border-white/10'>
          <CardHeader>
            <CardTitle className='text-base'>Identificação básica</CardTitle>
            <CardDescription>
              Esses dados acompanham toda a jornada e aparecem na revisão final.
            </CardDescription>
          </CardHeader>
          <CardContent className='grid gap-5'>
            <FieldBlock
              label='Título da TR'
              htmlFor='title'
              error={errors.title}
            >
              <Input
                id='title'
                name='title'
                data-field-id='title'
                autoComplete='off'
                placeholder='Ex.: Consultoria para internacionalização industrial'
                value={context.title}
                onChange={(event) =>
                  onContextChange({ title: event.target.value })
                }
                className='rounded-xl'
              />
            </FieldBlock>

            <FieldBlock
              label='Unidade responsável'
              htmlFor='responsibleUnit'
              error={errors.responsibleUnit}
            >
              <Select
                value={context.responsibleUnit}
                onValueChange={(value) =>
                  onContextChange({ responsibleUnit: value })
                }
              >
                <SelectTrigger
                  id='responsibleUnit'
                  name='responsibleUnit'
                  data-field-id='responsibleUnit'
                  className='rounded-xl'
                >
                  <SelectValue placeholder='Selecione a unidade' />
                </SelectTrigger>
                <SelectContent>
                  {getResponsibleUnitOptions().map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FieldBlock>

            <FieldBlock label='Código de referência' htmlFor='referenceCode'>
              <Input
                id='referenceCode'
                name='referenceCode'
                data-field-id='referenceCode'
                autoComplete='off'
                placeholder='Ex.: TR-2026-021'
                value={context.referenceCode}
                onChange={(event) =>
                  onContextChange({ referenceCode: event.target.value })
                }
                className='rounded-xl'
              />
            </FieldBlock>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function FieldSection({
  title,
  fields,
  values,
  errors,
  onChange,
}: {
  title: string
  fields: TRFieldDefinition[]
  values: Record<string, unknown>
  errors: StepErrors
  onChange: (fieldId: string, value: string) => void
}) {
  return (
    <div className='space-y-5'>
      <div className='rounded-2xl border border-black/5 bg-muted/20 px-4 py-3 text-sm text-muted-foreground dark:border-white/10'>
        {title.includes('Especificações')
          ? 'Prefira linguagem objetiva, com etapas e entregáveis separados. O review final vai refletir esses blocos com a mesma hierarquia do documento.'
          : 'Os campos abaixo alimentam a prévia consolidada e o checklist de prontidão do modelo.'}
      </div>
      <div className='grid gap-5 md:grid-cols-2'>
        {fields.map((field) => (
          <FieldRenderer
            key={field.id}
            field={field}
            value={String(values[field.id] ?? '')}
            error={errors[field.id]}
            className={field.input === 'textarea' ? 'md:col-span-2' : undefined}
            onChange={(value) => onChange(field.id, value)}
          />
        ))}
      </div>
    </div>
  )
}

function LotsSection({
  lots,
  errors,
  onAddLot,
  onRemoveLot,
  onUpdateLot,
  onAddLotItem,
  onUpdateLotItem,
  onRemoveLotItem,
}: {
  lots: TRLot[]
  errors: StepErrors
  onAddLot: () => void
  onRemoveLot: (lotId: string) => void
  onUpdateLot: (
    lotId: string,
    values: Partial<Omit<TRLot, 'items' | 'id'>>
  ) => void
  onAddLotItem: (lotId: string) => void
  onUpdateLotItem: (
    lotId: string,
    itemId: string,
    values: Partial<Omit<TRLotItem, 'id'>>
  ) => void
  onRemoveLotItem: (lotId: string, itemId: string) => void
}) {
  return (
    <div className='space-y-5'>
      <Alert>
        <ClipboardList aria-hidden='true' className='size-4' />
        <AlertTitle>Matriz principal do SESI</AlertTitle>
        <AlertDescription>
          Cada linha deve reproduzir a lógica do TR oficial: lote,
          unidade/endereço, item, especificação, unidade, quantidade total e
          entrega.
        </AlertDescription>
      </Alert>

      {lots.map((lot, index) => (
        <Card
          key={lot.id}
          className='rounded-[24px] border-black/5 dark:border-white/10'
        >
          <CardHeader>
            <div className='flex flex-wrap items-center justify-between gap-3'>
              <div>
                <CardTitle className='text-base'>Lote {index + 1}</CardTitle>
                <CardDescription>
                  Identifique o lote e estruture os itens vinculados a ele.
                </CardDescription>
              </div>
              <Button
                type='button'
                variant='outline'
                onClick={() => onRemoveLot(lot.id)}
              >
                <Trash2 data-icon='inline-start' />
                Remover lote
              </Button>
            </div>
          </CardHeader>
          <CardContent className='space-y-5'>
            <div className='grid gap-4 md:grid-cols-2'>
              <FieldBlock
                label='Nº lote'
                htmlFor={`lot-${lot.id}-number`}
                error={errors[`lot-${lot.id}-number`]}
              >
                <Input
                  id={`lot-${lot.id}-number`}
                  name={`lot-${lot.id}-number`}
                  data-field-id={`lot-${lot.id}-number`}
                  autoComplete='off'
                  placeholder='Ex.: 01'
                  value={lot.number}
                  onChange={(event) =>
                    onUpdateLot(lot.id, { number: event.target.value })
                  }
                  className='rounded-xl'
                />
              </FieldBlock>
              <FieldBlock
                label='Lote'
                htmlFor={`lot-${lot.id}-name`}
                error={errors[`lot-${lot.id}-name`]}
              >
                <Input
                  id={`lot-${lot.id}-name`}
                  name={`lot-${lot.id}-name`}
                  data-field-id={`lot-${lot.id}-name`}
                  autoComplete='off'
                  placeholder='Ex.: Armário expositor'
                  value={lot.name}
                  onChange={(event) =>
                    onUpdateLot(lot.id, { name: event.target.value })
                  }
                  className='rounded-xl'
                />
              </FieldBlock>
            </div>

            <div className='rounded-2xl border border-border/70'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className='min-w-[200px]'>
                      Unidade/Endereço
                    </TableHead>
                    <TableHead className='min-w-[120px]'>Item</TableHead>
                    <TableHead className='min-w-[260px]'>
                      Especificação resumida
                    </TableHead>
                    <TableHead className='min-w-[150px]'>
                      Unidade de medida
                    </TableHead>
                    <TableHead className='min-w-[120px]'>Qtd. total</TableHead>
                    <TableHead className='min-w-[180px]'>Entrega</TableHead>
                    <TableHead className='w-[120px]'>Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lot.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className='align-top whitespace-normal'>
                        <Input
                          id={`lot-${lot.id}-item-${item.id}-location`}
                          name={`lot-${lot.id}-item-${item.id}-location`}
                          data-field-id={`lot-${lot.id}-item-${item.id}-location`}
                          autoComplete='street-address'
                          placeholder='Unidade ou endereço…'
                          value={item.location}
                          onChange={(event) =>
                            onUpdateLotItem(lot.id, item.id, {
                              location: event.target.value,
                            })
                          }
                        />
                        {errors[`lot-${lot.id}-item-${item.id}-location`] ? (
                          <p className='mt-2 text-sm text-destructive'>
                            {errors[`lot-${lot.id}-item-${item.id}-location`]}
                          </p>
                        ) : null}
                      </TableCell>
                      <TableCell className='align-top whitespace-normal'>
                        <Input
                          id={`lot-${lot.id}-item-${item.id}-itemCode`}
                          name={`lot-${lot.id}-item-${item.id}-itemCode`}
                          data-field-id={`lot-${lot.id}-item-${item.id}-itemCode`}
                          autoComplete='off'
                          placeholder='Ex.: 1'
                          value={item.itemCode}
                          onChange={(event) =>
                            onUpdateLotItem(lot.id, item.id, {
                              itemCode: event.target.value,
                            })
                          }
                        />
                        {errors[`lot-${lot.id}-item-${item.id}-itemCode`] ? (
                          <p className='mt-2 text-sm text-destructive'>
                            {errors[`lot-${lot.id}-item-${item.id}-itemCode`]}
                          </p>
                        ) : null}
                      </TableCell>
                      <TableCell className='align-top whitespace-normal'>
                        <Textarea
                          id={`lot-${lot.id}-item-${item.id}-summary`}
                          name={`lot-${lot.id}-item-${item.id}-summary`}
                          data-field-id={`lot-${lot.id}-item-${item.id}-summary`}
                          autoComplete='off'
                          placeholder='Descreva o item…'
                          value={item.summary}
                          onChange={(event) =>
                            onUpdateLotItem(lot.id, item.id, {
                              summary: event.target.value,
                            })
                          }
                          className='min-h-24 rounded-2xl'
                        />
                        {errors[`lot-${lot.id}-item-${item.id}-summary`] ? (
                          <p className='mt-2 text-sm text-destructive'>
                            {errors[`lot-${lot.id}-item-${item.id}-summary`]}
                          </p>
                        ) : null}
                      </TableCell>
                      <TableCell className='align-top whitespace-normal'>
                        <Input
                          id={`lot-${lot.id}-item-${item.id}-unitMeasure`}
                          name={`lot-${lot.id}-item-${item.id}-unitMeasure`}
                          data-field-id={`lot-${lot.id}-item-${item.id}-unitMeasure`}
                          autoComplete='off'
                          placeholder='Ex.: unidade'
                          value={item.unitMeasure}
                          onChange={(event) =>
                            onUpdateLotItem(lot.id, item.id, {
                              unitMeasure: event.target.value,
                            })
                          }
                        />
                        {errors[`lot-${lot.id}-item-${item.id}-unitMeasure`] ? (
                          <p className='mt-2 text-sm text-destructive'>
                            {
                              errors[
                                `lot-${lot.id}-item-${item.id}-unitMeasure`
                              ]
                            }
                          </p>
                        ) : null}
                      </TableCell>
                      <TableCell className='align-top whitespace-normal'>
                        <Input
                          id={`lot-${lot.id}-item-${item.id}-quantity`}
                          name={`lot-${lot.id}-item-${item.id}-quantity`}
                          data-field-id={`lot-${lot.id}-item-${item.id}-quantity`}
                          autoComplete='off'
                          inputMode='numeric'
                          placeholder='0'
                          value={item.quantity}
                          onChange={(event) =>
                            onUpdateLotItem(lot.id, item.id, {
                              quantity: event.target.value,
                            })
                          }
                        />
                        {errors[`lot-${lot.id}-item-${item.id}-quantity`] ? (
                          <p className='mt-2 text-sm text-destructive'>
                            {errors[`lot-${lot.id}-item-${item.id}-quantity`]}
                          </p>
                        ) : null}
                      </TableCell>
                      <TableCell className='align-top whitespace-normal'>
                        <Input
                          id={`lot-${lot.id}-item-${item.id}-delivery`}
                          name={`lot-${lot.id}-item-${item.id}-delivery`}
                          data-field-id={`lot-${lot.id}-item-${item.id}-delivery`}
                          autoComplete='off'
                          placeholder='Prazo ou condição…'
                          value={item.delivery}
                          onChange={(event) =>
                            onUpdateLotItem(lot.id, item.id, {
                              delivery: event.target.value,
                            })
                          }
                        />
                        {errors[`lot-${lot.id}-item-${item.id}-delivery`] ? (
                          <p className='mt-2 text-sm text-destructive'>
                            {errors[`lot-${lot.id}-item-${item.id}-delivery`]}
                          </p>
                        ) : null}
                      </TableCell>
                      <TableCell className='align-top'>
                        <Button
                          type='button'
                          variant='ghost'
                          onClick={() => onRemoveLotItem(lot.id, item.id)}
                        >
                          <Trash2 data-icon='inline-start' />
                          Remover
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <Button
              type='button'
              variant='outline'
              onClick={() => onAddLotItem(lot.id)}
            >
              <Plus data-icon='inline-start' />
              Adicionar item ao lote
            </Button>
          </CardContent>
        </Card>
      ))}

      <Button type='button' variant='outline' onClick={onAddLot}>
        <Plus data-icon='inline-start' />
        Adicionar novo lote
      </Button>
    </div>
  )
}

function DeliveriesSection({
  deliveries,
  errors,
  onAddDelivery,
  onUpdateDelivery,
  onRemoveDelivery,
}: {
  deliveries: TRDeliveryLocation[]
  errors: StepErrors
  onAddDelivery: () => void
  onUpdateDelivery: (
    deliveryId: string,
    values: Partial<Omit<TRDeliveryLocation, 'id'>>
  ) => void
  onRemoveDelivery: (deliveryId: string) => void
}) {
  return (
    <div className='space-y-5'>
      <Alert>
        <FileText aria-hidden='true' className='size-4' />
        <AlertTitle>Tabela auxiliar de instituições</AlertTitle>
        <AlertDescription>
          Cadastre as unidades com CNPJ e endereço oficial. Essa tabela
          complementa a matriz de lotes, sem substituí-la.
        </AlertDescription>
      </Alert>

      {deliveries.map((delivery, index) => (
        <Card
          key={delivery.id}
          className='rounded-[24px] border-black/5 dark:border-white/10'
        >
          <CardHeader>
            <div className='flex flex-wrap items-center justify-between gap-3'>
              <div>
                <CardTitle className='text-base'>
                  Instituição/Unidade {index + 1}
                </CardTitle>
                <CardDescription>
                  Informe a unidade atendida, CNPJ e endereço de
                  entrega/fornecimento.
                </CardDescription>
              </div>
              <Button
                type='button'
                variant='outline'
                onClick={() => onRemoveDelivery(delivery.id)}
              >
                <Trash2 data-icon='inline-start' />
                Remover
              </Button>
            </div>
          </CardHeader>
          <CardContent className='grid gap-4 md:grid-cols-2'>
            <FieldBlock
              label='Instituição/Unidade'
              htmlFor={`delivery-${delivery.id}-institutionUnit`}
              error={errors[`delivery-${delivery.id}-institutionUnit`]}
            >
              <Input
                id={`delivery-${delivery.id}-institutionUnit`}
                name={`delivery-${delivery.id}-institutionUnit`}
                data-field-id={`delivery-${delivery.id}-institutionUnit`}
                autoComplete='organization'
                placeholder='Ex.: SESI Paulista'
                value={delivery.institutionUnit}
                onChange={(event) =>
                  onUpdateDelivery(delivery.id, {
                    institutionUnit: event.target.value,
                  })
                }
                className='rounded-xl'
              />
            </FieldBlock>

            <FieldBlock
              label='CNPJ'
              htmlFor={`delivery-${delivery.id}-cnpj`}
              error={errors[`delivery-${delivery.id}-cnpj`]}
            >
              <Input
                id={`delivery-${delivery.id}-cnpj`}
                name={`delivery-${delivery.id}-cnpj`}
                data-field-id={`delivery-${delivery.id}-cnpj`}
                autoComplete='off'
                inputMode='numeric'
                placeholder='00.000.000/0000-00'
                value={delivery.cnpj}
                onChange={(event) =>
                  onUpdateDelivery(delivery.id, {
                    cnpj: event.target.value,
                  })
                }
                className='rounded-xl'
              />
            </FieldBlock>

            <FieldBlock
              label='Endereço'
              htmlFor={`delivery-${delivery.id}-address`}
              error={errors[`delivery-${delivery.id}-address`]}
              className='md:col-span-2'
            >
              <Textarea
                id={`delivery-${delivery.id}-address`}
                name={`delivery-${delivery.id}-address`}
                data-field-id={`delivery-${delivery.id}-address`}
                autoComplete='street-address'
                placeholder='Rua, número, complemento e referência…'
                value={delivery.address}
                onChange={(event) =>
                  onUpdateDelivery(delivery.id, {
                    address: event.target.value,
                  })
                }
                className='min-h-24 rounded-2xl'
              />
            </FieldBlock>
          </CardContent>
        </Card>
      ))}

      <Button type='button' variant='outline' onClick={onAddDelivery}>
        <Plus data-icon='inline-start' />
        Adicionar instituição/unidade
      </Button>
    </div>
  )
}

function ReviewSection({
  title,
  reviewState,
  sections,
}: {
  title: string
  reviewState: {
    isReady: boolean
    pendingLabels: string[]
  }
  sections: ReturnType<typeof buildDocumentSections>
}) {
  return (
    <div className='space-y-6'>
      {reviewState.isReady ? (
        <Alert>
          <CheckCircle2 aria-hidden='true' className='size-4' />
          <AlertTitle>Documento pronto para revisão</AlertTitle>
          <AlertDescription>
            Todos os requisitos obrigatórios do modelo oficial foram
            preenchidos.
          </AlertDescription>
        </Alert>
      ) : (
        <Alert variant='destructive'>
          <AlertCircle aria-hidden='true' className='size-4' />
          <AlertTitle>Checklist com pendências</AlertTitle>
          <AlertDescription>
            Revise os itens em aberto antes de enviar para revisão formal.
          </AlertDescription>
        </Alert>
      )}

      <TRDocumentView
        title={title || 'TR sem título'}
        sections={sections}
        status={{
          label: reviewState.isReady
            ? 'Pronto para envio'
            : `${reviewState.pendingLabels.length} pendência(s) em aberto`,
          tone: reviewState.isReady ? 'success' : 'warning',
        }}
      />
    </div>
  )
}

function FieldRenderer({
  field,
  value,
  error,
  className,
  onChange,
}: {
  field: TRFieldDefinition
  value: string
  error?: string
  className?: string
  onChange: (value: string) => void
}) {
  return (
    <FieldBlock
      label={field.label}
      htmlFor={field.id}
      error={error}
      className={className}
      description={field.description}
    >
      {field.input === 'select' ? (
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger
            id={field.id}
            name={field.id}
            data-field-id={field.id}
            className='rounded-xl'
          >
            <SelectValue
              placeholder={field.placeholder ?? 'Selecione uma opção'}
            />
          </SelectTrigger>
          <SelectContent>
            {field.options?.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : field.input === 'textarea' ? (
        <Textarea
          id={field.id}
          name={field.id}
          data-field-id={field.id}
          autoComplete={field.autocomplete ?? 'off'}
          spellCheck={field.spellCheck ?? true}
          placeholder={field.placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className='min-h-32 rounded-2xl'
        />
      ) : (
        <Input
          id={field.id}
          name={field.id}
          type={field.input}
          data-field-id={field.id}
          autoComplete={field.autocomplete ?? 'off'}
          spellCheck={field.spellCheck ?? true}
          placeholder={field.placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className='rounded-xl'
        />
      )}
    </FieldBlock>
  )
}

function FieldBlock({
  label,
  htmlFor,
  error,
  className,
  description,
  children,
}: {
  label: string
  htmlFor?: string
  error?: string
  className?: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <div className={['grid gap-2', className].filter(Boolean).join(' ')}>
      <Label htmlFor={htmlFor} className='text-sm font-medium'>
        {label}
      </Label>
      {children}
      {description ? (
        <p className='text-xs text-muted-foreground'>{description}</p>
      ) : null}
      {error ? <p className='text-sm text-destructive'>{error}</p> : null}
    </div>
  )
}

function SummaryLine({ label, value }: { label: string; value: string }) {
  return (
    <div className='min-w-0 space-y-1'>
      <div className='text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase'>
        {label}
      </div>
      <div className='font-medium break-words'>{value}</div>
    </div>
  )
}

function validateCurrentStep(
  section: TRSectionDefinition,
  context: {
    title: string
    responsibleUnit: string
    templateType: string
    institution: string
    referenceCode: string
  },
  documentData: Record<string, unknown>,
  template: ReturnType<typeof getTemplateDefinition>
) {
  const nextErrors: StepErrors = {}

  if (section.id === 'setup') {
    if (!context.institution)
      nextErrors.institution = 'Selecione a instituição.'
    if (!context.templateType)
      nextErrors.templateType = 'Selecione o tipo de TR.'
    if (!context.title.trim()) nextErrors.title = 'Informe o título da TR.'
    if (!context.responsibleUnit.trim()) {
      nextErrors.responsibleUnit = 'Informe a unidade responsável.'
    }
  }

  if (section.kind === 'fields') {
    ;(section.fieldIds ?? []).forEach((fieldId) => {
      const field = template.fields[fieldId]
      if (!field?.required) return
      const value = String(documentData[field.id] ?? '').trim()
      if (!value) {
        nextErrors[field.id] = `Preencha o campo "${field.label}".`
        return
      }

      if (
        field.input === 'email' &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      ) {
        nextErrors[field.id] = 'Informe um e-mail válido.'
      }
    })
  }

  if (section.kind === 'lots') {
    const lots = (documentData.lots as TRLot[] | undefined) ?? []
    if (!lots.length) nextErrors.lots = 'Adicione ao menos um lote.'

    lots.forEach((lot) => {
      if (!lot.number.trim())
        nextErrors[`lot-${lot.id}-number`] = 'Informe o número do lote.'
      if (!lot.name.trim())
        nextErrors[`lot-${lot.id}-name`] = 'Informe o nome do lote.'

      lot.items.forEach((item) => {
        if (!item.location.trim()) {
          nextErrors[`lot-${lot.id}-item-${item.id}-location`] =
            'Informe a unidade ou o endereço.'
        }
        if (!item.itemCode.trim()) {
          nextErrors[`lot-${lot.id}-item-${item.id}-itemCode`] =
            'Informe o item.'
        }
        if (!item.summary.trim()) {
          nextErrors[`lot-${lot.id}-item-${item.id}-summary`] =
            'Descreva o item.'
        }
        if (!item.unitMeasure.trim()) {
          nextErrors[`lot-${lot.id}-item-${item.id}-unitMeasure`] =
            'Informe a unidade de medida.'
        }
        if (!item.quantity.trim()) {
          nextErrors[`lot-${lot.id}-item-${item.id}-quantity`] =
            'Informe a quantidade total.'
        }
        if (!item.delivery.trim()) {
          nextErrors[`lot-${lot.id}-item-${item.id}-delivery`] =
            'Informe a entrega.'
        }
      })
    })
  }

  if (section.kind === 'deliveries') {
    const deliveries =
      (documentData.deliveries as TRDeliveryLocation[] | undefined) ?? []
    if (!deliveries.length) {
      nextErrors.deliveries = 'Adicione ao menos uma instituição/unidade.'
    }

    deliveries.forEach((delivery) => {
      if (!delivery.institutionUnit.trim()) {
        nextErrors[`delivery-${delivery.id}-institutionUnit`] =
          'Informe a instituição ou unidade.'
      }
      if (!delivery.cnpj.trim()) {
        nextErrors[`delivery-${delivery.id}-cnpj`] = 'Informe o CNPJ.'
      }
      if (!delivery.address.trim()) {
        nextErrors[`delivery-${delivery.id}-address`] = 'Informe o endereço.'
      }
    })
  }

  return nextErrors
}

function focusField(fieldId: string) {
  const element = document.querySelector<HTMLElement>(
    `[data-field-id="${fieldId}"]`
  )
  element?.focus()
}
