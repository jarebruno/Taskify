'use client'
import { useCardModal } from '@/hooks/use-card-modal'
import { Draggable } from '@hello-pangea/dnd'
import { Card } from '@prisma/client'

interface Props {
  card: Card
  index: number
}

export function CardItem({ card, index }: Props) {
  const cardModal = useCardModal()
  return (
    <Draggable draggableId={card.id} index={index}>
      {
        (provided) => {
          return (
            <div
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              ref={provided.innerRef}
              className='truncate border-2 border-transparent hover:border-black py-2 px-3 text-sm bg-white rounded-md shadow-sm'
              role='button'
              onClick={() => {cardModal.onOpen(card.id)}}
            >
              {card.title}
            </div>
          )
        }
      }
    </Draggable>
  )
}