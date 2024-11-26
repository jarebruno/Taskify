'use server'
import { auth, currentUser } from '@clerk/nextjs/server'

import { ACTION, ENTITY_TYPE } from '@prisma/client'

import { db } from './db'

interface Props {
  entityId: string
  entityType: ENTITY_TYPE
  entityTitle: string
  action: ACTION
}

export const createAuditLog = async ({entityId, entityTitle, entityType, action}: Props) => {
  try {
    const { orgId } = await auth()
    const user = await currentUser()

    if (!user || !orgId) {
      throw Error('User not found')
    }

    await db.auditLog.create({
      data: {
        orgId,
        entityId,
        entityType,
        entityTitle,
        action,
        userId: user.id,
        userImage: user.imageUrl,
        userName: `${user.firstName} ${user.lastName}`
      }
    })

  } catch (error) {
    console.log(`[AUDIT_LOG_ERROR] ${error}`)
  }
}