'use server'
import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'

import { db } from '@/lib/db'
import { createSafeAction } from '@/lib/create-safe-action'

import { InputType, ReturnType } from './types'
import { CreateCard } from './schema'


const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = await auth()

  if (!userId || !orgId) {
    return {
      error: 'Unauthorized'
    }
  }

  const { title, boardId, listId } = data

  console.log({
    title, boardId, listId
  })

  let card
  try {
    const list = await db.list.findUnique({
      where: {
        id: listId,
        boardId: boardId,
        board: {
          orgId
        }
      }
    })

    if (!list) {
      return {
        error: 'Can not find list'
      }
    }

    const lastCard = await db.card.findFirst({
      where: { listId },
      select: { order: true },
      orderBy: { order: 'desc' }
    })

    const newOrder = lastCard ? lastCard.order + 1 : 0

    card = await db.card.create({
      data: {
        title,
        listId,
        order: newOrder
      }
    })

  } catch {
    return {
      error: 'Can not create card'
    }
  }

  revalidatePath(`/board/${boardId}`)
  return { data: card }
}

export const createCard = createSafeAction(CreateCard, handler)