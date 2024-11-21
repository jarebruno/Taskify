import { List } from '@prisma/client'
import { Popover, PopoverTrigger, PopoverContent, PopoverClose } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, X } from 'lucide-react'
import { FormSubmit } from '@/components/form/form-submit'
import { Separator } from '@/components/ui/separator'
import { useAction } from '@/hooks/use-action'
import { toast } from 'sonner'
import { deleteList } from '@/actions/delete-list'
import { ElementRef, useRef } from 'react'
import { copyList } from '@/actions/copy-list'

interface Props {
  list: List
  onAddCard: () => void
}

export function ListOptions ({ list, onAddCard }: Props) {
  const closeRef = useRef<ElementRef<'button'>>(null)
  const { execute: executeCopy } = useAction(copyList, {
    onSuccess: (data) => {
      toast.success(`List ${data.title} duplicated`)
      closeRef.current?.click()
    },
    onError: (error) => {
      toast.error(error)
    }
  })

  const onCopySubmit = (formData: FormData) => {
    const id = formData.get('id') as string
    const boardId = formData.get('boardId') as string
    executeCopy({ id, boardId })
  }

  const { execute: executeDelete } = useAction(deleteList, {
    onSuccess: (data) => {
      toast.success(`List ${data.title} removed`)
      closeRef.current?.click()
    },
    onError: (error) => {
      toast.error(error)
    }
  })

  const onDeleteSubmit = (formData: FormData) => {
    const id = formData.get('id') as string
    const boardId = formData.get('boardId') as string
    executeDelete({ id, boardId })
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className='h-auto w-auto p-2' variant='ghost'>
          <MoreHorizontal className='h-4 w-4'/>
        </Button>
      </PopoverTrigger>
      <PopoverContent className='px-0 pt-3 pb-3' side='bottom' align='start'>
        <div className='text-sm font-semibold text-center text-neutral-600 pb-4'>
          List actions
        </div>
        <PopoverClose>
          <Button ref={closeRef} className='h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600' variant='ghost'>
            <X className='w-4 h-4'/>
          </Button>
        </PopoverClose>
        <Button onClick={onAddCard} className='rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm' variant='ghost'>
          Add card
        </Button>
        <form action={onCopySubmit}>
          <input hidden name='id' id='id' value={list.id}/>
          <input hidden name='boardId' id='boardId' value={list.boardId}/>
          <FormSubmit className='rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm' variant='ghost'>
            Copy list
          </FormSubmit>
        </form>
        <Separator />
        <form action={onDeleteSubmit}>
          <input hidden name='id' id='id' value={list.id}/>
          <input hidden name='boardId' id='boardId' value={list.boardId}/>
          <FormSubmit className='rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm' variant='ghost'>
            Delete list
          </FormSubmit>
        </form>
      </PopoverContent>
    </Popover>
  )
}