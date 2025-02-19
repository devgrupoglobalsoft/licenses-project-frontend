import { CellAction } from '@/pages/application/funcionalidades/components/funcionalidades-table/funcionalidades-cell-action'
import { FuncionalidadeDTO } from '@/types/dtos'
import { Check, X, Layers, FolderGit2 } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { ColoredBadge } from '@/components/shared/colored-badge'
import { DataTableColumnDef } from '@/components/shared/data-table-types'

export const columns: DataTableColumnDef<FuncionalidadeDTO>[] = [
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
  },
  {
    accessorKey: 'descricao',
    header: 'Descrição',
    sortKey: 'descricao',
    enableSorting: true,
    enableHiding: true,
    meta: {
      align: 'left',
    },
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
    sortKey: 'modulo.aplicacao.nome',
    enableSorting: true,
    enableHiding: true,
    meta: {
      align: 'left',
    },
    cell: ({ row }) => {
      const area = row.original.modulo?.aplicacao?.area
      const appName = row.original.modulo?.aplicacao?.nome || '-'

      return (
        <ColoredBadge
          label={appName}
          color={area?.color}
          icon={<Layers className='h-3.5 w-3.5' />}
          size='md'
        />
      )
    },
  },
  {
    accessorKey: 'moduloId',
    header: 'Módulo',
    sortKey: 'modulo.nome',
    enableSorting: true,
    enableHiding: true,
    meta: {
      align: 'left',
    },
    cell: ({ row }) => {
      const area = row.original.modulo?.aplicacao?.area
      const moduleName = row.original.modulo?.nome || '-'

      return (
        <ColoredBadge
          label={moduleName}
          color={area?.color}
          icon={<Layers className='h-3.5 w-3.5' />}
          size='md'
        />
      )
    },
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
