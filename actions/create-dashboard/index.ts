'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@clerk/nextjs/server'

import { db } from '@/lib/db'
import { createSafeAction } from '@/lib/create-safe-action'

import { InputType, ReturnType} from './types'
import { CreateBoard } from './schema'
import { ACTION, ENTITY_TYPE } from '@prisma/client'
import { createAuditLog } from '@/lib/create-audit-log'
import { hasAvailableCount, increaseAvailableAccount } from '@/lib/org-limit'
import { checkSubscription } from '@/lib/subscription'

const handler = async (data: InputType): Promise<ReturnType> => {

  const { userId, orgId } = await auth()
  if (!userId || !orgId) {
    return {
      error: 'Unauthorized'
    }
  }

  const canCreate = await hasAvailableCount()
  const isPro = await checkSubscription()

  if (!canCreate && !isPro) {
    return {
      error: 'You have reached your limit of free boards. Please upgrade to create more.'
    }
  }

  const { title, image, } = data

  const [
    imageId,
    imageThumbUrl,
    imageFullUrl,
    imageLinkHTML,
    imageUserName,
  ] = image.split('|')

  if (!title || !imageId || !imageThumbUrl || !imageFullUrl || !imageLinkHTML || !imageUserName) {
    return {
      error: 'Missing fields'
    }
  }

  let board

  try {
    board = await db.board.create({
      data: {
        orgId,
        title,
        imageId,
        imageThumbUrl,
        imageFullUrl,
        imageLinkHTML,
        imageUserName
      }
    })

    await createAuditLog({
      entityId: board.id,
      entityTitle: board.title,
      entityType: ENTITY_TYPE.BOARD,
      action: ACTION.CREATE
    })
    
    if (!isPro) {
      await increaseAvailableAccount()
    }
    
  } catch {
    return {
      error: 'Internal error'
    }
  }

  revalidatePath(`/board/${board.id}`)

  return {
    data: board
  }
}

export const createBoard = createSafeAction(CreateBoard, handler)