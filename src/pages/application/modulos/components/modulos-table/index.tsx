import { useState } from 'react'
import ModuloCreateForm from '@/pages/application/modulos/components/modulo-forms/modulo-create-form'
import { columns } from '@/pages/application/modulos/components/modulos-table/modulos-columns'
import { filterFields } from '@/pages/application/modulos/components/modulos-table/modulos-constants'
import { ModulosFilterControls } from '@/pages/application/modulos/components/modulos-table/modulos-filter-controls'
import { ModuloDTO } from '@/types/dtos'
import { Plus } from 'lucide-react'
import { EnhancedModal } from '@/components/ui/enhanced-modal'
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
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
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

  const aplicacaoFilter = currentFilters?.find(
    (filter) => filter.id === 'aplicacaoId'
  )
  const preSelectedAplicacaoId = aplicacaoFilter?.value || ''

  return (
    <>
      {/* <ModulosTableActions currentFilters={currentFilters} /> */}
      {modulos && (
        <>
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
            toolbarActions={[
              {
                label: 'Adicionar',
                icon: <Plus className='h-4 w-4' />,
                onClick: () => setIsCreateModalOpen(true),
                variant: 'emerald',
              },
            ]}
          />

          <EnhancedModal
            title='Criar Novo Módulo'
            description='Crie um novo módulo'
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            size='lg'
          >
            <ModuloCreateForm
              modalClose={() => setIsCreateModalOpen(false)}
              preSelectedAplicacaoId={preSelectedAplicacaoId}
            />
          </EnhancedModal>
        </>
      )}
    </>
  )
}
