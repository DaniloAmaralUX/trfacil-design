import { CheckCircle2, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/shared/ui/button'

export function TRReviewActions() {
  return (
    <div className='flex flex-wrap gap-3'>
      <Button
        className='rounded-xl'
        onClick={() => toast.success('TR aprovado com sucesso')}
      >
        <CheckCircle2 className='size-4' />
        Aprovar
      </Button>
      <Button
        variant='outline'
        className='rounded-xl'
        onClick={() => toast.success('Solicitação de ajustes registrada')}
      >
        <RotateCcw className='size-4' />
        Solicitar ajustes
      </Button>
    </div>
  )
}
