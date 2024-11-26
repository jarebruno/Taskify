'use client'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useCardModal } from '@/hooks/use-card-modal'
import { fetcher } from '@/lib/fetcher'
import { CardWithList } from '@/types'
import { useQuery } from '@tanstack/react-query'
import { CardHeader } from './card-header'
import { CardDescription } from './card-description'
import { CardActions } from './card-actions'
import { AuditLog } from '@prisma/client'
import { CardActivity } from './card-activity'

export function CardModal() {
  const id = useCardModal((state) => state.id)
  const isOpen = useCardModal((state) => state.isOpen)
  const onClose = useCardModal((state) => state.onClose)

  const { data: cardData } = useQuery<CardWithList>({
    queryKey: ['card', id],
    queryFn: () => {
      return fetcher(`/api/cards/${id}`)
    }
  })

  const { data: cardLogs } = useQuery<AuditLog[]>({
    queryKey: ['card-logs', id],
    queryFn: () => {
      return fetcher(`/api/cards/${id}/logs`)
    }
  })


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        {
          !cardData
            ? <CardHeader.Skeleton />
            : <CardHeader card={cardData} />
        }
        <div className='grid grid-cols-1 md:grid-cols-4 md:gap-4'>
          <div className='col-span-3'>
            <div className='w-full space-y-6'>
              {
                !cardData
                ? <CardDescription.Skeleton />
                : <CardDescription card={cardData}/>
              }
                            {
                !cardLogs
                ? <CardActivity.Skeleton />
                : <CardActivity logs={cardLogs}/>
              }
            </div>
          </div>
          <div>
            {
              !cardData
              ? <CardActions.Skeleton />
              : <CardActions card={cardData}/>
            }
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}