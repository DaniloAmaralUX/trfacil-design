import { Link } from '@tanstack/react-router'
import { ClipboardCheck, Eye } from 'lucide-react'
import { Header } from '@/shared/layout/header'
import { HeaderActions } from '@/shared/layout/header-actions'
import { Main } from '@/shared/layout/main'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { trStatusBadgeClass, trStatusLabels } from '@/features/tr/data/data'
import { trs } from '@/features/tr/data/trs'

export function TRReviewPage() {
  const reviewItems = trs.filter(
    (item) => item.status === 'in_review' || item.status === 'changes_requested'
  )

  return (
    <>
      <Header>
        <HeaderActions />
      </Header>

      <Main className='space-y-6 pb-8'>
        <section className='space-y-2'>
          <div className='inline-flex items-center gap-2 rounded-full border border-black/5 bg-muted/40 px-3 py-1 text-xs font-semibold tracking-[0.14em] text-primary uppercase dark:border-white/10'>
            Fila de aprovação
          </div>
          <h1 className='text-3xl font-semibold tracking-tight text-balance'>
            Documentos aguardando decisão
          </h1>
          <p className='max-w-3xl text-pretty text-muted-foreground'>
            Revise os TRs em andamento, leia o documento consolidado e decida
            entre aprovar ou solicitar ajustes.
          </p>
        </section>

        <section className='grid gap-3 md:grid-cols-3'>
          <StatusCard
            label='Pendentes agora'
            value={String(reviewItems.length)}
          />
          <StatusCard
            label='Em revisão'
            value={String(
              reviewItems.filter((item) => item.status === 'in_review').length
            )}
          />
          <StatusCard
            label='Com ajustes solicitados'
            value={String(
              reviewItems.filter((item) => item.status === 'changes_requested')
                .length
            )}
          />
        </section>

        <section className='grid gap-4 lg:grid-cols-2'>
          {reviewItems.map((item) => (
            <Card
              key={item.id}
              className='rounded-[24px] border-black/5 surface-card dark:border-white/10'
            >
              <CardHeader className='space-y-3'>
                <div className='flex items-center justify-between gap-3'>
                  <CardTitle className='text-lg font-semibold'>
                    {item.id}
                  </CardTitle>
                  <Badge
                    variant='outline'
                    className={trStatusBadgeClass[item.status] ?? ''}
                  >
                    {trStatusLabels[item.status] ?? item.status}
                  </Badge>
                </div>
                <p className='text-sm font-medium text-foreground'>
                  {item.title}
                </p>
              </CardHeader>
              <CardContent className='space-y-4 text-sm'>
                <div className='grid gap-3 sm:grid-cols-2'>
                  <Info label='Unidade' value={item.unit} />
                  <Info label='Responsável' value={item.owner} />
                  <Info label='Etapa atual' value={item.currentStep} />
                  <Info
                    label='Atualização'
                    value={new Intl.DateTimeFormat('pt-BR').format(
                      new Date(item.updatedAt)
                    )}
                  />
                </div>
                <p className='leading-6 text-pretty text-muted-foreground'>
                  {item.summary}
                </p>
                <Button asChild className='w-full rounded-xl'>
                  <Link to='/tr/$trId' params={{ trId: item.id }}>
                    <Eye className='size-4' />
                    Abrir para revisar
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}

          {reviewItems.length === 0 && (
            <Card className='rounded-[24px] border-dashed lg:col-span-2'>
              <CardContent className='flex flex-col items-center gap-3 py-12 text-center'>
                <ClipboardCheck className='size-10 text-muted-foreground' />
                <div className='space-y-1'>
                  <h2 className='text-lg font-semibold'>Nenhum TR pendente</h2>
                  <p className='text-sm text-muted-foreground'>
                    Quando houver documentos em revisão, eles aparecerão aqui.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </section>
      </Main>
    </>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className='space-y-1'>
      <div className='text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase'>
        {label}
      </div>
      <div className='font-medium'>{value}</div>
    </div>
  )
}

function StatusCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className='rounded-[24px] border-black/5 dark:border-white/10'>
      <CardContent className='space-y-1 px-5 py-4'>
        <div className='text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase'>
          {label}
        </div>
        <div className='text-2xl font-semibold tabular-nums'>{value}</div>
      </CardContent>
    </Card>
  )
}
