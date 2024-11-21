'use server'
import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'

import { db } from '@/lib/db'
import { createSafeAction } from '@/lib/create-safe-action'

import { InputType, ReturnType } from './types'
import { CopyList } from './schema'

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = await auth()

  if (!userId || !orgId) {
    return {
      error: 'Unauthorized'
    }
  }

  const { id, boardId } = data

  let list
  try {
    const originalList = await db.list.findUnique({
      where: {
        id,
        boardId,
        board: {
          orgId
        }
      },
      include: {
        cards: true
      }
    })

    if (!originalList) throw('List not found')
    
    const lastList = await db.list.findFirst({
      where: {
        id,
        boardId,
        board: {
          orgId
        }
      },
      select: {
        order: true
      },
      orderBy: {
        order: 'desc'
      }
    })

    if (!lastList) throw('Last list not found')

    const newOrder = lastList.order ? lastList.order + 1 : 0

    list = await db.list.create({
      data: {
        boardId: originalList.boardId,
        title: `${originalList.title} - Copy`,
        order: newOrder,
        cards: {
          createMany: {
            data: originalList.cards.map((card) => {
              return {
                title: card.title,
                description: card.description,
                order: card.order
              }
            })
          }
        }
      }
    })

  } catch {
    return {
      error: 'Can not duplicate list'
    }
  }

  revalidatePath(`/board/${boardId}`)
  return {
    data: list
  }
}

export const copyList = createSafeAction(CopyList, handler)