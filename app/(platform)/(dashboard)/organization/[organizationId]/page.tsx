import { Separator } from '@/components/ui/separator';
import { Info } from './_components/info';
import { BoardList } from './_components/board-list';
import { Suspense } from 'react';

export default function Page() {

  return (
    <div className='w-full mb-20'>
      <Info />
      <Separator className='my-4'/>
      <div className='px-2'>
        <Suspense fallback={<BoardList.Skeleton />}>
          <BoardList />
        </Suspense>
      </div>
    </div>
  )
}