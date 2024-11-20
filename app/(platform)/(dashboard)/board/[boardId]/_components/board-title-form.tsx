'use client'
import { ElementRef, useRef, useState } from 'react'
import { Board } from '@prisma/client'

import { Button } from '@/components/ui/button'
import { FormInput } from '@/components/form/form-input'
import { useAction } from '@/hooks/use-action'
import { updateBoard } from '@/actions/update-board'
import { toast } from 'sonner'

interface Props {
  board: Board
}

export function BoardTitleForm({ board }: Props) {
  const [isRenaming, setIsRenaming] = useState(false)
  const formRef = useRef<ElementRef<'form'>>(null)
  const inputRef = useRef<ElementRef<'input'>>(null)
  const [title, setTitle] = useState<string>(board.title)
  const disableRename = () => { setIsRenaming(false) }
  const enableRename = () => {
    setIsRenaming(true)
    setTimeout(() => {
      inputRef.current?.focus()
      inputRef.current?.select()
    })
  }

  const onSubmit = (formData: FormData) => {
    const title = formData.get('title') as string
    execute({ title, id: board.id })
  }

  const onBlur = () => {
    formRef.current?.requestSubmit()
  }

  const { execute } = useAction(updateBoard, {
    onSuccess: (data) => {
      toast.success(`Board ${data.title} updated!`)
      setTitle(data.title)
      disableRename()
    },
    onError: (error) => { toast.error(error) }
  })

  if (isRenaming) {
    return (
      <form className='flex items-center gap-x-2' ref={formRef} action={onSubmit}>
        <FormInput
          id='title'
          onBlur={onBlur}
          defaultValue={title}
          className='text-lg font-bold px-[7px] py-1 h-7 bg-transparent focus-visible:outline-none focus-visible:ring-transparent border-none'
          ref={inputRef}
        />
      </form>
    )
  }

  return (
    <Button
      className='font-bold text-lg h-auto w-auto p-1 px-2'
      variant='transparent'
      onClick={enableRename}
    >
      {title}
    </Button>
  )
}