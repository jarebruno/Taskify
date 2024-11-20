import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from '@/components/ui/tooltip'

interface Props {
  children: React.ReactNode
  description: string
  side?: 'left' | 'right' | 'top' | 'bottom'
  sideOffset?: number 
}

export function Hint ({ children, description, side = 'bottom', sideOffset}:Props) {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger>
          {children}
        </TooltipTrigger>
        <TooltipContent sideOffset={sideOffset} side={side} className='text-xs max-w-[220px] break-words'>
          {description}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}