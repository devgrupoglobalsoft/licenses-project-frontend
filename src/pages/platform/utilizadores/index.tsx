import { useState, useEffect } from 'react'
import UtilizadoresTable from '@/pages/platform/utilizadores/components/utilizadores-table'
import {
  useGetUtilizadoresPaginated,
  usePrefetchAdjacentUtilizadores,
} from '@/pages/platform/utilizadores/queries/utilizadores-queries'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { DataTableSkeleton } from '@/components/shared/data-table-skeleton'
import PageHead from '@/components/shared/page-head'

export default function ClientesPage() {
  const searchParams = new URLSearchParams(window.location.search)
  const utilizadorIdParam = searchParams.get('utilizadorId')

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [filters, setFilters] = useState<Array<{ id: string; value: string }>>(
    utilizadorIdParam ? [{ id: 'utilizadorId', value: utilizadorIdParam }] : []
  )

  const { data, isLoading } = useGetUtilizadoresPaginated(
    page,
    pageSize,
    filters,
    null
  )
  const { prefetchPreviousPage, prefetchNextPage } =
    usePrefetchAdjacentUtilizadores(page, pageSize, filters)

  const handleFiltersChange = (
    newFilters: Array<{ id: string; value: string }>
  ) => {
    setFilters(newFilters)
    setPage(1) // Reset to first page when filters change
  }

  const handlePaginationChange = (newPage: number, newPageSize: number) => {
    setPage(newPage)
    setPageSize(newPageSize)
  }

  useEffect(() => {
    prefetchPreviousPage()
    prefetchNextPage()
  }, [page, pageSize, filters])

  const utilizadores = data?.info?.data || []
  const totalUtilizadores = data?.info?.totalCount || 0
  const pageCount = data?.info?.totalPages || 0

  if (isLoading) {
    return (
      <div className='p-5'>
        <DataTableSkeleton
          columnCount={6}
          filterableColumnCount={2}
          searchableColumnCount={1}
        />
      </div>
    )
  }

  return (
    <div className='p-4 md:p-8'>
      <PageHead title='Aplicações | GSLP' />
      <Breadcrumbs
        items={[
          { title: 'Administração', link: '/administracao' },
          { title: 'Utilizadores', link: '/utilizadores' },
        ]}
      />
      <UtilizadoresTable
        utilizadores={utilizadores}
        page={page}
        totalUtilizadores={totalUtilizadores}
        pageCount={pageCount}
        onFiltersChange={handleFiltersChange}
        onPaginationChange={handlePaginationChange}
      />
    </div>
  )
}
