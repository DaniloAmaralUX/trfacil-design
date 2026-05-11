import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'

type ReviewComment = {
  author: string
  date: string
  message: string
}

type TRReviewCommentsProps = {
  comments: ReviewComment[]
}

export function TRReviewComments({ comments }: TRReviewCommentsProps) {
  return (
    <Card className='rounded-[24px] border-black/5 surface-card dark:border-white/10'>
      <CardHeader>
        <CardTitle>Comentários de revisão</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {comments.map((comment) => (
          <div
            key={`${comment.author}-${comment.date}-${comment.message}`}
            className='rounded-[18px] border border-black/5 bg-muted/15 p-4 dark:border-white/10'
          >
            <div className='flex items-center justify-between gap-3'>
              <span className='font-medium'>{comment.author}</span>
              <span className='text-xs text-muted-foreground tabular-nums'>
                {comment.date}
              </span>
            </div>
            <p className='mt-2 text-sm leading-6 text-pretty text-muted-foreground'>
              {comment.message}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
