import { useState } from 'react'
import { columns } from '@/pages/application/areas/components/areas-table/areas-columns'
import { filterFields } from '@/pages/application/areas/components/areas-table/areas-constants'
import { AreasFilterControls } from '@/pages/application/areas/components/areas-table/areas-filter-controls'
import AreaTableActions from '@/pages/application/areas/components/areas-table/areas-table-action'
import { AreaDTO } from '@/types/dtos'
import DataTable from '@/components/shared/data-table'

type TAreasTableProps = {
  areas: AreaDTO[]
  page: number
  total: number
  pageCount: number
  onFiltersChange?: (filters: Array<{ id: string; value: string }>) => void
  onPaginationChange?: (page: number, pageSize: number) => void
  onSortingChange?: (sorting: Array<{ id: string; desc: boolean }>) => void
}

export default function AreasTable({
  areas,
  pageCount,
  total,
  onFiltersChange,
  onPaginationChange,
  onSortingChange,
}: TAreasTableProps) {
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
      <AreaTableActions />
      {areas && (
        <DataTable
          columns={columns}
          data={areas}
          pageCount={pageCount}
          totalRows={total}
          filterFields={filterFields}
          FilterControls={AreasFilterControls}
          onFiltersChange={handleFiltersChange}
          onPaginationChange={handlePaginationChange}
          onSortingChange={handleSortingChange}
          selectedRows={selectedRows}
          onRowSelectionChange={handleRowSelectionChange}
          enableSorting={true}
        />
      )}
    </>
  )
}
