'use client'
import { useEffect, useState } from 'react'
import { CardModal } from '../modals/card-modal/card-modal'
import { ProModal } from '../modals/pro-modal'

export function ModalProvider(){
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <>
      <CardModal />
      <ProModal />
    </>
  )
}