import { useState } from 'react'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Link } from '@tanstack/react-router'
import { type Row } from '@tanstack/react-table'
import {
  CheckCircle2,
  Copy,
  Download,
  FileSearch,
  FileText,
  Trash2,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui/alert-dialog'
import { Button } from '@/shared/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'
import { type TRItem } from '@/features/tr/data/schema'

type TRsRowActionsProps<TData> = {
  row: Row<TData>
}

export function TRsRowActions<TData>({ row }: TRsRowActionsProps<TData>) {
  const tr = row.original as TRItem
  const [confirmOpen, setConfirmOpen] = useState(false)
  const isApproved = tr.status === 'approved'

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
            aria-label={`Abrir ações do ${tr.id}`}
          >
            <DotsHorizontalIcon aria-hidden='true' className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-[200px]'>
          <DropdownMenuItem asChild>
            <Link to='/tr/$trId' params={{ trId: tr.id }}>
              <FileSearch aria-hidden='true' className='size-4' />
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
            onClick={() => toast.success(`Duplicando ${tr.id}…`)}
          >
            <Copy aria-hidden='true' className='size-4' />
            Duplicar
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Download aria-hidden='true' className='size-4' />
              Baixar documento
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem
                onClick={() => toast.success(`${tr.id}.pdf baixado`)}
              >
                <FileText aria-hidden='true' className='size-4' />
                PDF
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => toast.success(`${tr.id}.docx baixado`)}
              >
                <FileText aria-hidden='true' className='size-4' />
                Word (.docx)
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          {!isApproved && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => toast.success(`${tr.id} aprovado`)}
              >
                <CheckCircle2 aria-hidden='true' className='size-4' />
                Aprovar TR
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant='destructive'
            onSelect={(event) => {
              // Previne o Radix de fechar o menu antes do dialog abrir,
              // evita flash visual de "menu fecha -> tela vazia -> dialog abre".
              event.preventDefault()
              setConfirmOpen(true)
            }}
          >
            <Trash2 aria-hidden='true' className='size-4' />
            Excluir TR
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir {tr.id}?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O documento e todo o histórico
              de edições serão removidos permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => toast.success(`${tr.id} excluído`)}
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive/40'
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
