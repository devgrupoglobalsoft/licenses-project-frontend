import { useState } from 'react'
import LicencaCreateForm from '@/pages/platform/licencas/components/licenca-forms/licenca-create-form'
import { LicencaDTO } from '@/types/dtos'
import { Plus } from 'lucide-react'
import { EnhancedModal } from '@/components/ui/enhanced-modal'
import DataTable from '@/components/shared/data-table'
import { columns } from './licencas-columns'
import { filterFields } from './licencas-constants'
import { LicencasFilterControls } from './licencas-filter-controls'

type TLicencasTableProps = {
  licencas: LicencaDTO[]
  page: number
  total: number
  pageCount: number
  onFiltersChange?: (filters: Array<{ id: string; value: string }>) => void
  onPaginationChange?: (page: number, pageSize: number) => void
  onSortingChange?: (sorting: Array<{ id: string; desc: boolean }>) => void
}

export function LicencasTable({
  licencas,
  pageCount,
  total,
  onFiltersChange,
  onPaginationChange,
  onSortingChange,
}: TLicencasTableProps) {
  const searchParams = new URLSearchParams(window.location.search)
  const clienteIdParam = searchParams.get('clienteId')
  const initialActiveFiltersCount = clienteIdParam ? 1 : 0
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
      {/* <LicencasTableActions /> */}
      {licencas && (
        <>
          <DataTable
            columns={columns}
            data={licencas}
            pageCount={pageCount}
            filterFields={filterFields}
            FilterControls={LicencasFilterControls}
            onFiltersChange={handleFiltersChange}
            onPaginationChange={handlePaginationChange}
            onSortingChange={handleSortingChange}
            initialActiveFiltersCount={initialActiveFiltersCount}
            baseRoute='/administracao/licencas'
            enableSorting={true}
            selectedRows={selectedRows}
            onRowSelectionChange={handleRowSelectionChange}
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
            title='Criar Nova Licença'
            description='Crie uma nova licença'
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            size='xl'
          >
            <LicencaCreateForm modalClose={() => setIsCreateModalOpen(false)} />
          </EnhancedModal>
        </>
      )}
    </>
  )
}
