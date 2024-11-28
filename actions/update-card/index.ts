'use server'
import { auth } from '@clerk/nextjs/server'

import { db } from '@/lib/db'

import { InputType, ReturnType } from './types'
import { revalidatePath } from 'next/cache'
import { createSafeAction } from '@/lib/create-safe-action'
import { UpdateCard } from './schema'
import { createAuditLog } from '@/lib/create-audit-log'
import { ACTION, ENTITY_TYPE } from '@prisma/client'

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = await auth()

  if (!userId || !orgId) {
    return {
      error: 'Unauthorized'
    }
  }

  const { id, boardId, ...values } = data

  let card
  try {
    card = await db.card.update({
      where: {
        id,
        list: {
          board: {
            orgId
          }
        }
      },
      data: {
        ...values
      }
    })
    await createAuditLog({
      entityId: card.id,
      entityTitle: card.title,
      entityType: ENTITY_TYPE.CARD,
      action: ACTION.UPDATE
    })
  } catch (error) {
    return {
      error: 'Can not update card'
    }
  }

  revalidatePath(`/board/${id}`)
  return { data: card }
}

export const updateCard = createSafeAction(UpdateCard, handler)