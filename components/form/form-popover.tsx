'use client'
import { ElementRef, useRef } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'

import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { useAction } from '@/hooks/use-action'
import { createBoard } from '@/actions/create-dashboard'

import { FormInput } from './form-input'
import { FormSubmit } from './form-submit'
import { FormPicker } from './form-picker'
import { useProModal } from '@/hooks/use-pro-modal'

interface Props {
  children: React.ReactNode
  side?: 'left' | 'right' | 'top' | 'bottom'
  align?: 'start' | 'center' | 'end'
  sideOffset?: number
}

export function FormPopover({ children, side = 'bottom', align, sideOffset = 0 }: Props) {
  const closeRef = useRef<ElementRef<'button'>>(null)
  const router = useRouter()
  const proModal = useProModal()

  const { execute, fieldErrors } = useAction(createBoard, {
    onSuccess: (data) => {
      toast.success('Board created')
      closeRef.current?.click()
      router.push(`/board/${data.id}`)
    },
    onError: (error) => {
      toast.success(error)
      proModal.onOpen()
    }
  })

  const onSubmit = (formData: FormData) => {
    const title = formData.get('title') as string
    const image = formData.get('image') as string
    execute({ title, image })
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent
        align={align}
        className='w-80 pt-3'
        side={side}
        sideOffset={sideOffset}
      >
        <div className='text-sm font-medium text-neutral-600 pb-4'>
          Create board
        </div>
        <PopoverClose asChild>
          <Button className='h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600' variant='ghost' ref={closeRef}>
            <X className='h-4 w-4'/>
          </Button>
        </PopoverClose>
        <form action={onSubmit} className='space-y-4'>
          <div className='space-y-4'>
            <FormPicker id='image' errors={fieldErrors} />
            <FormInput id='title' label='Board title' type='text' errors={fieldErrors}/>
          </div>
          <FormSubmit className='w-full' variant='primary'>
            Create
          </FormSubmit>
        </form>
      </PopoverContent>
    </Popover>
  )
}