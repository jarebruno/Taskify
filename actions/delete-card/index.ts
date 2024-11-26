'use server'
import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'

import { db } from '@/lib/db'
import { createSafeAction } from '@/lib/create-safe-action'

import { InputType, ReturnType } from './types'
import { DeleteCard } from './schema'
import { createAuditLog } from '@/lib/create-audit-log'
import { ACTION, ENTITY_TYPE } from '@prisma/client'

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
    card = await db.card.delete({
      where: {
        id,
        list: {
          board: {
            orgId
          }
        }
      }
    })

    await createAuditLog({
      entityId: card.id,
      entityTitle: card.title,
      entityType: ENTITY_TYPE.CARD,
      action: ACTION.DELETE
    })

  } catch {
    return {
      error: 'Can not delete card'
    }
  }

  revalidatePath(`/board/${boardId}`)
  return {
    data: card
  }
}

export const deleteCard = createSafeAction(DeleteCard, handler)