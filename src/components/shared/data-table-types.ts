import { ColumnDef } from '@tanstack/react-table'

export type DataTableFilterField<TData> = {
  label: string
  value: keyof TData | string
  order?: number
}

export type DataTableColumnDef<T> = ColumnDef<T> & {
  sortKey?: string
}
