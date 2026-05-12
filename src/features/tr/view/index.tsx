import { Link } from '@tanstack/react-router'
import { ArrowLeft, FilePenLine, ScanSearch, Send } from 'lucide-react'
import { toast } from 'sonner'
import { Header } from '@/shared/layout/header'
import { HeaderActions } from '@/shared/layout/header-actions'
import { Main } from '@/shared/layout/main'
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { TRMetaList } from '@/shared/components/tr-meta-list'
import { TRDocumentToc } from './components/tr-document-toc'
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
        {mode === 'view' ? (
          <Alert role='status'>
            <ScanSearch aria-hidden='true' className='size-4' />
            <AlertTitle>Modo de leitura</AlertTitle>
            <AlertDescription>
              Este TR está sendo exibido para consulta. Para alterar o
              conteúdo, abra o documento em edição usando o botão{' '}
              <strong>Editar</strong> à direita.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert
            role='status'
            className='border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-100 [&>svg]:text-amber-700 dark:[&>svg]:text-amber-300'
          >
            <FilePenLine aria-hidden='true' className='size-4' />
            <AlertTitle>Modo de edição</AlertTitle>
            <AlertDescription>
              Alterações ficam salvas como rascunho até serem enviadas para
              revisão.
            </AlertDescription>
          </Alert>
        )}

        <section className='flex flex-wrap items-start justify-between gap-4'>
          <div className='space-y-2'>
            <Button asChild variant='ghost' className='-ml-3 rounded-xl'>
              <Link to='/trs'>
                <ArrowLeft className='size-4' />
                Voltar para TRs
              </Link>
            </Button>
            <div className='flex flex-wrap items-center gap-3'>
              <h1 className='font-mono text-3xl font-semibold tracking-tight text-balance'>
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

        <div className='grid grid-cols-12 gap-6 xl:items-start'>
          <Card className='col-span-12 rounded-2xl border-0 shadow-border xl:col-span-3 xl:sticky xl:top-20'>
            <CardHeader>
              <CardTitle>Metadados</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4 text-sm'>
              <TRMetaList
                items={[
                  { label: 'Unidade', value: document.responsibleUnit },
                  { label: 'Responsável', value: document.owner },
                  { label: 'Modelo', value: document.model },
                  {
                    label: 'Atualização',
                    value: new Intl.DateTimeFormat('pt-BR').format(
                      new Date(document.updatedAt)
                    ),
                  },
                  { label: 'Etapa atual', value: document.currentStep },
                ]}
              />
            </CardContent>
          </Card>

          <div className='col-span-12 xl:col-span-7'>
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

          <div className='col-span-12 xl:col-span-2'>
            <TRDocumentToc sections={document.sections} />
          </div>
        </div>

        {isReviewState && (
          <div className='grid grid-cols-12 gap-6'>
            <div className='col-span-12 xl:col-span-8'>
              <TRReviewComments comments={document.comments} />
            </div>
            <Card className='col-span-12 rounded-2xl border-0 shadow-border xl:col-span-4'>
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

