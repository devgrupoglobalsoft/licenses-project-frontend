import { useState } from 'react'
import { UtilizadorCreateForm } from '@/pages/platform/utilizadores/components/utilizador-forms/utilizador-create-form'
import { columns } from '@/pages/platform/utilizadores/components/utilizadores-table/utilizadores-columns'
import { filterFields } from '@/pages/platform/utilizadores/components/utilizadores-table/utilizadores-constants'
import { UtilizadoresFilterControls } from '@/pages/platform/utilizadores/components/utilizadores-table/utilizadores-filter-controls'
import { UtilizadorDTO } from '@/types/dtos'
import { EnhancedModal } from '@/components/ui/enhanced-modal'
import DataTable from '@/components/shared/data-table'

type TUtilizadoresTableProps = {
  utilizadores: UtilizadorDTO[]
  page: number
  total: number
  pageCount: number
  onFiltersChange?: (filters: Array<{ id: string; value: string }>) => void
  onPaginationChange?: (page: number, pageSize: number) => void
  onSortingChange?: (sorting: Array<{ id: string; desc: boolean }>) => void
}

export default function UtilizadoresTable({
  utilizadores,
  pageCount,
  total,
  onFiltersChange,
  onPaginationChange,
  onSortingChange,
}: TUtilizadoresTableProps) {
  const searchParams = new URLSearchParams(window.location.search)
  const utilizadorIdParam = searchParams.get('utilizadorId')
  const initialActiveFiltersCount = utilizadorIdParam ? 1 : 0
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

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
      {utilizadores && (
        <>
          <DataTable
            columns={columns}
            data={utilizadores}
            pageCount={pageCount}
            filterFields={filterFields}
            FilterControls={UtilizadoresFilterControls}
            onFiltersChange={handleFiltersChange}
            onPaginationChange={handlePaginationChange}
            onSortingChange={handleSortingChange}
            initialActiveFiltersCount={initialActiveFiltersCount}
            baseRoute='/administracao/utilizadores'
            enableSorting={true}
            selectedRows={selectedRows}
            onRowSelectionChange={handleRowSelectionChange}
            totalRows={total}
            onAdd={() => setIsCreateModalOpen(true)}
          />

          <EnhancedModal
            title='Criar Novo Utilizador'
            description='Crie um novo utilizador'
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            size='xl'
          >
            <UtilizadorCreateForm
              modalClose={() => setIsCreateModalOpen(false)}
            />
          </EnhancedModal>
        </>
      )}
    </>
  )
}
