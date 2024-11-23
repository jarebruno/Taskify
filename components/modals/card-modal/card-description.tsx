'use client'

import { updateCard } from '@/actions/update-card'
import { FormSubmit } from '@/components/form/form-submit'
import { FormTextArea } from '@/components/form/form-textarea'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useAction } from '@/hooks/use-action'
import { CardWithList } from '@/types'
import { useQueryClient } from '@tanstack/react-query'
import { AlignLeft } from 'lucide-react'
import { useParams } from 'next/navigation'
import { ElementRef, useRef, useState } from 'react'
import { toast } from 'sonner'
import { useEventListener, useOnClickOutside } from 'usehooks-ts'

interface Props {
  card: CardWithList
}

export function CardDescription({ card }: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const textAreaRef = useRef<ElementRef<'textarea'>>(null)
  const formRef = useRef<ElementRef<'form'>>(null)
  const queryClient = useQueryClient()
  const params = useParams()

  const enableEditing = () => {
    setIsEditing(true)
    setTimeout(() => {
      textAreaRef.current?.focus()
    })
  }

  const disableEditing = () => {
    setIsEditing(false)
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      disableEditing()
    }
  }

  useEventListener('keydown', onKeyDown)
  useOnClickOutside(formRef, disableEditing)

  const { execute, fieldErrors } = useAction(updateCard, {
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['card', data.id]
      })
      toast.success(`Card ${card.title} updated`)
      disableEditing()
    },
    onError: (error) => {
      toast.error(error)
    }
  })

  const onSubmit = (formData: FormData) => {
    const description = formData.get('description') as string
    const boardId = params.boardId as string

    execute({
      id: card.id,
      boardId,
      description
    })
  }

  return (
    <div className='flex items-start gap-x-3 w-full'>
      <AlignLeft className='h-5 w-5 mt-0.5 text-neutral-700'/>
      <div className='w-full'>
        <p className='font-semibold text-neutral-700 mb-2'>
          Description
        </p>
        {
          isEditing
            ? (
                <form
                  action={onSubmit}
                  ref={formRef}
                  className='space-y-2'
                >
                  <FormTextArea
                    ref={textAreaRef}
                    id='description'
                    className='w-full mt-2'
                    placeholder='Add a more detailed description...'
                    defaultValue={card.description || undefined}
                    errors={fieldErrors}
                  />
                  <div className='flex items-center gap-x-2'>
                    <FormSubmit>
                      Save
                    </FormSubmit>
                    <Button>
                      Cancel
                    </Button>
                  </div>
                </form>
              )
            : (
                <div
                  role='button'
                  className='min-h-[78px] bg-neutral-200 text-sm font-medium py-3 px-3.5 rounded-md'
                  onClick={enableEditing}
                >
                  {card.description || 'Add a more detailed description...'}
                </div>
              )
        }

      </div>
    </div>
  )
}

CardDescription.Skeleton = function CardDescriptionSkeleton() {
  return (
    <div className='flex items-start gap-x-3 w-full'>
      <Skeleton className='h-6 w-6 bg-neutral-200' />
      <div className='w-full'>
        <Skeleton className='w-24 h-6 mb-2 bg-neutral-200' />
        <Skeleton className='w-full h-[78px] bg-neutral-200' />
      </div>
    </div>
  )
}