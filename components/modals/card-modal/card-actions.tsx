'use client'
import { copyCard } from '@/actions/copy-card'
import { deleteCard } from '@/actions/delete-card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useAction } from '@/hooks/use-action'
import { useCardModal } from '@/hooks/use-card-modal'
import { CardWithList } from '@/types'
import { Copy, Trash } from 'lucide-react'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'

interface Props {
  card: CardWithList
}

export function CardActions({ card }: Props) {
  const params = useParams()
  const cardModal = useCardModal()

  const { execute: executeCopyCard, isLoading: isCopying } = useAction(copyCard, {
    onSuccess: (data) => {
      toast.success(`Card ${data.title} copied`)
      cardModal.onClose()
    },
    onError: (error) => {
      toast.error(error)
    }
  })

  const onCopy = () => {
    const boardId = params.boardId as string
    executeCopyCard({
      id: card.id,
      boardId
    })
  }

  const { execute: executeDeleteCard, isLoading: isDeleting } = useAction(deleteCard, {
    onSuccess: (data) => {
      toast.success(`Card ${data.title} deleted`)
      cardModal.onClose()
    },
    onError: (error) => {
      toast.error(error)
    }
  })

  const onDelete = () => {
    const boardId = params.boardId as string
    executeDeleteCard({
      id: card.id,
      boardId
    })
  }

  return (
    <div className='space-y-2 mt-2'>
      <p className='text-xs font-semibold'>Actions</p>
      <Button variant='gray' className='w-full justify-start' size='inline' onClick={onCopy} disabled={isCopying}>
        <Copy className='h-4 w-4 mr-2'/>
        Copy
      </Button>
      <Button variant='gray' className='w-full justify-start' size='inline' onClick={onDelete} disabled={isDeleting}>
        <Trash className='h-4 w-4 mr-2'/>
        Delete
      </Button>
    </div>
  )
}

CardActions.Skeleton = function CardActionsSkeleton() {
  return (
    <div className='space-y-2 mt-2'>
      <Skeleton className='w-20 h-4 bg-neutral-200'/>
      <Skeleton className='w-full h-8 bg-neutral-200'/>
      <Skeleton className='w-full h-8 bg-neutral-200'/>
    </div>
  )
}