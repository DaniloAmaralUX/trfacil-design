import { Link } from '@tanstack/react-router'
import { ArrowLeft, FilePenLine, ScanSearch, Send } from 'lucide-react'
import { toast } from 'sonner'
import { Header } from '@/shared/layout/header'
import { HeaderActions } from '@/shared/layout/header-actions'
import { Main } from '@/shared/layout/main'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { trStatusBadgeClass, trStatusLabels } from '@/features/tr/data/data'
import { getTRDocument } from '@/features/tr/data/tr-document'
import { TRReviewActions } from '@/features/tr/review/components/tr-review-actions'
import { TRReviewComments } from '@/features/tr/review/components/tr-review-comments'
import { TRDocumentView } from './components/tr-document-view'

type TRViewPageProps = {
  trId?: string
  mode?: 'edit' | 'view'
}

export function TRViewPage({ trId, mode = 'view' }: TRViewPageProps) {
  const document = getTRDocument(trId)
  const isReviewState =
    document.status === 'in_review' || document.status === 'changes_requested'

  return (
    <>
      <Header>
        <HeaderActions />
      </Header>

      <Main className='space-y-6 pb-8'>
        <section className='flex flex-wrap items-start justify-between gap-4'>
          <div className='space-y-2'>
            <Button asChild variant='ghost' className='-ml-3 rounded-xl'>
              <Link to='/trs'>
                <ArrowLeft className='size-4' />
                Voltar para TRs
              </Link>
            </Button>
            <div className='flex flex-wrap items-center gap-3'>
              <h1 className='text-3xl font-semibold tracking-tight text-balance'>
                {document.id}
              </h1>
              <Badge
                variant='outline'
                className={trStatusBadgeClass[document.status] ?? ''}
              >
                {trStatusLabels[document.status] ?? document.status}
              </Badge>
            </div>
            <p className='max-w-3xl text-pretty text-muted-foreground'>
              {document.title}
            </p>
            {mode === 'edit' ? (
              <div className='inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold tracking-[0.14em] text-amber-800 uppercase dark:border-amber-900 dark:bg-amber-950/20 dark:text-amber-200'>
                <FilePenLine className='size-3.5' />
                Modo de edição
              </div>
            ) : (
              <div className='inline-flex items-center gap-2 rounded-full border border-black/5 bg-muted/30 px-3 py-1 text-xs font-semibold tracking-[0.14em] text-primary uppercase dark:border-white/10'>
                <ScanSearch className='size-3.5' />
                Modo de leitura
              </div>
            )}
          </div>

          <div className='flex flex-wrap gap-2'>
            <Button asChild variant='outline' className='rounded-xl'>
              <Link to='/novo-tr'>
                <FilePenLine className='size-4' />
                {mode === 'edit' ? 'Continuar edicao' : 'Editar'}
              </Link>
            </Button>
            <Button
              className='rounded-xl'
              onClick={() =>
                toast.success(`${document.id} enviado para revisão`)
              }
            >
              <Send className='size-4' />
              Enviar para revisão
            </Button>
          </div>
        </section>

        <div className='grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]'>
          <Card className='rounded-[24px] border-black/5 surface-card dark:border-white/10'>
            <CardHeader>
              <CardTitle>Metadados</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4 text-sm'>
              <MetaRow label='Unidade' value={document.responsibleUnit} />
              <MetaRow label='Responsável' value={document.owner} />
              <MetaRow label='Modelo' value={document.model} />
              <MetaRow
                label='Atualização'
                value={new Intl.DateTimeFormat('pt-BR').format(
                  new Date(document.updatedAt)
                )}
              />
              <MetaRow label='Etapa atual' value={document.currentStep} />
            </CardContent>
          </Card>

          <TRDocumentView
            title={document.title}
            sections={document.sections}
            status={{
              label:
                mode === 'edit'
                  ? 'Documento aberto para ajustes'
                  : 'Documento consolidado para consulta',
              tone: mode === 'edit' ? 'warning' : 'neutral',
            }}
          />
        </div>

        {isReviewState && (
          <div className='grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]'>
            <TRReviewComments comments={document.comments} />
            <Card className='rounded-[24px] border-black/5 surface-card dark:border-white/10'>
              <CardHeader>
                <CardTitle>Ações de revisão</CardTitle>
              </CardHeader>
              <CardContent>
                <TRReviewActions />
              </CardContent>
            </Card>
          </div>
        )}
      </Main>
    </>
  )
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className='space-y-1'>
      <div className='text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase'>
        {label}
      </div>
      <div className='font-medium'>{value}</div>
    </div>
  )
}
