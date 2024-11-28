'use client'
import { useEffect, useState } from 'react'
import { DragDropContext, Droppable } from '@hello-pangea/dnd'

import { ListWithCards } from '@/types'

import ListForm from './list-form'
import { ListItem } from './list-item'
import { useAction } from '@/hooks/use-action'
import { updateListOrder } from '@/actions/update-list-order'
import { toast } from 'sonner'
import { updateCardOrder } from '@/actions/update-card-order'

interface Props {
  boardId: string
  listsWithCards: ListWithCards[]
}

function reorder<T>(list: T[], startIndex: number, endIndex: number): T[] {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}

export function ListContainer ({ boardId, listsWithCards }: Props ) {
  const [lists, setLists] = useState<ListWithCards[]>(listsWithCards)

  const {
    execute: executeUpdateListOrder
  } = useAction(updateListOrder, {
    onSuccess: () => {
      toast.success('Lists ordered')
    },
    onError: (error) => {
      toast.error(error)
    }
  })

  const {
    execute: executeUpdateCardOrder
  } = useAction(updateCardOrder, {
    onSuccess: () => {
      toast.success('Cards ordered')
    },
    onError: (error) => {
      toast.error(error)
    }
  }) 

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onDragEnd = (result: any) => {
    const { destination, source, type } = result
    if (!destination) return
    if(
      destination.droppableId === source.droppableId && 
      destination.index === source.index
    ) return

    if (type === 'list') {
      const items = reorder(lists, source.index, destination.index).map(
        (item, index) => {
          return { ...item, order: index}
        }
      )
      setLists(items)
      executeUpdateListOrder({ items, boardId })
    }

    if (type === 'card') {
      const dataToOrder = [...lists]
      const sourceList = dataToOrder.find((list) => list.id === source.droppableId)
      const destinationList = dataToOrder.find((list) => list.id === destination.droppableId)

      if (!sourceList || !destinationList) return

      if (!sourceList.cards) {
        sourceList.cards = []
      }

      if (!destinationList.cards) {
        destinationList.cards = []
      }

      if (source.droppableId === destination.droppableId) {
        // From list is the same as the destination list
        const reorderedCards = reorder(
          sourceList.cards,
          source.index,
          destination.index
        )
        reorderedCards.forEach((card, index) => {
          card.order = index
        })
        sourceList.cards = reorderedCards
        setLists(dataToOrder)
        executeUpdateCardOrder({
          boardId,
          items: reorderedCards
        })
      } else {
        // From list is not the same as the destination list
        const [movedCard] = sourceList.cards.splice(source.index, 1)
        // Move card to destination list
        movedCard.listId = destination.droppableId
        destinationList.cards.splice(destination.index, 0, movedCard)

        // Reorder source list
        sourceList.cards.forEach((card, index) => {
          card.order = index
        })

        // Reorder destination list
        destinationList.cards.forEach((card, index) => {
          card.order = index
        })

        setLists(dataToOrder)
        executeUpdateCardOrder({
          boardId,
          items: destinationList.cards
        })
      }

    }
  }



  useEffect(() => {
    setLists(listsWithCards)
  }, [listsWithCards])

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId='lists' type='list' direction='horizontal'>
        {
          (provided) => {
            return (
              <ol {...provided.droppableProps} ref={provided.innerRef} className='flex gap-x-3 h-full'>
                {
                  lists.map((item, index) => {
                    return (
                      <ListItem key={item.id} listWithCards={item} index={index}/>
                    )
                  })
                }
                {provided.placeholder}
                <ListForm />
                <div className='flex-shrink-0 w-1'>
                </div>
              </ol>
            )
          }
        }
      </Droppable>
    </DragDropContext>
  )
}
