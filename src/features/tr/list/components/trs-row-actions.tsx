import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Link } from '@tanstack/react-router'
import { type Row } from '@tanstack/react-table'
import { Copy, FileSearch, Send } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/shared/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'
import { type TRItem } from '@/features/tr/data/schema'

type TRsRowActionsProps<TData> = {
  row: Row<TData>
}

export function TRsRowActions<TData>({ row }: TRsRowActionsProps<TData>) {
  const tr = row.original as TRItem

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
          aria-label={`Abrir ações do ${tr.id}`}
        >
          <DotsHorizontalIcon className='h-4 w-4' />
          <span className='sr-only'>Abrir menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[190px]'>
        <DropdownMenuItem asChild>
          <Link to='/tr/$trId' params={{ trId: tr.id }}>
            <FileSearch className='size-4' />
            Abrir
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            to='/tr/$trId'
            params={{ trId: tr.id }}
            search={{ mode: 'edit' }}
          >
            Editar
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => toast.success(`Duplicando ${tr.id}...`)}
        >
          <Copy className='size-4' />
          Duplicar
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => toast.success(`${tr.id} enviado para revisão`)}
        >
          <Send className='size-4' />
          Enviar para revisão
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
