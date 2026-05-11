import { Link } from '@tanstack/react-router'
import { ArrowUpRight, FilePlus2, FolderOpen } from 'lucide-react'
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
        <section className='overflow-hidden rounded-[28px] border border-black/5 bg-[linear-gradient(135deg,rgba(18,102,79,0.12),rgba(255,255,255,0)_44%),linear-gradient(180deg,rgba(255,255,255,0.98),rgba(244,247,246,0.94))] p-6 surface-card lg:p-8 dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(16,185,129,0.12),rgba(0,0,0,0)_40%),linear-gradient(180deg,rgba(16,24,22,0.98),rgba(10,15,14,0.96))]'>
          <div className='flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between'>
            <div className='space-y-3'>
              <div className='space-y-2'>
                <h1 className='text-3xl font-semibold tracking-tight text-balance lg:text-4xl'>
                  TR Fácil
                </h1>
                <p className='max-w-2xl text-[15px] leading-7 text-pretty text-muted-foreground'>
                  Estruture o TR em etapas, acompanhe o status dos documentos e
                  conduza o fluxo de revisão com mais padronização e menos
                  retrabalho.
                </p>
              </div>
            </div>

            <div className='flex flex-col gap-3 lg:items-end'>
              <div className='flex flex-wrap gap-2 lg:justify-end'>
                <Button
                  asChild
                  size='lg'
                  className='h-11 rounded-xl px-5 shadow-[0_14px_30px_rgba(20,94,78,0.24)]'
                >
                  <Link to='/novo-tr'>
                    <FilePlus2 size={18} />
                    Novo TR
                    <ArrowUpRight size={16} className='opacity-80' />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant='outline'
                  size='lg'
                  className='h-11 rounded-xl px-5'
                >
                  <Link to='/trs'>
                    <FolderOpen size={18} />
                    Ver TRs
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <TRKpiCards items={trKpis.map((item) => ({ ...item }))} />

        <section className='grid gap-4 xl:grid-cols-5'>
          <Card className='rounded-[24px] border-black/5 surface-card xl:col-span-2 dark:border-white/10'>
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

          <Card className='rounded-[24px] border-black/5 surface-card xl:col-span-3 dark:border-white/10'>
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

        <Card className='rounded-[24px] border-black/5 surface-card dark:border-white/10'>
          <CardHeader>
            <CardTitle>TRs recentes</CardTitle>
            <CardDescription className='text-pretty'>
              Documentos atualizados recentemente para continuar a elaboração ou
              revisar.
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
