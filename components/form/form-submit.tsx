'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useFormStatus } from 'react-dom'

interface Props {
  children: React.ReactNode
  isDisabled?: boolean
  className?: string
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'primary' 
}

export function FormSubmit({ children, isDisabled, className, variant} : Props) {
  const { pending } = useFormStatus()
  return (
    <Button disabled={pending || isDisabled} type='submit' variant={variant} className={cn(className)} size='sm'>
      {children}
    </Button>
  )
}