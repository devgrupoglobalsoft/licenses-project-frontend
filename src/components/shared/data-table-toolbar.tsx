import { Table } from '@tanstack/react-table'
import { PrintOption } from '@/types/data-table'
import { Filter, Plus, Columns } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { PrintDropdown } from './print-dropdown'

interface DataTableToolbarProps {
  onFilterClick: () => void
  activeFiltersCount: number
  printOptions?: PrintOption[]
  onAdd?: () => void
  table?: Table<any>
}

export function DataTableToolbar({
  onFilterClick,
  activeFiltersCount,
  printOptions,
  onAdd,
  table,
}: DataTableToolbarProps) {
  return (
    <div className='flex items-center justify-between gap-4'>
      {/* Left side */}
      <div className='flex items-center gap-2'>
        <Button
          variant='outline'
          size='sm'
          onClick={onFilterClick}
          className='h-8 border-dashed'
        >
          <Filter className='h-4 w-4 sm:mr-2' />
          <span className='hidden sm:inline-block'>
            Filtros
            {activeFiltersCount > 0 && (
              <Badge
                variant='secondary'
                className='ml-2 bg-primary/20 text-primary'
              >
                {activeFiltersCount}
              </Badge>
            )}
          </span>
          {/* Mobile badge */}
          {activeFiltersCount > 0 && (
            <Badge
              variant='secondary'
              className='ml-1 bg-primary/20 text-primary sm:hidden'
            >
              {activeFiltersCount}
            </Badge>
          )}
        </Button>

        {table && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' size='sm' className='h-8 border-dashed'>
                <Columns className='h-4 w-4 sm:mr-2' />
                <span className='hidden sm:inline-block'>Colunas</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align='end'
              side='bottom'
              className='w-[200px]'
            >
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className='capitalize'
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {typeof column.columnDef.header === 'string'
                        ? column.columnDef.header
                        : 'accessorKey' in column.columnDef
                          ? String(column.columnDef.accessorKey)
                          : column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {printOptions && <PrintDropdown options={printOptions} />}
      </div>

      {/* Right side */}
      <div className='flex items-center gap-2'>
        {onAdd && (
          <Button
            variant='emerald'
            size='sm'
            onClick={onAdd}
            className='h-8 border-dashed'
          >
            <Plus className='h-4 w-4 sm:mr-2' />
            <span className='hidden sm:inline-block'>Adicionar</span>
          </Button>
        )}
      </div>
    </div>
  )
}
