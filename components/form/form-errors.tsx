import { XCircle } from 'lucide-react'

interface Props {
  id: string
  errors?: Record<string, string[] | undefined>
}

export function FormErrors ({ id, errors} : Props) {
  if (!errors) return null
  return (
    <div id={`${id}-error`} aria-live='polite' className='mt-2 text-xs text-red-500'>
      {
        errors?.[id]?.map((error) => {
          return (
            <div key={error} className='flex items-center font-medium p-2 border border-rose-500 bg-rose-500/10 rounded-sm'>
              <XCircle className='h-4 w-4 mr-2'/>
              {error}
            </div>
          )
        })
      }
    </div>
  )
}