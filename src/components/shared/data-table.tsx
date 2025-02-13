import React, { useState, useEffect } from 'react'
import {
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from '@radix-ui/react-icons'
import { ArrowUpIcon, ArrowDownIcon } from '@radix-ui/react-icons'
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  SortingState,
} from '@tanstack/react-table'
import { Filter, Printer, Plus } from 'lucide-react'
import { ArrowUpDown, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DataTableFilterModal } from '@/components/shared/data-table-filter-modal'
import {
  DataTableFilterField,
  DataTableColumnDef,
} from '@/components/shared/data-table-types'
import { PrintDropdown } from './print-dropdown'

type PrintOption = {
  label: string
  value: string
  onClick: () => void
}

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  pageCount: number
  filterFields?: DataTableFilterField<TData>[]
  pageSizeOptions?: number[]
  initialFilters?: ColumnFiltersState
  initialActiveFiltersCount?: number
  onPaginationChange?: (page: number, pageSize: number) => void
  onFiltersChange?: (filters: Array<{ id: string; value: string }>) => void
  FilterControls: React.ComponentType<{
    table: any
    columns: any[]
    onApplyFilters: () => void
    onClearFilters: () => void
  }>
  baseRoute?: string
  hiddenColumns?: string[]
  onSortingChange?: (sorting: Array<{ id: string; desc: boolean }>) => void
  enableSorting?: boolean
  selectedRows?: string[]
  onRowSelectionChange?: (selectedRows: string[]) => void
  printOptions?: PrintOption[]
  onAdd?: () => void
}

// Add these translations
const ptPTTranslations = {
  rowsPerPage: 'Linhas por página',
  of: 'de',
  page: 'Página',
  noResults: 'Sem resultados.',
  rowsSelected: 'linha(s) selecionada(s).',
  goToFirstPage: 'Ir para primeira página',
  goToPreviousPage: 'Ir para página anterior',
  goToNextPage: 'Ir para próxima página',
  goToLastPage: 'Ir para última página',
}

