'use server'
import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'

import { db } from '@/lib/db'
import { createSafeAction } from '@/lib/create-safe-action'

import { InputType, ReturnType } from './types'
import { UpdateCardOrder } from './schema'

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = await auth()

  if (!userId || !orgId) {
    return {
      error: 'Unauthorized'
    }
  }

  const { items, boardId } = data

  let cards
  try {
    const transaction = items.map(
      (card) => {
        return db.card.update({
          where: {
            id: card.id,
            list: {
              board: {
                orgId
              }
            }
          },
          data: {
            order: card.order,
            listId: card.listId
          }
        })
      }
    )

    cards = await db.$transaction(transaction)
  } catch {
    return {
      error: 'Can not update card order'
    }
  }

  revalidatePath(`/board/${boardId}`)
  return { data: cards }
}

export const updateCardOrder = createSafeAction(UpdateCardOrder, handler)