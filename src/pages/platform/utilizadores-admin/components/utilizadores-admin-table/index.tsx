import { useState } from 'react'
import { UtilizadorAdminCreateForm } from '@/pages/platform/utilizadores-admin/components/utilizador-admin-forms/utilizador-admin-create-form'
import { columns } from '@/pages/platform/utilizadores-admin/components/utilizadores-admin-table/utilizadores-admin-columns'
import { filterFields } from '@/pages/platform/utilizadores-admin/components/utilizadores-admin-table/utilizadores-admin-constants'
import { UtilizadoresAdminFilterControls } from '@/pages/platform/utilizadores-admin/components/utilizadores-admin-table/utilizadores-admin-filter-controls'
import { UtilizadorDTO } from '@/types/dtos'
import { Plus } from 'lucide-react'
import { EnhancedModal } from '@/components/ui/enhanced-modal'
import DataTable from '@/components/shared/data-table'

type TUtilizadoresAdminTableProps = {
  utilizadores: UtilizadorDTO[]
  page: number
  total: number
  pageCount: number
  onFiltersChange?: (filters: Array<{ id: string; value: string }>) => void
  onPaginationChange?: (page: number, pageSize: number) => void
  onSortingChange?: (sorting: Array<{ id: string; desc: boolean }>) => void
}

export default function UtilizadoresAdminTable({
  utilizadores,
  pageCount,
  total,
  onFiltersChange,
  onPaginationChange,
  onSortingChange,
}: TUtilizadoresAdminTableProps) {
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
            FilterControls={UtilizadoresAdminFilterControls}
            onFiltersChange={handleFiltersChange}
            onPaginationChange={handlePaginationChange}
            onSortingChange={handleSortingChange}
            initialActiveFiltersCount={initialActiveFiltersCount}
            baseRoute='/administracao/utilizadores/admin'
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
            title='Criar Novo Utilizador'
            description='Crie um novo utilizador'
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            size='xl'
          >
            <UtilizadorAdminCreateForm
              modalClose={() => setIsCreateModalOpen(false)}
            />
          </EnhancedModal>
        </>
      )}
    </>
  )
}
