import { columns } from '@/pages/platform/utilizadores/components/utilizadores-table/utilizadores-columns'
import { filterFields } from '@/pages/platform/utilizadores/components/utilizadores-table/utilizadores-constants'
import { UtilizadoresFilterControls } from '@/pages/platform/utilizadores/components/utilizadores-table/utilizadores-filter-controls'
import UtilizadoresTableActions from '@/pages/platform/utilizadores/components/utilizadores-table/utilizadores-table-action'
import { UtilizadorDTO } from '@/types/dtos'
import DataTable from '@/components/shared/data-table'

type TUtilizadoresTableProps = {
  utilizadores: UtilizadorDTO[]
  page: number
  totalUtilizadores: number
  pageCount: number
  onFiltersChange?: (filters: Array<{ id: string; value: string }>) => void
  onPaginationChange?: (page: number, pageSize: number) => void
}

export default function UtilizadoresTable({
  utilizadores,
  pageCount,
  onFiltersChange,
  onPaginationChange,
}: TUtilizadoresTableProps) {
  const searchParams = new URLSearchParams(window.location.search)
  const utilizadorIdParam = searchParams.get('utilizadorId')
  const initialActiveFiltersCount = utilizadorIdParam ? 1 : 0

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

  return (
    <>
      <UtilizadoresTableActions />
      {utilizadores && (
        <DataTable
          columns={columns}
          data={utilizadores}
          pageCount={pageCount}
          filterFields={filterFields}
          FilterControls={UtilizadoresFilterControls}
          onFiltersChange={handleFiltersChange}
          onPaginationChange={handlePaginationChange}
          initialActiveFiltersCount={initialActiveFiltersCount}
          baseRoute='/utilizadores'
        />
      )}
    </>
  )
}
