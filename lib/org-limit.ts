import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db'
import { MAX_FREE_BOARDS } from '@/constants/boards';

export const increaseAvailableAccount = async () => {
  const { orgId } = await auth()

  if (!orgId) {
    throw Error('Unauthorized')
  }

  const orgLimit = await db.orgLimit.findUnique({
    where: { orgId }
  })

  if (orgLimit) {
    await db.orgLimit.update({
      where: { orgId },
      data: { count: orgLimit.count + 1}
    })
  } else {
    await db.orgLimit.create({
      data: { orgId, count: 1}
    })
  }
}

export const decreaseAvailableAccount = async () => {
  const { orgId } = await auth()

  if (!orgId) {
    throw Error('Unauthorized')
  }

  const orgLimit = await db.orgLimit.findUnique({
    where: { orgId }
  })

  if (orgLimit) {
    await db.orgLimit.update({
      where: { orgId },
      data: { count: orgLimit.count > 0 ? orgLimit.count - 1 : 0}
    })
  } else {
    await db.orgLimit.create({
      data: { orgId, count: 1}
    })
  }
}

export const hasAvailableCount = async () => {
  const { orgId } = await auth()

  if (!orgId) {
    throw Error('Unauthorized')
  }

  const orgLimit = await db.orgLimit.findUnique({
    where: { orgId }
  })

  return !orgLimit || orgLimit.count < MAX_FREE_BOARDS
 
}

export const getAvailableAccount = async () => {
  const { orgId } = await auth()

  if (!orgId) {
    return 0
  }

  const orgLimit = await db.orgLimit.findUnique({
    where: { orgId }
  })

  return !orgLimit ? 0 : orgLimit.count
}