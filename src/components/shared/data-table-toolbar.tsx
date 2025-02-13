import { PrintOption } from '@/types/data-table'
import { Filter, Plus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PrintDropdown } from './print-dropdown'

interface DataTableToolbarProps {
  onFilterClick: () => void
  activeFiltersCount: number
  printOptions?: PrintOption[]
  onAdd?: () => void
}

export function DataTableToolbar({
  onFilterClick,
  activeFiltersCount,
  printOptions,
  onAdd,
}: DataTableToolbarProps) {
  return (
    <div className='flex items-center justify-between gap-2 p-2 bg-primary/5 border-primary/10 border rounded-lg'>
      <div className='flex items-center gap-4'>
        <Button
          variant='ghost'
          size='sm'
          onClick={onFilterClick}
          className='h-8 px-2 lg:px-3 flex items-center gap-2 text-primary hover:bg-primary/10 hover:text-primary'
        >
          <Filter className='h-4 w-4' />
          Filtros
          {activeFiltersCount > 0 && (
            <Badge
              variant='secondary'
              className='ml-2 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs bg-primary/10 text-primary'
            >
              {activeFiltersCount}
            </Badge>
          )}
        </Button>

        {(printOptions || onAdd) && <div className='h-4 w-px bg-primary/20' />}
        {printOptions && <PrintDropdown options={printOptions} />}
        {onAdd && printOptions && <div className='h-4 w-px bg-primary/20' />}
        {onAdd && (
          <Button
            variant='ghost'
            size='sm'
            onClick={onAdd}
            className='h-8 px-2 lg:px-3 flex items-center gap-2 text-primary hover:bg-primary/10 hover:text-primary'
          >
            <Plus className='h-4 w-4' />
            Adicionar
          </Button>
        )}
      </div>
    </div>
  )
}
