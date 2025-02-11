import { useState } from 'react'
import { columns } from '@/pages/platform/licencas/components/licencas-table/licencas-columns'
import { filterFields } from '@/pages/platform/licencas/components/licencas-table/licencas-constants'
import { LicencasFilterControls } from '@/pages/platform/licencas/components/licencas-table/licencas-filter-controls'
import LicencasTableActions from '@/pages/platform/licencas/components/licencas-table/licencas-table-actions'
import { LicencaDTO } from '@/types/dtos'
import DataTable from '@/components/shared/data-table'

type TLicencasTableProps = {
  licencas: LicencaDTO[]
  page: number
  totalLicencas: number
  pageCount: number
  onFiltersChange?: (filters: Array<{ id: string; value: string }>) => void
  onPaginationChange?: (page: number, pageSize: number) => void
  onSortingChange?: (sorting: Array<{ id: string; desc: boolean }>) => void
}

export function LicencasTable({
  licencas,
  pageCount,
  onFiltersChange,
  onPaginationChange,
  onSortingChange,
}: TLicencasTableProps) {
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
      <LicencasTableActions />
      {licencas && (
        <DataTable
          columns={columns}
          data={licencas}
          pageCount={pageCount}
          filterFields={filterFields}
          FilterControls={LicencasFilterControls}
          onFiltersChange={handleFiltersChange}
          onPaginationChange={handlePaginationChange}
          onSortingChange={handleSortingChange}
          initialActiveFiltersCount={initialActiveFiltersCount}
          baseRoute='/administracao/licencas'
          enableSorting={true}
          selectedRows={selectedRows}
          onRowSelectionChange={setSelectedRows}
        />
      )}
    </>
  )
}
