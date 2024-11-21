import { ListWithCards } from '@/types'
import { ListHeader } from './list-header'
import { ElementRef, useRef, useState } from 'react'
import { CardForm } from './card-form'
import { cn } from '@/lib/utils'
import { CardItem } from './card-item'

interface Props {
  index: number
  listWithCards: ListWithCards
}

export function ListItem({ listWithCards, index }: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const textAreaRef = useRef<ElementRef<'textarea'>>(null)

  const enableEditing = () => {
    setIsEditing(true)
  }

  const disableEditing = () => {
    setIsEditing(false)
    setTimeout(() => {
      textAreaRef.current?.focus()
    })
  }

  return (
    <div className='shrink-0 h-full w-[272px] select-none'>
      <div className='w-full rounded-md bg-[#f1f2f4] shadow-md pb-2'>
        <ListHeader list={listWithCards} onAddCard={enableEditing} />
        <ol
          className={cn(
            'mx-1 px-1 py-0.5 flex flex-col gap-y-2',
            listWithCards.cards.length > 0 ? 'mt-2' : 'mt-0'
          )}
          >
            {
              listWithCards.cards.map((card, index) => {
                return (
                  <CardItem index={index} key={card.id} card={card}/>
                )
              })  
            }
        </ol>
        <CardForm
          ref={textAreaRef}
          listId={listWithCards.id}
          isEditing={isEditing}
          enableEditing={enableEditing}
          disableEditing={disableEditing}
        />
      </div>
    </div>
  )
}
