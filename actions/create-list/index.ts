'use server'
import { auth } from '@clerk/nextjs/server'

import { db } from '@/lib/db'

import { InputType, ReturnType } from './types'
import { revalidatePath } from 'next/cache'
import { createSafeAction } from '@/lib/create-safe-action'
import { CreateList } from './schema'

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = await auth()

  if (!userId || !orgId) {
    return {
      error: 'Unauthorized'
    }
  }

  const { title, boardId } = data

  let list
  try {
    const board = await db.board.findUnique({
      where: {
        id: boardId,
        orgId
      }
    })

    if (!board) {
      return {
        error: 'Board not found'
      }
    }

    const lastList = await db.list.findFirst({
      where: { boardId },
      orderBy: { order: 'desc' },
      select: { order: true }
    })

    const newOrder = lastList?.order ? lastList.order + 1 : 0

    list = await db.list.create({
      data: {
        title,
        boardId,
        order: newOrder
      }
    })

  } catch {
    return {
      error: 'Can create list'
    }
  }

  revalidatePath(`/board/${boardId}`)
  return { data: list }
}

export const createList = createSafeAction(CreateList, handler)