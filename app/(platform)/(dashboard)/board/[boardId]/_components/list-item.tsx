'use client'
import { ElementRef, useRef, useState } from 'react'
import { Draggable, Droppable } from '@hello-pangea/dnd'

import { cn } from '@/lib/utils'
import { ListWithCards } from '@/types'

import { ListHeader } from './list-header'
import { CardForm } from './card-form'
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
    <Draggable draggableId={listWithCards.id} index={index}>
      {
        (provided) => {
          return (
            <li {...provided.draggableProps} ref={provided.innerRef} className='shrink-0 h-full w-[272px] select-none'>
              <div {...provided.dragHandleProps} className='w-full rounded-md bg-[#f1f2f4] shadow-md pb-2'>
                <ListHeader list={listWithCards} onAddCard={enableEditing} />
                <Droppable droppableId={listWithCards.id} type='card'>
                  {
                    (provided) => {
                      return (
                        <ol
                          ref={provided.innerRef}
                          {...provided.droppableProps}
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
                          {provided.placeholder}
                        </ol>
                      )
                    }
                  }
                </Droppable>
                <CardForm
                  ref={textAreaRef}
                  listId={listWithCards.id}
                  isEditing={isEditing}
                  enableEditing={enableEditing}
                  disableEditing={disableEditing}
                />
              </div>
            </li>
          )
        }
      }
    </Draggable>
  )
}
