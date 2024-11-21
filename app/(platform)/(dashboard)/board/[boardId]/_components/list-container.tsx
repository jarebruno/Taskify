'use client'
import { useEffect, useState } from 'react'

import { ListWithCards } from '@/types'

import ListForm from './list-form'
import { ListItem } from './list-item'

interface Props {
  boardId: string
  listsWithCards: ListWithCards[]
}

export function ListContainer ({ boardId, listsWithCards }: Props ) {
  const [list, setList] = useState<ListWithCards[]>(listsWithCards)

  useEffect(() => {
    setList(listsWithCards)
  }, [listsWithCards])

  return (
    <ol className='flex gap-x-3 h-full'>
      {
        list.map((item, index) => {
          return (
            <ListItem key={item.id} listWithCards={item} index={index+1}/>
          )
        })
      }
      <ListForm />
      <div className='flex-shrink-0 w-1'>
      </div>
    </ol>
  )
}