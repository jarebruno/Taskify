'use client'
import { Card } from '@prisma/client'

interface Props {
  card: Card
  index: number
}

export function CardItem({ card, index }: Props) {
  return (
    <div className='truncate border-2 border-transparent hover:border-black py-2 px-3 text-sm bg-white rounded-md shadow-sm' role='button'>
      { card.title}
    </div>
  )
}