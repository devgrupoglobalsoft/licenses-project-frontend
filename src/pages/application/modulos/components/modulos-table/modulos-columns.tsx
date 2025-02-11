import { CellAction } from '@/pages/application/modulos/components/modulos-table/modulos-cell-action'
import { ModuloDTO } from '@/types/dtos'
import { Check, X } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnDef } from '@/components/shared/data-table-types'

export const columns: DataTableColumnDef<ModuloDTO>[] = [
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
    accessorKey: 'descricao',
    header: 'Descrição',
    sortKey: 'descricao',
    enableSorting: true,
    meta: {
      align: 'left',
    },
  },
  {
    accessorKey: 'ativo',
    header: () => <div className='text-center'>Estado</div>,
    sortKey: 'ativo',
    enableSorting: true,
    meta: {
      align: 'center',
    },
    cell: ({ row }) => (
      <div className='flex items-center justify-center'>
        {row.original.ativo ? (
          <Check className='h-4 w-4 text-green-500' />
        ) : (
          <X className='h-4 w-4 text-destructive' />
        )}
      </div>
    ),
  },
  {
    accessorKey: 'aplicacaoId',
    header: 'Aplicação',
    sortKey: 'aplicacao.nome',
    enableSorting: true,
    meta: {
      align: 'left',
    },
    cell: ({ row }) => {
      const area = row.original.aplicacao?.area
      const appName = row.original.aplicacao?.nome || '-'

      if (!area) {
        return <div>{appName}</div>
      }

      return (
        <div
          className='inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
          style={{
            backgroundColor: `${area.color}20`,
            color: area.color,
            border: `1px solid ${area.color}`,
          }}
        >
          {appName}
        </div>
      )
    },
  },
  {
    accessorKey: 'areaId',
    accessorFn: (row) => row.aplicacao?.area?.nome,
    header: 'Área',
    sortKey: 'aplicacao.area.nome',
    enableSorting: true,
    meta: {
      align: 'left',
      hidden: false,
    },
    cell: ({ row }) => {
      const area = row.original.aplicacao?.area
      const areaName = area?.nome || '-'

      if (!area) {
        return <div>{areaName}</div>
      }

      return (
        <div
          className='inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
          style={{
            backgroundColor: `${area.color}20`,
            color: area.color,
            border: `1px solid ${area.color}`,
          }}
        >
          {areaName}
        </div>
      )
    },
    enableHiding: true,
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
  },
]
