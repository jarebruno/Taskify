'use client'
import { ElementRef, useRef, useState } from 'react'
import { Layout } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'

import { FormInput } from '@/components/form/form-input'
import { Skeleton } from '@/components/ui/skeleton'
import { CardWithList } from '@/types'
import { useAction } from '@/hooks/use-action'
import { updateCard } from '@/actions/update-card'
import { toast } from 'sonner'

interface Props {
  card: CardWithList
}

export function CardHeader({ card }: Props) {
  const [title, setTitle] = useState(card.title)
  const queryClient = useQueryClient()
  const params = useParams()
  const inputRef = useRef<ElementRef<'input'>>(null)

  const onBlur = () => {
    inputRef.current?.form?.requestSubmit()
  }

  const { execute } = useAction(updateCard, {
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['card', card.id]
      })
      queryClient.invalidateQueries({
        queryKey: ['card-logs', card.id]
      })
      toast.success(`Renamed to ${data.title}`)
      setTitle(data.title)
    },
    onError: (error) => {
      toast.error(error)
    }
  })

  const onSubmit = (formData: FormData) => {
    const title = formData.get('title') as string
    const boardId = params.boardId as string
    execute({ boardId, title, id: card.id })
  }

  return (
    <div className='flex items-start gap-x-3 mb-6 w-full'>
      <Layout className='h-5 w-5 mt-1 text-neutral-700' />
      <div className='w-full'>
        <form action={onSubmit}>
          <FormInput 
            id='title'
            defaultValue={title}
            className='font-semibold text-xl px-1 text-neutral-700 bg-transparent border-transparent relative -left-1.5 w-[95%] focus-visible:bg-white focus-visible:border-input mb-0.5 truncate'
            ref={inputRef}
            onBlur={onBlur}
          />
        </form>
        <p className='text-sm text-muted-foreground'>
          in list <span className='underline'>{card.list.title}</span>
        </p>
      </div>
    </div>
  )
}

CardHeader.Skeleton = function CardHeaderSkeleton () {
  return (
    <div className='flex items-start gap-x-3 mb-6'>
      <Skeleton className='h-6 w-6 mt-1 bg-neutral-200'/>
      <div>
        <Skeleton className='w-24 h-6 mb-1 bg-neutral-200'/>
        <Skeleton className='w-24 h-6 bg-neutral-200'/>
      </div>
    </div>
  )
}
