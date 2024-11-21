import { ListWithCards } from '@/types'
import { ListHeader } from './list-header'

interface Props {
  index: number
  listWithCards: ListWithCards
}

export function ListItem({ listWithCards, index }: Props) {
  return (
    <div className='shrink-0 h-full w-[272px] select-none'>
      <div className='w-full rounded-md bg-[#f1f2f4] shadow-md pb-2'>
        <ListHeader list={listWithCards} />
      </div>
    </div>
  )
}