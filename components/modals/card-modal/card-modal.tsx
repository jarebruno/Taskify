'use client'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useCardModal } from '@/hooks/use-card-modal'
import { fetcher } from '@/lib/fetcher'
import { CardWithList } from '@/types'
import { useQuery } from '@tanstack/react-query'
import { CardHeader } from './card-header'

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


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        {
          !cardData
            ? <CardHeader.Skeleton />
            : <CardHeader card={cardData} />
        }
      </DialogContent>
    </Dialog>
  )
}