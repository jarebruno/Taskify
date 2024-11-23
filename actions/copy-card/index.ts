'use server'
import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'

import { db } from '@/lib/db'
import { createSafeAction } from '@/lib/create-safe-action'

import { InputType, ReturnType } from './types'
import { CopyCard } from './schema'

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = await auth()

  if (!userId || !orgId) {
    return {
      error: 'Unauthorized'
    }
  }

  const { id, boardId } = data

  let card
  try {
    const originalCard = await db.card.findUnique({
      where: {
        id,
        list: {
          board: {
            orgId
          }
        }
      }
    })

    if (!originalCard) throw('Card not found')
    
    const lastCard = await db.card.findFirst({
      where: {
        listId: originalCard.listId,
        list: {
          board: {
            orgId
          }
        }
      },
      select: {
        order: true
      },
      orderBy: {
        order: 'desc'
      }
    })

    if (!lastCard) throw('Last card not found')

    const newOrder = lastCard.order ? lastCard.order + 1 : 0

    card = await db.card.create({
      data: {
        title: `${originalCard.title} - Copy`,
        description: originalCard.description,
        order: newOrder,
        listId: originalCard.listId
      }
    })

  } catch {
    return {
      error: 'Can not duplicate card'
    }
  }

  revalidatePath(`/board/${boardId}`)
  return {
    data: card
  }
}

export const copyCard = createSafeAction(CopyCard, handler)