export default function DataTable<TData, TValue>({
  columns,
  data,
  pageCount,
  pageSizeOptions = [10, 20, 30, 40, 50],
  initialFilters = [],
  initialActiveFiltersCount,
  onPaginationChange,
  onFiltersChange,
  FilterControls,
  baseRoute,
  hiddenColumns,
  onSortingChange,
  enableSorting = true,
  selectedRows,
  onRowSelectionChange,
  printOptions,
  onAdd,
}: DataTableProps<TData, TValue>) {
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [columnFilters, setColumnFilters] =
    useState<ColumnFiltersState>(initialFilters)
  const [pendingColumnFilters, setPendingColumnFilters] =
    useState<ColumnFiltersState>(initialFilters)
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [sorting, setSorting] = useState<SortingState>([])
  const navigate = useNavigate()
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>(
    selectedRows || []
  )

  useEffect(() => {
    setSelectedRowIds(selectedRows || [])
  }, [selectedRows])

  const handlePaginationChange = (
    newPageIndex: number,
    newPageSize: number
  ) => {
    setPageIndex(newPageIndex)
    setPageSize(newPageSize)
    if (onPaginationChange) {
      onPaginationChange(newPageIndex + 1, newPageSize)
    }
  }

  const handleApplyFilters = () => {
    setColumnFilters(pendingColumnFilters)
    if (onFiltersChange) {
      const formattedFilters = pendingColumnFilters
        .filter((filter) => filter.value)
        .map((filter) => ({
          id: filter.id,
          value: filter.value as string,
        }))
      onFiltersChange(formattedFilters)
    }
    setIsFilterModalOpen(false)
  }

  const handleClearFilters = () => {
    setPendingColumnFilters([])
    setColumnFilters([])
    if (onFiltersChange) {
      onFiltersChange([])
    }
    if (baseRoute) {
      navigate(baseRoute)
    }
    setIsFilterModalOpen(false)
  }

  const handleRowSelectionChange = (rowId: string, checked: boolean) => {
    const newSelectedRows = checked
      ? [...selectedRowIds, rowId]
      : selectedRowIds.filter((id) => id !== rowId)

    setSelectedRowIds(newSelectedRows)
    onRowSelectionChange?.(newSelectedRows)
  }

  const table = useReactTable({
    data,
    columns,
    pageCount: pageCount ?? -1,
    state: {
      pagination: { pageIndex, pageSize },
      columnFilters: pendingColumnFilters,
      columnVisibility: hiddenColumns?.reduce(
        (acc, columnId) => ({
          ...acc,
          [columnId]: false,
        }),
        {}
      ),
      sorting,
      rowSelection: selectedRowIds.reduce(
        (acc, id) => ({
          ...acc,
          [id]: true,
        }),
        {}
      ),
    },
    getRowId: (row: any) => row.id,
    enableRowSelection: true,
    onRowSelectionChange: (updater) => {
      if (typeof updater === 'function') {
        const newSelection = updater(table.getState().rowSelection)
        const selectedIds = Object.entries(newSelection)
          .filter(([_, selected]) => selected)
          .map(([id]) => id)
        setSelectedRowIds(selectedIds)
        onRowSelectionChange?.(selectedIds)
      }
    },
    onPaginationChange: (updater) => {
      if (typeof updater === 'function') {
        const newState = updater({
          pageIndex,
          pageSize,
        })
        handlePaginationChange(newState.pageIndex, newState.pageSize)
      }
    },
    onColumnFiltersChange: setPendingColumnFilters,
    onSortingChange: (updater) => {
      const newSorting =
        typeof updater === 'function' ? updater(sorting) : updater
      setSorting(newSorting)

      if (onSortingChange && newSorting.length > 0) {
        const column = columns.find(
          (col) =>
            col.id === newSorting[0].id ||
            ('accessorKey' in col && col.accessorKey === newSorting[0].id)
        ) as DataTableColumnDef<TData>

        if (column?.sortKey) {
          onSortingChange([
            {
              id: column.sortKey,
              desc: newSorting[0].desc,
            },
          ])
        }
      } else if (onSortingChange) {
        onSortingChange([])
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableSorting,
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true,
  })

  const getActiveFiltersCount = () => {
    const columnFiltersCount = columnFilters.filter(
      (filter) => filter.value
    ).length
    return Math.max(columnFiltersCount, initialActiveFiltersCount || 0)
  }

  return (
    <div className='flex flex-col space-y-4'>
      <div className='flex items-center justify-between gap-2 p-2 bg-primary/5 border-primary/10 border rounded-lg'>
        <div className='flex items-center gap-4'>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => setIsFilterModalOpen(true)}
            className='h-8 px-2 lg:px-3 flex items-center gap-2 text-primary hover:bg-primary/10 hover:text-primary'
          >
            <Filter className='h-4 w-4' />
            Filtros
            {getActiveFiltersCount() > 0 && (
              <Badge
                variant='secondary'
                className='ml-2 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs bg-primary/10 text-primary'
              >
                {getActiveFiltersCount()}
              </Badge>
            )}
          </Button>

          {(printOptions || onAdd) && (
            <div className='h-4 w-px bg-primary/20' />
          )}
          {printOptions && <PrintDropdown options={printOptions} />}
          {onAdd && printOptions && <div className='h-4 w-px bg-primary/20' />}
          {onAdd && (
            <Button
              variant='ghost'
              size='sm'
              onClick={onAdd}
              className='h-8 px-2 lg:px-3 flex items-center gap-2 text-primary hover:bg-primary/10 hover:text-primary'
            >
              <Plus className='h-4 w-4' />
              Adicionar
            </Button>
          )}
        </div>
      </div>

      <DataTableFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        table={table}
        columns={columns}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
        FilterControls={FilterControls}
      />

      <div className='flex flex-col gap-4 md:flex-row'>
        <div className='flex-1'>
          <ScrollArea className='h-[calc(100vh-500px)] rounded-md border md:h-[calc(100vh-400px)]'>
            <div className='rounded-md border'>
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id} className='hover:bg-muted'>
                      {headerGroup.headers.map((header) => (
                        <TableHead
                          key={header.id}
                          className={cn(
                            'h-12 font-semibold text-muted-foreground hover:text-foreground',
                            (
                              header.column
                                .columnDef as DataTableColumnDef<TData>
                            ).meta?.align === 'center' && 'text-center',
                            (
                              header.column
                                .columnDef as DataTableColumnDef<TData>
                            ).meta?.align === 'right' && 'text-right',
                            (
                              header.column
                                .columnDef as DataTableColumnDef<TData>
                            ).meta?.align === 'left' && 'text-left'
                          )}
                        >
                          {header.isPlaceholder ? null : (
                            <div
                              {...{
                                className: cn(
                                  'flex items-center gap-2',
                                  (
                                    header.column
                                      .columnDef as DataTableColumnDef<TData>
                                  ).meta?.align === 'center' &&
                                    'justify-center',
                                  (
                                    header.column
                                      .columnDef as DataTableColumnDef<TData>
                                  ).meta?.align === 'right' && 'justify-end',
                                  header.column.getCanSort() &&
                                    'cursor-pointer select-none'
                                ),
                                onClick:
                                  header.column.getToggleSortingHandler(),
                              }}
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                              {header.column.getCanSort() && (
                                <div className='w-4'>
                                  {header.column.getIsSorted() === 'asc' && (
                                    <ArrowUpIcon className='h-4 w-4' />
                                  )}
                                  {header.column.getIsSorted() === 'desc' && (
                                    <ArrowDownIcon className='h-4 w-4' />
                                  )}
                                  {!header.column.getIsSorted() && (
                                    <ArrowUpDown className='h-4 w-4 opacity-50' />
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && 'selected'}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell
                            key={cell.id}
                            className={cn(
                              (
                                cell.column
                                  .columnDef as DataTableColumnDef<TData>
                              ).meta?.width,
                              (
                                cell.column
                                  .columnDef as DataTableColumnDef<TData>
                              ).meta?.align === 'center' && 'text-center',
                              (
                                cell.column
                                  .columnDef as DataTableColumnDef<TData>
                              ).meta?.align === 'right' && 'text-right',
                              (
                                cell.column
                                  .columnDef as DataTableColumnDef<TData>
                              ).meta?.align === 'left' && 'text-left'
                            )}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className='h-24 text-center'
                      >
                        {ptPTTranslations.noResults}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <ScrollBar orientation='horizontal' />
          </ScrollArea>

          <div className='flex flex-col items-center justify-end gap-2 space-x-2 py-4 sm:flex-row'>
            <div className='flex w-full items-center justify-between'>
              <div className='flex-1 text-sm text-muted-foreground'>
                {table.getFilteredSelectedRowModel().rows.length}{' '}
                {ptPTTranslations.of} {table.getFilteredRowModel().rows.length}{' '}
                {ptPTTranslations.rowsSelected}
              </div>
              <div className='flex flex-col items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8'>
                <div className='flex items-center space-x-2'>
                  <p className='whitespace-nowrap text-sm font-medium'>
                    {ptPTTranslations.rowsPerPage}
                  </p>
                  <Select
                    value={`${table.getState().pagination.pageSize}`}
                    onValueChange={(value: string) => {
                      const newSize = Number(value)
                      table.setPageSize(newSize)
                    }}
                  >
                    <SelectTrigger className='h-8 w-[70px]'>
                      <SelectValue
                        placeholder={table.getState().pagination.pageSize}
                      />
                    </SelectTrigger>
                    <SelectContent side='top'>
                      {pageSizeOptions.map((pageSize) => (
                        <SelectItem key={pageSize} value={`${pageSize}`} />
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
