import { updateList } from '@/actions/update-list'
import { FormInput } from '@/components/form/form-input'
import { useAction } from '@/hooks/use-action'
import { List } from '@prisma/client'
import { ElementRef, useRef, useState } from 'react'
import { toast } from 'sonner'
import { useEventListener } from 'usehooks-ts'
import { ListOptions } from './list-options'

interface Props {
  list: List
}

export function ListHeader({ list }: Props) {
  const [title, setTitle] = useState(list.title)
  const [isEditing, setIsEditing] = useState(false)
  const formRef = useRef<ElementRef<'form'>>(null)
  const inputRef = useRef<ElementRef<'input'>>(null)

  const enableEditing = () => {
    setIsEditing(true)
    setTimeout(() => {
      inputRef.current?.focus()
      inputRef.current?.select()
    })
  }

  const disableEditing = () => {
    setIsEditing(false)
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      formRef.current?.requestSubmit()
    }
  }

  const onBlur = () => {
    formRef.current?.requestSubmit()
  }

  useEventListener('keydown', onKeyDown)

  const { execute, fieldErrors } = useAction(updateList, {
    onSuccess: (data) => {
      toast.success(`List ${data.title} renamed`)
      setTitle(data.title)
      disableEditing()
    },
    onError: (error) => {
      toast.error(error)
    }
  })

  const onSubmit = (formData: FormData) => {
    if (formData.get('title') !== title) {
      const title = formData.get('title') as string
      const id = formData.get('id') as string
      const boardId = formData.get('boardId') as string
      execute({ title, id, boardId })

    }
  }

  if (isEditing) {
    return (
      <div className='pt-2 px-2 text-sm font-semibold flex justify-between items-start gap-x-2'>
        <form
          action={onSubmit}
          className='flex-1 px-[2px]'
          ref={formRef}
        >
          <input hidden id='id' name='id' value={list.id}/>
          <input hidden id='boardId' name='boardId' value={list.boardId}/>
          <FormInput 
            ref={inputRef}
            onBlur={onBlur}
            id='title'
            placeholder='Enter list title'
            defaultValue={title}
            className='text-sm px-[7px] py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition truncate bg-transparent focus:bg-transparent'
            errors={fieldErrors}
          />
          <button hidden type='submit'/>
        </form>
      </div>
    )
  }

  return (
    <div className='pt-2 px-2 text-sm font-semibold flex justify-between items-start gap-x-2'>
      <div onClick={enableEditing} className='w-full text-sm px-2.5 py-1 h-7 font-medium border-transparent'>
        {title}
      </div>
      <ListOptions list={list} onAddCard={() => {}}/>
    </div>
  )
}