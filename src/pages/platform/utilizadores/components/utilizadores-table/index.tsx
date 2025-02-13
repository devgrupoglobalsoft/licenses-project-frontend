import { useState } from 'react'
import { columns } from '@/pages/platform/utilizadores/components/utilizadores-table/utilizadores-columns'
import { filterFields } from '@/pages/platform/utilizadores/components/utilizadores-table/utilizadores-constants'
import { UtilizadoresFilterControls } from '@/pages/platform/utilizadores/components/utilizadores-table/utilizadores-filter-controls'
import UtilizadoresTableActions from '@/pages/platform/utilizadores/components/utilizadores-table/utilizadores-table-action'
import { UtilizadorDTO } from '@/types/dtos'
import DataTable from '@/components/shared/data-table'

type TUtilizadoresTableProps = {
  utilizadores: UtilizadorDTO[]
  page: number
  total: number
  pageCount: number
  onFiltersChange?: (filters: Array<{ id: string; value: string }>) => void
  onPaginationChange?: (page: number, pageSize: number) => void
  onSortingChange?: (sorting: Array<{ id: string; desc: boolean }>) => void
}

export default function UtilizadoresTable({
  utilizadores,
  pageCount,
  total,
  onFiltersChange,
  onPaginationChange,
  onSortingChange,
}: TUtilizadoresTableProps) {
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

  const handleSortingChange = (
    sorting: Array<{ id: string; desc: boolean }>
  ) => {
    if (onSortingChange) {
      onSortingChange(sorting)
    }
  }

  const handleRowSelectionChange = (newSelectedRows: string[]) => {
    setSelectedRows(newSelectedRows)
  }

  return (
    <>
      <UtilizadoresTableActions
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
      />
      {utilizadores && (
        <DataTable
          columns={columns}
          data={utilizadores}
          pageCount={pageCount}
          filterFields={filterFields}
          FilterControls={UtilizadoresFilterControls}
          onFiltersChange={handleFiltersChange}
          onPaginationChange={handlePaginationChange}
          onSortingChange={handleSortingChange}
          initialActiveFiltersCount={initialActiveFiltersCount}
          baseRoute='/administracao/utilizadores'
          enableSorting={true}
          selectedRows={selectedRows}
          onRowSelectionChange={handleRowSelectionChange}
          totalRows={total}
        />
      )}
    </>
  )
}
