import { useState } from 'react'
import PerfilAdminCreateForm from '@/pages/platform/perfis-admin/components/perfis-admin-forms/perfil-admin-create-form'
import { columns } from '@/pages/platform/perfis-admin/components/perfis-admin-table/perfis-admin-columns'
import { filterFields } from '@/pages/platform/perfis-admin/components/perfis-admin-table/perfis-admin-constants'
import { PerfisFilterControls } from '@/pages/platform/perfis-admin/components/perfis-admin-table/perfis-admin-filter-controls'
import { PerfilDTO } from '@/types/dtos'
import { Plus } from 'lucide-react'
import { EnhancedModal } from '@/components/ui/enhanced-modal'
import DataTable from '@/components/shared/data-table'

type TPerfisTableProps = {
  perfis: PerfilDTO[]
  page: number
  total: number
  pageCount: number
  onFiltersChange?: (filters: Array<{ id: string; value: string }>) => void
  onPaginationChange?: (page: number, pageSize: number) => void
  onSortingChange?: (sorting: Array<{ id: string; desc: boolean }>) => void
}

export function PerfisTable({
  perfis,
  pageCount,
  total,
  onFiltersChange,
  onPaginationChange,
  onSortingChange,
}: TPerfisTableProps) {
  const searchParams = new URLSearchParams(window.location.search)
  const perfilIdParam = searchParams.get('perfilId')
  const initialActiveFiltersCount = perfilIdParam ? 1 : 0
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
      {perfis && (
        <>
          <DataTable
            columns={columns}
            data={perfis}
            pageCount={pageCount}
            filterFields={filterFields}
            FilterControls={PerfisFilterControls}
            onFiltersChange={handleFiltersChange}
            onPaginationChange={handlePaginationChange}
            onSortingChange={handleSortingChange}
            initialActiveFiltersCount={initialActiveFiltersCount}
            baseRoute='/administracao/perfis/admin'
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
            title='Criar Novo Perfil'
            description='Crie um novo perfil'
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            size='md'
          >
            <PerfilAdminCreateForm
              modalClose={() => setIsCreateModalOpen(false)}
            />
          </EnhancedModal>
        </>
      )}
    </>
  )
}
