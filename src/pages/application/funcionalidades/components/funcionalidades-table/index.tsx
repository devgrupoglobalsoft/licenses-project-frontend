import { useState } from 'react'
import FuncionalidadeCreateForm from '@/pages/application/funcionalidades/components/funcionalidade-forms/funcionalidade-create-form'
import { FuncionalidadeDTO } from '@/types/dtos'
import { Plus } from 'lucide-react'
import { EnhancedModal } from '@/components/ui/enhanced-modal'
import DataTable from '@/components/shared/data-table'
import { columns } from './funcionalidades-columns'
import { filterFields } from './funcionalidades-constants'
import { FuncionalidadesFilterControls } from './funcionalidades-filter-controls'

type TFuncionalidadesTableProps = {
  funcionalidades: FuncionalidadeDTO[]
  page: number
  total: number
  pageCount: number
  onFiltersChange?: (filters: Array<{ id: string; value: string }>) => void
  onPaginationChange?: (page: number, pageSize: number) => void
  onSortingChange?: (sorting: Array<{ id: string; desc: boolean }>) => void
}

export default function FuncionalidadesTable({
  funcionalidades,
  pageCount,
  total,
  onFiltersChange,
  onPaginationChange,
  onSortingChange,
}: TFuncionalidadesTableProps) {
  const searchParams = new URLSearchParams(window.location.search)
  const moduloIdParam = searchParams.get('moduloId')
  const initialActiveFiltersCount = moduloIdParam ? 1 : 0
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
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

  const moduloFilter = currentFilters?.find(
    (filter) => filter.id === 'moduloId'
  )
  const preSelectedModuloId = moduloFilter?.value || ''

  return (
    <>
      {funcionalidades && (
        <>
          <DataTable
            columns={columns}
            data={funcionalidades}
            pageCount={pageCount}
            filterFields={filterFields}
            FilterControls={FuncionalidadesFilterControls}
            onFiltersChange={handleFiltersChange}
            onPaginationChange={handlePaginationChange}
            onSortingChange={handleSortingChange}
            initialActiveFiltersCount={initialActiveFiltersCount}
            baseRoute='/administracao/funcionalidades'
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
            title='Criar Nova Funcionalidade'
            description='Crie uma nova funcionalidade'
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            size='lg'
          >
            <FuncionalidadeCreateForm
              modalClose={() => setIsCreateModalOpen(false)}
              preSelectedModuloId={preSelectedModuloId}
            />
          </EnhancedModal>
        </>
      )}
    </>
  )
}
