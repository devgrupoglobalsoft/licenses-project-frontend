import { useState } from 'react'
import { columns } from '@/pages/platform/clientes/components/clientes-table/clientes-columns'
import { filterFields } from '@/pages/platform/clientes/components/clientes-table/clientes-constants'
import { ClientesFilterControls } from '@/pages/platform/clientes/components/clientes-table/clientes-filter-controls'
import ClientesTableActions from '@/pages/platform/clientes/components/clientes-table/clientes-table-action'
import { ClienteDTO } from '@/types/dtos'
import DataTable from '@/components/shared/data-table'

type TClientesTableProps = {
  clientes: ClienteDTO[]
  page: number
  totalClientes: number
  pageCount: number
  onFiltersChange?: (filters: Array<{ id: string; value: string }>) => void
  onPaginationChange?: (page: number, pageSize: number) => void
  onSortingChange?: (sorting: Array<{ id: string; desc: boolean }>) => void
}

export default function ClientesTable({
  clientes,
  pageCount,
  onFiltersChange,
  onPaginationChange,
  onSortingChange,
}: TClientesTableProps) {
  const searchParams = new URLSearchParams(window.location.search)
  const clienteIdParam = searchParams.get('clienteId')
  const initialActiveFiltersCount = clienteIdParam ? 1 : 0
  const [selectedRows, setSelectedRows] = useState<string[]>([])

  const handleFiltersChange = (
    filters: Array<{ id: string; value: string }>
  ) => {
    if (onFiltersChange) {
      onFiltersChange(filters)
    }
  }

  const handlePaginationChange = (page: number, pageSize: number) => {
    if (onPaginationChange) {
      onPaginationChange(page, pageSize)
    }
  }

  const handleSortingChange = (
    sorting: Array<{ id: string; desc: boolean }>
  ) => {
    if (onSortingChange) {
      onSortingChange(sorting)
    }
  }

  return (
    <>
      <ClientesTableActions />
      {clientes && (
        <DataTable
          columns={columns}
          data={clientes}
          pageCount={pageCount}
          filterFields={filterFields}
          FilterControls={ClientesFilterControls}
          onFiltersChange={handleFiltersChange}
          onPaginationChange={handlePaginationChange}
          onSortingChange={handleSortingChange}
          initialActiveFiltersCount={initialActiveFiltersCount}
          baseRoute='/administracao/clientes'
          enableSorting={true}
          selectedRows={selectedRows}
          onRowSelectionChange={setSelectedRows}
        />
      )}
    </>
  )
}
