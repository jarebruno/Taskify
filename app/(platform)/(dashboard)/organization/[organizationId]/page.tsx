import { Separator } from '@/components/ui/separator';
import { Info } from './_components/info';
import { BoardList } from './_components/board-list';

export default function Page() {

  return (
    <div className='w-full mb-20'>
      <Info />
      <Separator className='my-4'/>
      <div className='px-2'>
        <BoardList />
      </div>
    </div>
  )
}