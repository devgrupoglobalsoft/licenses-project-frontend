import { useState } from 'react'
import AreaCreateForm from '@/pages/application/areas/components/area-forms/area-create-form'
import { columns } from '@/pages/application/areas/components/areas-table/areas-columns'
import { filterFields } from '@/pages/application/areas/components/areas-table/areas-constants'
import { AreasFilterControls } from '@/pages/application/areas/components/areas-table/areas-filter-controls'
import { AreaDTO } from '@/types/dtos'
import { EnhancedModal } from '@/components/ui/enhanced-modal'
import DataTable from '@/components/shared/data-table'

type TAreasTableProps = {
  areas: AreaDTO[]
  page: number
  total: number
  pageCount: number
  onFiltersChange?: (filters: Array<{ id: string; value: string }>) => void
  onPaginationChange?: (page: number, pageSize: number) => void
  onSortingChange?: (sorting: Array<{ id: string; desc: boolean }>) => void
}

export default function AreasTable({
  areas,
  pageCount,
  total,
  onFiltersChange,
  onPaginationChange,
  onSortingChange,
}: TAreasTableProps) {
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
      {areas && (
        <>
          <DataTable
            columns={columns}
            data={areas}
            pageCount={pageCount}
            totalRows={total}
            filterFields={filterFields}
            FilterControls={AreasFilterControls}
            onFiltersChange={handleFiltersChange}
            onPaginationChange={handlePaginationChange}
            onSortingChange={handleSortingChange}
            selectedRows={selectedRows}
            onRowSelectionChange={handleRowSelectionChange}
            enableSorting={true}
            onAdd={() => setIsCreateModalOpen(true)}
          />

          <EnhancedModal
            title='Criar Nova Área'
            description='Crie uma nova área para atribuir nas aplicações'
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            size='md'
          >
            <AreaCreateForm modalClose={() => setIsCreateModalOpen(false)} />
          </EnhancedModal>
        </>
      )}
    </>
  )
}
