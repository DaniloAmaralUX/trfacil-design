import { Link } from '@tanstack/react-router'
import { FilePlus2, FolderOpen } from 'lucide-react'
import { Header } from '@/shared/layout/header'
import { HeaderActions } from '@/shared/layout/header-actions'
import { Main } from '@/shared/layout/main'
import { Button } from '@/shared/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card'
import { recentTrs, trKpis, trStatusData, trUnitData } from '../data/app'
import { TRKpiCards } from './components/tr-kpi-cards'
import { TRRecentTable } from './components/tr-recent-table'
import { TRStatusChart } from './components/tr-status-chart'
import { TRUnitsChart } from './components/tr-units-chart'

export function TRDashboard() {
  return (
    <>
      <Header>
        <HeaderActions />
      </Header>

      <Main className='space-y-6 pb-8'>
        <section className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
          <div className='space-y-1'>
            <h1 className='text-2xl font-semibold tracking-tight'>
              Dashboard
            </h1>
            <p className='max-w-2xl text-sm text-muted-foreground'>
              Acompanhe o status dos documentos e conduza o fluxo de revisão
              com mais padronização e menos retrabalho.
            </p>
          </div>
          <div className='flex flex-wrap gap-2'>
            <Button asChild>
              <Link to='/novo-tr'>
                <FilePlus2 className='size-4' />
                Novo TR
              </Link>
            </Button>
            <Button asChild variant='outline'>
              <Link to='/trs'>
                <FolderOpen className='size-4' />
                Ver TRs
              </Link>
            </Button>
          </div>
        </section>

        <TRKpiCards items={trKpis.map((item) => ({ ...item }))} />

        <section className='grid gap-4 xl:grid-cols-5'>
          <Card className='rounded-2xl xl:col-span-2'>
            <CardHeader>
              <CardTitle>Status dos TRs</CardTitle>
              <CardDescription className='text-pretty'>
                Distribuição dos documentos entre elaboração, revisão e
                aprovação.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TRStatusChart data={trStatusData.map((item) => ({ ...item }))} />
            </CardContent>
          </Card>

          <Card className='rounded-2xl xl:col-span-3'>
            <CardHeader>
              <CardTitle>TRs por unidade</CardTitle>
              <CardDescription className='text-pretty'>
                Volume de documentos em andamento por casa do Sistema FIEPE.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TRUnitsChart data={trUnitData.map((item) => ({ ...item }))} />
            </CardContent>
          </Card>
        </section>

        <Card className='rounded-2xl'>
          <CardHeader>
            <CardTitle>TRs recentes</CardTitle>
            <CardDescription className='text-pretty'>
              Documentos atualizados recentemente para continuar a elaboração
              ou revisar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TRRecentTable items={recentTrs.map((item) => ({ ...item }))} />
          </CardContent>
        </Card>
      </Main>
    </>
  )
}
