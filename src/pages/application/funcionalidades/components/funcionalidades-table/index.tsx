import { useState } from 'react'
import { columns } from '@/pages/application/funcionalidades/components/funcionalidades-table/funcionalidades-columns'
import { filterFields } from '@/pages/application/funcionalidades/components/funcionalidades-table/funcionalidades-constants'
import { FuncionalidadesFilterControls } from '@/pages/application/funcionalidades/components/funcionalidades-table/funcionalidades-filter-controls'
import FuncionalidadesTableActions from '@/pages/application/funcionalidades/components/funcionalidades-table/funcionalidades-table-action'
import { FuncionalidadeDTO } from '@/types/dtos'
import DataTable from '@/components/shared/data-table'

type TFuncionalidadesTableProps = {
  funcionalidades: FuncionalidadeDTO[]
  page: number
  totalFuncionalidades: number
  pageCount: number
  onFiltersChange?: (filters: Array<{ id: string; value: string }>) => void
  onPaginationChange?: (page: number, pageSize: number) => void
}

export default function FuncionalidadesTable({
  funcionalidades,
  pageCount,
  onFiltersChange,
  onPaginationChange,
}: TFuncionalidadesTableProps) {
  const searchParams = new URLSearchParams(window.location.search)
  const moduloIdParam = searchParams.get('moduloId')

  const [currentFilters, setCurrentFilters] = useState<
    Array<{ id: string; value: string }>
  >(moduloIdParam ? [{ id: 'moduloId', value: moduloIdParam }] : [])

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

  const initialActiveFiltersCount = moduloIdParam ? 1 : 0

  return (
    <>
      <FuncionalidadesTableActions currentFilters={currentFilters} />
      {funcionalidades && (
        <DataTable
          columns={columns}
          data={funcionalidades}
          pageCount={pageCount}
          filterFields={filterFields}
          FilterControls={FuncionalidadesFilterControls}
          onFiltersChange={handleFiltersChange}
          onPaginationChange={handlePaginationChange}
          initialActiveFiltersCount={initialActiveFiltersCount}
          baseRoute='/funcionalidades'
        />
      )}
    </>
  )
}
