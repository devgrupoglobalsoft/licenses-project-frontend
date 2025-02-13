import { useState } from 'react'
import { columns } from '@/pages/application/modulos/components/modulos-table/modulos-columns'
import { filterFields } from '@/pages/application/modulos/components/modulos-table/modulos-constants'
import { ModulosFilterControls } from '@/pages/application/modulos/components/modulos-table/modulos-filter-controls'
import ModulosTableActions from '@/pages/application/modulos/components/modulos-table/modulos-table-actions'
import { ModuloDTO } from '@/types/dtos'
import DataTable from '@/components/shared/data-table'

type TModulosTableProps = {
  modulos: ModuloDTO[]
  page: number
  total: number
  pageCount: number
  onFiltersChange?: (filters: Array<{ id: string; value: string }>) => void
  onPaginationChange?: (page: number, pageSize: number) => void
  onSortingChange?: (sorting: Array<{ id: string; desc: boolean }>) => void
}

export default function ModulosTable({
  modulos,
  pageCount,
  total,
  onFiltersChange,
  onPaginationChange,
  onSortingChange,
}: TModulosTableProps) {
  const searchParams = new URLSearchParams(window.location.search)
  const aplicacaoIdParam = searchParams.get('aplicacaoId')
  const initialActiveFiltersCount = aplicacaoIdParam ? 1 : 0
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [currentFilters, setCurrentFilters] = useState<
    Array<{ id: string; value: string }>
  >(aplicacaoIdParam ? [{ id: 'aplicacaoId', value: aplicacaoIdParam }] : [])

  const handleFiltersChange = (
    filters: Array<{ id: string; value: string }>
  ) => {
    setCurrentFilters(filters)
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
      <ModulosTableActions currentFilters={currentFilters} />
      {modulos && (
        <DataTable
          columns={columns}
          data={modulos}
          pageCount={pageCount}
          filterFields={filterFields}
          FilterControls={ModulosFilterControls}
          onFiltersChange={handleFiltersChange}
          onPaginationChange={handlePaginationChange}
          onSortingChange={handleSortingChange}
          initialActiveFiltersCount={initialActiveFiltersCount}
          baseRoute='/administracao/modulos'
          selectedRows={selectedRows}
          onRowSelectionChange={handleRowSelectionChange}
          enableSorting={true}
          totalRows={total}
        />
      )}
    </>
  )
}
