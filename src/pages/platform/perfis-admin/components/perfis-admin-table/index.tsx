import { columns } from '@/pages/platform/perfis-admin/components/perfis-admin-table/perfis-admin-columns'
import { filterFields } from '@/pages/platform/perfis-admin/components/perfis-admin-table/perfis-admin-constants'
import { PerfisFilterControls } from '@/pages/platform/perfis-admin/components/perfis-admin-table/perfis-admin-filter-controls'
import PerfisTableActions from '@/pages/platform/perfis-admin/components/perfis-admin-table/perfis-admin-table-actions'
import { PerfilDTO } from '@/types/dtos'
import DataTable from '@/components/shared/data-table'

type TPerfisTableProps = {
  perfis: PerfilDTO[]
  page: number
  totalPerfis: number
  pageCount: number
  onFiltersChange?: (filters: Array<{ id: string; value: string }>) => void
  onPaginationChange?: (page: number, pageSize: number) => void
}

export function PerfisTable({
  perfis,
  pageCount,
  onFiltersChange,
  onPaginationChange,
}: TPerfisTableProps) {
  const searchParams = new URLSearchParams(window.location.search)
  const perfilIdParam = searchParams.get('perfilId')
  const initialActiveFiltersCount = perfilIdParam ? 1 : 0

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
      <PerfisTableActions />
      {perfis && (
        <DataTable
          columns={columns}
          data={perfis}
          pageCount={pageCount}
          filterFields={filterFields}
          FilterControls={PerfisFilterControls}
          onFiltersChange={handleFiltersChange}
          onPaginationChange={handlePaginationChange}
          initialActiveFiltersCount={initialActiveFiltersCount}
          baseRoute='/administracao/perfis/admin'
        />
      )}
    </>
  )
}
