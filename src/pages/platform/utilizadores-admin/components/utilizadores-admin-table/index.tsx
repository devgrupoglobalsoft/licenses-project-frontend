import { useState } from 'react'
import { columns } from '@/pages/platform/utilizadores-admin/components/utilizadores-admin-table/utilizadores-admin-columns'
import { filterFields } from '@/pages/platform/utilizadores-admin/components/utilizadores-admin-table/utilizadores-admin-constants'
import { UtilizadoresAdminFilterControls } from '@/pages/platform/utilizadores-admin/components/utilizadores-admin-table/utilizadores-admin-filter-controls'
import UtilizadoresAdminTableActions from '@/pages/platform/utilizadores-admin/components/utilizadores-admin-table/utilizadores-admin-table-action'
import { UtilizadorDTO } from '@/types/dtos'
import DataTable from '@/components/shared/data-table'

type TUtilizadoresAdminTableProps = {
  utilizadores: UtilizadorDTO[]
  page: number
  total: number
  pageCount: number
  onFiltersChange?: (filters: Array<{ id: string; value: string }>) => void
  onPaginationChange?: (page: number, pageSize: number) => void
}

export default function UtilizadoresAdminTable({
  utilizadores,
  pageCount,
  total,
  onFiltersChange,
  onPaginationChange,
}: TUtilizadoresAdminTableProps) {
  const searchParams = new URLSearchParams(window.location.search)
  const utilizadorIdParam = searchParams.get('utilizadorId')
  const initialActiveFiltersCount = utilizadorIdParam ? 1 : 0
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

  const handleRowSelectionChange = (newSelectedRows: string[]) => {
    setSelectedRows(newSelectedRows)
  }

  return (
    <>
      <UtilizadoresAdminTableActions />
      {utilizadores && (
        <DataTable
          columns={columns}
          data={utilizadores}
          pageCount={pageCount}
          filterFields={filterFields}
          FilterControls={UtilizadoresAdminFilterControls}
          onFiltersChange={handleFiltersChange}
          onPaginationChange={handlePaginationChange}
          initialActiveFiltersCount={initialActiveFiltersCount}
          baseRoute='/administracao/utilizadores/admin'
          selectedRows={selectedRows}
          onRowSelectionChange={handleRowSelectionChange}
          totalRows={total}
        />
      )}
    </>
  )
}
