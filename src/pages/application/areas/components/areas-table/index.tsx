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
  totalAreas: number
  pageCount: number
  onFiltersChange?: (filters: Array<{ id: string; value: string }>) => void
  onPaginationChange?: (page: number, pageSize: number) => void
}

export default function AreasTable({
  areas,
  pageCount,
  onFiltersChange,
  onPaginationChange,
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

  return (
    <>
      <AreaTableActions />
      {areas && (
        <DataTable
          columns={columns}
          data={areas}
          pageCount={pageCount}
          filterFields={filterFields}
          FilterControls={AreasFilterControls}
          onFiltersChange={handleFiltersChange}
          onPaginationChange={handlePaginationChange}
          selectedRows={selectedRows}
          onRowSelectionChange={setSelectedRows}
        />
      )}
    </>
  )
}
