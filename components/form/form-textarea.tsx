'use client'

import { forwardRef, KeyboardEventHandler } from 'react'

import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { FormErrors } from './form-errors'
import { useFormStatus } from 'react-dom'

interface Props {
  id: string
  label?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  errors?: Record<string, string[] | undefined>
  defaultValue?: string
  className?: string
  onBlur?: () => void
  onClick?: () => void
  onKeyDown?: KeyboardEventHandler<HTMLTextAreaElement>
}

export const FormTextArea = forwardRef<HTMLTextAreaElement, Props>(({ id, label, placeholder, required, disabled, errors, defaultValue, className, onBlur, onClick, onKeyDown}, ref) => {
  const { pending } = useFormStatus()

  return (
    <div className='space-y-2 w-full'>
      <div className='space-y-1 h-full'>
        {
          label ? (
            <Label htmlFor={id} className='text-xs font-semibold text-neutral-700'>
              {label}
            </Label>
          ) : null
        }
        <Textarea
          onKeyDown={onKeyDown}
          onBlur={onBlur}
          onClick={onClick}
          ref={ref}
          required={required}
          placeholder={placeholder}
          name={id}
          id={id}
          defaultValue={defaultValue}
          disabled={pending || disabled}
          className={cn('resize-none focus-visible:ring-0 focus-visible:ring-offset-0 ring-0 focus:ring-0 outline-none shadow-sm', className)}
          aria-describedby={`${id}-errors`}
        />
        <FormErrors
          id={id}
          errors={errors}
        />
      </div>
    </div>
  )
})

FormTextArea.displayName = 'FormTextArea'