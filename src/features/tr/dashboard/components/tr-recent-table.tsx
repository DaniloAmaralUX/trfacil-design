import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table'

type RecentTR = {
  id: string
  title: string
  unit: string
  owner: string
  status: string
  updatedAt: string
}

type TRRecentTableProps = {
  items: RecentTR[]
}

const statusClasses: Record<string, string> = {
  Rascunho:
    'border-slate-300/70 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200',
  'Em revisão':
    'border-amber-300/70 bg-amber-100 text-amber-800 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-200',
  'Ajustes solicitados':
    'border-rose-300/70 bg-rose-100 text-rose-800 dark:border-rose-700 dark:bg-rose-950/40 dark:text-rose-200',
  Aprovado:
    'border-emerald-300/70 bg-emerald-100 text-emerald-800 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200',
}

export function TRRecentTable({ items }: TRRecentTableProps) {
  if (!items.length) {
    return (
      <div className='rounded-[20px] border border-dashed border-black/5 bg-muted/15 px-6 py-10 text-center text-sm text-muted-foreground dark:border-white/8'>
        Ainda não há TRs recentes para continuar ou revisar.
      </div>
    )
  }

  return (
    <div className='overflow-hidden rounded-[20px] border border-black/5 bg-muted/15 dark:border-white/8'>
      <Table>
        <TableHeader>
          <TableRow className='bg-muted/40'>
            <TableHead>ID</TableHead>
            <TableHead>Título</TableHead>
            <TableHead>Unidade</TableHead>
            <TableHead>Responsável</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Atualização</TableHead>
            <TableHead className='text-right'>Ação</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow
              key={item.id}
              className='transition-colors hover:bg-muted/35'
            >
              <TableCell className='font-medium tabular-nums'>
                {item.id}
              </TableCell>
              <TableCell className='max-w-[320px] min-w-0 truncate font-medium'>
                {item.title}
              </TableCell>
              <TableCell>{item.unit}</TableCell>
              <TableCell>{item.owner}</TableCell>
              <TableCell>
                <Badge
                  variant='outline'
                  className={statusClasses[item.status] ?? ''}
                >
                  {item.status}
                </Badge>
              </TableCell>
              <TableCell className='tabular-nums'>{item.updatedAt}</TableCell>
              <TableCell className='text-right'>
                <Button
                  variant='ghost'
                  size='sm'
                  asChild
                  className='rounded-lg'
                >
                  <Link to='/tr/$trId' params={{ trId: item.id }}>
                    Abrir
                    <ArrowRight className='size-4' />
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
