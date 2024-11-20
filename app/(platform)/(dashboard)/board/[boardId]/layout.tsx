import { auth } from '@clerk/nextjs/server';
import { notFound, redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { BoardNavbar } from './_components/board-navbar';

export async function generateMetadata({ params }: { params: { boardId: string }}) {
  const { orgId } = await auth()

  if (!orgId) {
    return {
      title: 'Board'
    }
  }

  const board = await db.board.findUnique({
    where: {
      id: params.boardId,
      orgId
    }
  })

  return {
    title: board?.title || 'Board'
  }
}

export default async function Layout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: { boardId: string }
}>) {

  const { orgId } = await auth()

  if (!orgId) {
    return redirect('/select-org')
  }

  const board = await db.board.findUnique({
    where: {
      id: params.boardId,
      orgId
    }
  })

  if (!board) {
    notFound()
  }

  return (
    <div className='relative h-full bg-no-repeat bg-cover bg-center' style={{ backgroundImage: `url(${board.imageFullUrl})` }}>
      <BoardNavbar board={board}/>
      <div className='absolute inset-0 bg-black/30'/>
      <main className='relative pt-28 h-full'>
        {children}
      </main>
    </div>
  )
}