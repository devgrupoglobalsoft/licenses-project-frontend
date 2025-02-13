import { CellAction } from '@/pages/platform/utilizadores/components/utilizadores-table/utilizadores-cell-action'
import { UtilizadorDTO } from '@/types/dtos'
import { Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { roleVariants, roleLabelMap } from '@/constants/roles'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnDef } from '@/components/shared/data-table-types'

export const columns: DataTableColumnDef<UtilizadorDTO>[] = [
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
    enableHiding: true,
    meta: {
      align: 'left',
    },
    cell: ({ row }) => (
      <div>
        {[row.original.firstName, row.original.lastName]
          .filter(Boolean)
          .join(' ') || '-'}
      </div>
    ),
  },
  {
    accessorKey: 'email',
    header: 'Email',
    sortKey: 'email',
    enableSorting: true,
    enableHiding: true,
    meta: {
      align: 'left',
    },
  },
  {
    accessorKey: 'roleId',
    header: 'Role',
    sortKey: 'roleId',
    enableSorting: true,
    enableHiding: true,
    meta: {
      align: 'left',
    },
    cell: ({ row }) => {
      const role = (row.original.roleId?.toLowerCase() ||
        'client') as keyof typeof roleLabelMap

      return (
        <div className={cn(roleVariants({ role }), 'w-fit')}>
          {roleLabelMap[role]}
        </div>
      )
    },
  },
  {
    accessorKey: 'clienteId',
    header: 'Cliente',
    sortKey: 'cliente.nome',
    enableSorting: true,
    enableHiding: true,
    meta: {
      align: 'left',
    },
    cell: ({ row }) => (
      <div
        className='truncate max-w-[200px]'
        title={row.original.cliente?.nome}
      >
        {row.original.cliente?.nome || '-'}
      </div>
    ),
  },
  {
    accessorKey: 'ativo',
    header: () => <div className='text-center'>Estado</div>,
    sortKey: 'ativo',
    enableSorting: true,
    enableHiding: true,
    meta: {
      align: 'center',
    },
    cell: ({ row }) => (
      <div className='flex items-center justify-center'>
        {row.original.isActive ? (
          <Check className='h-4 w-4 text-green-500' />
        ) : (
          <X className='h-4 w-4 text-destructive' />
        )}
      </div>
    ),
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => (
      <div className='flex items-center justify-end'>
        <CellAction data={row.original} />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
]
