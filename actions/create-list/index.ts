'use server'
import { auth } from '@clerk/nextjs/server'

import { db } from '@/lib/db'

import { InputType, ReturnType } from './types'
import { revalidatePath } from 'next/cache'
import { createSafeAction } from '@/lib/create-safe-action'
import { CreateList } from './schema'
import { createAuditLog } from '@/lib/create-audit-log'
import { ACTION, ENTITY_TYPE } from '@prisma/client'

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

    await createAuditLog({
      entityId: list.id,
      entityTitle: list.title,
      entityType: ENTITY_TYPE.LIST,
      action: ACTION.CREATE
    })

  } catch {
    return {
      error: 'Can not create list'
    }
  }

  revalidatePath(`/board/${boardId}`)
  return { data: list }
}

export const createList = createSafeAction(CreateList, handler)