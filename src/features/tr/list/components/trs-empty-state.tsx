import { Link } from '@tanstack/react-router'
import { FileSearch } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Card, CardContent } from '@/shared/ui/card'

type TRsEmptyStateProps = {
  filtered?: boolean
}

export function TRsEmptyState({ filtered = false }: TRsEmptyStateProps) {
  return (
    <Card className='rounded-[24px] border-dashed'>
      <CardContent className='flex flex-col items-center gap-4 px-6 py-12 text-center'>
        <div className='rounded-full bg-muted p-4'>
          <FileSearch className='size-8 text-muted-foreground' />
        </div>
        <div className='space-y-1'>
          <h2 className='text-lg font-semibold'>
            {filtered ? 'Nenhum TR encontrado' : 'Nenhum TR cadastrado'}
          </h2>
          <p className='max-w-md text-sm text-muted-foreground'>
            {filtered
              ? 'Ajuste os filtros ou a busca para encontrar um documento existente.'
              : 'Comece criando o primeiro Termo de Referência para testar o fluxo do produto.'}
          </p>
        </div>
        {!filtered && (
          <Button asChild className='rounded-xl'>
            <Link to='/novo-tr'>Criar novo TR</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
