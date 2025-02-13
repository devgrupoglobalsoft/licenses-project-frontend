import { PrintOption } from '@/types/data-table'
import { Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface PrintDropdownProps {
  options?: PrintOption[]
}

export function PrintDropdown({ options }: PrintDropdownProps) {
  if (!options?.length) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          size='sm'
          className='h-8 px-2 lg:px-3 flex items-center gap-2 text-primary hover:bg-primary/10 hover:text-primary'
        >
          <Printer className='h-4 w-4' />
          Imprimir
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        {options.map((option) => (
          <DropdownMenuItem key={option.value} onClick={option.onClick}>
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
