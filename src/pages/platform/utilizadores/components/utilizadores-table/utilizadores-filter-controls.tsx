import { useState, useEffect } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { useGetClientesSelect } from '@/pages/platform/clientes/queries/clientes-queries'
import { UserDTO } from '@/types/dtos'
import { getColumnHeader } from '@/utils/table-utils'
import { roleLabelMap } from '@/constants/roles'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { BaseFilterControlsProps } from '@/components/shared/data-table-filter-controls-base'
import { filterFields } from './utilizadores-constants'

export function UtilizadoresFilterControls({
  table,
  columns,
  onApplyFilters,
  onClearFilters,
}: BaseFilterControlsProps<UserDTO>) {
  const [filterValues, setFilterValues] = useState<Record<string, string>>({})
  const { data: clientes } = useGetClientesSelect()

  useEffect(() => {
    const currentFilters = table.getState().columnFilters
    const newFilterValues: Record<string, string> = {}

    currentFilters.forEach((filter: { id: string; value: unknown }) => {
      if (filter.value) {
        newFilterValues[filter.id] = filter.value as string
      }
    })

    setFilterValues(newFilterValues)
  }, [table.getState().columnFilters])

  const handleFilterChange = (columnId: string, value: string) => {
    const newValue = value === 'all' ? '' : value

    setFilterValues((prev) => ({
      ...prev,
      [columnId]: newValue,
    }))

    table.getColumn(columnId)?.setFilterValue(newValue)
  }

  const renderFilterInput = (column: ColumnDef<UserDTO, unknown>) => {
    if (!('accessorKey' in column) || !column.accessorKey) return null

    const commonInputStyles =
      'w-full justify-start px-4 py-6 text-left font-normal shadow-inner'

    if (column.accessorKey === 'roleId') {
      return (
        <Select
          value={filterValues['roleId'] || 'all'}
          onValueChange={(value) => handleFilterChange('roleId', value)}
        >
          <SelectTrigger className={commonInputStyles}>
            <SelectValue placeholder='Selecione uma role' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Todos</SelectItem>
            {Object.entries(roleLabelMap).map(([role, label]) => (
              <SelectItem key={role} value={role}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    }

    if (column.accessorKey === 'cliente.nome') {
      return (
        <Select
          value={filterValues['cliente.nome'] || 'all'}
          onValueChange={(value) => handleFilterChange('cliente.nome', value)}
        >
          <SelectTrigger className={commonInputStyles}>
            <SelectValue placeholder='Selecione um cliente' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Todos</SelectItem>
            {clientes?.map((cliente) => (
              <SelectItem key={cliente.id} value={cliente.nome}>
                {cliente.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    }

    if (column.accessorKey === 'ativo') {
      return (
        <Select
          value={filterValues['ativo'] || 'all'}
          onValueChange={(value) => handleFilterChange('ativo', value)}
        >
          <SelectTrigger className={commonInputStyles}>
            <SelectValue placeholder='Selecione o estado' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Todos</SelectItem>
            <SelectItem value='true'>Ativo</SelectItem>
            <SelectItem value='false'>Inativo</SelectItem>
          </SelectContent>
        </Select>
      )
    }

    return (
      <Input
        placeholder={`Filtrar por ${getColumnHeader(column, filterFields).toLowerCase()}...`}
        value={filterValues[column.accessorKey.toString()] ?? ''}
        onChange={(event) =>
          handleFilterChange(column.accessorKey.toString(), event.target.value)
        }
        className={commonInputStyles}
      />
    )
  }

  return (
    <>
      {columns
        .filter((column) => {
          return (
            'accessorKey' in column &&
            column.accessorKey &&
            filterFields.some((field) => field.value === column.accessorKey)
          )
        })
        .sort((a, b) => {
          const aField = filterFields.find(
            (field) => 'accessorKey' in a && field.value === a.accessorKey
          )
          const bField = filterFields.find(
            (field) => 'accessorKey' in b && field.value === b.accessorKey
          )
          return (aField?.order ?? Infinity) - (bField?.order ?? Infinity)
        })
        .map((column) => {
          if (!('accessorKey' in column) || !column.accessorKey) return null
          return (
            <div
              key={`${column.id}-${column.accessorKey}`}
              className='space-y-2'
            >
              <Label>{getColumnHeader(column, filterFields)}</Label>
              {renderFilterInput(column)}
            </div>
          )
        })}
    </>
  )
}
