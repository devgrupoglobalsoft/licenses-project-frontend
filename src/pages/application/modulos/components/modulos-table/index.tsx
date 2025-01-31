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
  totalModulos: number
  pageCount: number
  onFiltersChange?: (filters: Array<{ id: string; value: string }>) => void
  onPaginationChange?: (page: number, pageSize: number) => void
}

export default function ModulosTable({
  modulos,
  pageCount,
  onFiltersChange,
  onPaginationChange,
}: TModulosTableProps) {
  const searchParams = new URLSearchParams(window.location.search)
  const aplicacaoIdParam = searchParams.get('aplicacaoId')

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

  const initialActiveFiltersCount = aplicacaoIdParam ? 1 : 0

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
          hiddenColumns={['areaId']} // Pass the columns you want to hide
          onFiltersChange={handleFiltersChange}
          onPaginationChange={handlePaginationChange}
          initialActiveFiltersCount={initialActiveFiltersCount}
          baseRoute='/administracao/modulos'
        />
      )}
    </>
  )
}
