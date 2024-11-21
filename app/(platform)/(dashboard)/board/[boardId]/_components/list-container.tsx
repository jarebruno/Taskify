'use client'
import { ListWithCards } from '@/types'
import ListForm from './list-form'

interface Props {
  boardId: string
  listsWithCards: ListWithCards[]
}

export function ListContainer ({ boardId, listsWithCards }: Props ) {
  return (
    <ol>
      <ListForm />
      <div className='flex-shrink-0 w-1'>

      </div>
    </ol>
  )
}