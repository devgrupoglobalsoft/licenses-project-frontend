import { CellAction } from '@/pages/application/areas/components/areas-table/areas-cell-action'
import { AreaDTO } from '@/types/dtos'
import { PREDEFINED_COLORS } from '@/lib/constants/colors'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnDef } from '@/components/shared/data-table-types'

export const columns: DataTableColumnDef<AreaDTO>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Selecionar todos'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Selecionar linha'
      />
    ),
    enableSorting: false,
    enableHiding: false,
    meta: {
      width: 'w-[4%]',
    },
  },
  {
    accessorKey: 'nome',
    header: 'Nome',
    sortKey: 'nome',
    enableSorting: true,
    meta: {
      align: 'left',
    },
  },
  {
    accessorKey: 'color',
    header: 'Cor',
    enableSorting: false,
    sortKey: 'color',
    meta: {
      align: 'left',
    },
    cell: ({ row }) => {
      const color = row.original.color
      return (
        <div className='flex items-center gap-2'>
          <div
            className='h-4 w-4 rounded-full border'
            style={{ backgroundColor: color }}
          />
          <div
            className='inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold'
            style={{
              backgroundColor: `${color}20`,
              color: color,
              border: `1px solid ${color}`,
            }}
          >
            {PREDEFINED_COLORS.find((c) => c.value === color)?.label || color}
          </div>
        </div>
      )
    },
  },
  {
    id: 'actions',
    header: () => <div className='text-right'></div>,
    cell: ({ row }) => (
      <div className='flex items-center justify-end'>
        <CellAction data={row.original} />
      </div>
    ),
    enableSorting: false,
  },
]
