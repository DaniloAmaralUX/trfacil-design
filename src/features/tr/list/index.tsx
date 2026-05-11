import { Header } from '@/shared/layout/header'
import { HeaderActions } from '@/shared/layout/header-actions'
import { Main } from '@/shared/layout/main'
import { trs } from '@/features/tr/data/trs'
import { TRsPrimaryButtons } from './components/trs-primary-buttons'
import { TRsTable } from './components/trs-table'

export function TRListPage() {
  return (
    <>
      <Header fixed>
        <HeaderActions />
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>TRs</h2>
            <p className='text-muted-foreground'>
              Gerencie documentos em rascunho, revisão e aprovação com filtros
              rápidos.
            </p>
          </div>
          <TRsPrimaryButtons />
        </div>
        <TRsTable data={trs} />
      </Main>
    </>
  )
}
