import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ClipboardCheck, Eye } from 'lucide-react'
import { Header } from '@/shared/layout/header'
import { HeaderActions } from '@/shared/layout/header-actions'
import { Main } from '@/shared/layout/main'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/shared/ui/empty'
import { ToggleGroup, ToggleGroupItem } from '@/shared/ui/toggle-group'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/ui/tooltip'
import { trStatusBadgeClass, trStatusLabels } from '@/features/tr/data/data'
import { trs } from '@/features/tr/data/trs'

type StatusFilter = 'all' | 'in_review' | 'changes_requested'

export function TRReviewPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  const pendingItems = trs.filter(
    (item) => item.status === 'in_review' || item.status === 'changes_requested'
  )
  const inReviewCount = pendingItems.filter(
    (item) => item.status === 'in_review'
  ).length
  const changesRequestedCount = pendingItems.filter(
    (item) => item.status === 'changes_requested'
  ).length
  const reviewItems =
    statusFilter === 'all'
      ? pendingItems
      : pendingItems.filter((item) => item.status === statusFilter)

  return (
    <>
      <Header>
        <HeaderActions />
      </Header>

      <Main className='space-y-6 pb-8'>
        <section className='space-y-2'>
          <Badge
            variant='outline'
            className='w-fit gap-2 rounded-full border-transparent bg-muted/40 px-3 py-1 font-semibold tracking-[0.14em] text-primary uppercase'
          >
            Fila de aprovação
          </Badge>
          <h1 className='text-3xl font-semibold tracking-tight text-balance'>
            Documentos aguardando decisão
          </h1>
          <p className='max-w-3xl text-pretty text-muted-foreground'>
            Revise os TRs em andamento, leia o documento consolidado e decida
            entre aprovar ou solicitar ajustes.
          </p>
        </section>

        <section className='grid gap-3 md:grid-cols-3'>
          <StatusCard label='Pendentes agora' value={String(pendingItems.length)} />
          <StatusCard label='Em revisão' value={String(inReviewCount)} />
          <StatusCard
            label='Com ajustes solicitados'
            value={String(changesRequestedCount)}
          />
        </section>

        <section className='flex flex-wrap items-center justify-between gap-3'>
          <ToggleGroup
            type='single'
            value={statusFilter}
            onValueChange={(value) => {
              if (value) setStatusFilter(value as StatusFilter)
            }}
            variant='outline'
            size='sm'
            className='rounded-xl'
            aria-label='Filtrar por status'
          >
            <ToggleGroupItem value='all' className='gap-2'>
              Todos
              <Badge variant='secondary' className='ms-1 rounded-md font-normal'>
                {pendingItems.length}
              </Badge>
            </ToggleGroupItem>
            <ToggleGroupItem value='in_review' className='gap-2'>
              Em revisão
              <Badge variant='secondary' className='ms-1 rounded-md font-normal'>
                {inReviewCount}
              </Badge>
            </ToggleGroupItem>
            <ToggleGroupItem value='changes_requested' className='gap-2'>
              Ajustes solicitados
              <Badge variant='secondary' className='ms-1 rounded-md font-normal'>
                {changesRequestedCount}
              </Badge>
            </ToggleGroupItem>
          </ToggleGroup>
          <span className='text-xs text-muted-foreground'>
            Exibindo {reviewItems.length} de {pendingItems.length}
          </span>
        </section>

        <section className='grid gap-4 lg:grid-cols-2'>
          {reviewItems.map((item) => (
            <Card
              key={item.id}
              className='rounded-2xl border-0 shadow-border'
            >
              <CardHeader className='space-y-3'>
                <div className='flex items-center justify-between gap-3'>
                  <CardTitle className='font-mono text-lg font-semibold'>
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
                <TooltipProvider delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button asChild className='w-full rounded-xl'>
                        <Link to='/tr/$trId' params={{ trId: item.id }}>
                          <Eye aria-hidden='true' className='size-4' />
                          Revisar TR
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side='top' className='max-w-xs text-center'>
                      Abre o documento e o painel de comentários para registrar
                      a sua revisão.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardContent>
            </Card>
          ))}

          {reviewItems.length === 0 && (
            <Empty className='rounded-2xl border border-dashed lg:col-span-2'>
              <EmptyHeader>
                <EmptyMedia variant='icon'>
                  <ClipboardCheck className='size-6' />
                </EmptyMedia>
                <EmptyTitle>Nenhum TR pendente</EmptyTitle>
                <EmptyDescription>
                  Quando houver documentos em revisão, eles aparecerão aqui.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button asChild variant='outline' className='rounded-xl'>
                  <Link to='/trs'>Ver todos os TRs</Link>
                </Button>
              </EmptyContent>
            </Empty>
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
    <Card className='rounded-2xl border-0 shadow-border'>
      <CardContent className='space-y-1 px-5 py-4'>
        <div className='text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase'>
          {label}
        </div>
        <div className='text-2xl font-semibold tabular-nums'>{value}</div>
      </CardContent>
    </Card>
  )
}
