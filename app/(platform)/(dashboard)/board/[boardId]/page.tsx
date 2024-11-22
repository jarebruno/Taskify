import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { ListContainer } from './_components/list-container'

interface Props {
  params: {
    boardId: string
  }
}

export default async function Page({ params }: Props) {
  const { orgId } = await auth()
  if (!orgId) {
    redirect('/select-org')
  }

  const lists = await db.list.findMany({
    where:{
      boardId: params.boardId,
      board: {
        orgId
      }
    },
    include: {
      cards: {
        orderBy: {
          order: 'asc'
        }
      }
    },
    orderBy: {
      order: 'asc'
    }
  })

  console.log(lists)

  return (
    <div className='p-4 h-full overflow-x-auto'>
      <ListContainer listsWithCards={lists} boardId={params.boardId} />
    </div>
  )
}