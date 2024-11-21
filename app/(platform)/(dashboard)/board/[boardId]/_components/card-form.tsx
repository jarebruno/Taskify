import { createCard } from '@/actions/create-card'
import { FormSubmit } from '@/components/form/form-submit'
import { FormTextArea } from '@/components/form/form-textarea'
import { Button } from '@/components/ui/button'
import { useAction } from '@/hooks/use-action'
import { Plus, X } from 'lucide-react'
import { useParams } from 'next/navigation'
import { ElementRef, forwardRef, KeyboardEventHandler, useRef } from 'react'
import { toast } from 'sonner'
import { useEventListener, useOnClickOutside } from 'usehooks-ts'

interface Props {
  listId: string
  enableEditing: () => void
  disableEditing: () => void
  isEditing: boolean
}

export const CardForm = forwardRef<HTMLTextAreaElement, Props>(
  ({ listId, isEditing, enableEditing, disableEditing }, ref) => {

    const params = useParams()
    const formRef = useRef<ElementRef<'form'>>(null)

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') disableEditing()
    }

    useEventListener('keydown', onKeyDown)
    useOnClickOutside(formRef, disableEditing)

    const onTextareaKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
      if(e.key === 'Enter' && e.shiftKey) {
        e.preventDefault()
        formRef.current?.requestSubmit()
      }
    } 

    const { execute, fieldErrors } = useAction(createCard, {
      onSuccess: (data) => {
        toast.success(`Card ${data.title} created`)
        disableEditing()
        formRef.current?.reset()
      },
      onError: (error) => {
        toast.error(error)
      }
    })

    const onSubmit = (formData: FormData) => {
      const title = formData.get('title') as string
      const listId = formData.get('listId') as string
      const boardId = formData.get('boardId') as string

      execute({ title, listId, boardId })
    }

    if (isEditing) {
      return (
        <form className='m-1 py-0.5 px-1 space-y-4' action={onSubmit}>
          <FormTextArea
            id='title'
            onKeyDown={onTextareaKeyDown}
            ref={ref}
            placeholder='Enter a title for this card...'
            errors={fieldErrors}
          />
          <input hidden id='listId' name='listId' value={listId}/>
          <input hidden id='boardId' name='boardId' value={params.boardId}/>
          <div className='flex items-center gap-x-1'>
            <FormSubmit variant='primary'>
              Add card
            </FormSubmit>
            <Button onClick={disableEditing} size='sm' variant='ghost'>
              <X className='h-5 w-5'/>
            </Button>
          </div>
        </form>
      )
    }

    return (
      <div className='pt-2 px-2'>
        <Button
          className='h-auto px-2 py-1.5 w-full justify-start text-muted-foreground text-sm'
          size='sm'
          variant='ghost'
          onClick={enableEditing}
        >
          <Plus className='h-4 w-4 mr-2' />
          Add a card
        </Button>
      </div>
    )
  }
)

CardForm.displayName = 'CardForm'
