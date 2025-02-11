import { ColumnDef } from '@tanstack/react-table'

export type DataTableFilterField<TData> = {
  label: string
  value: keyof TData | string
  order?: number
}

export type DataTableColumnDef<TData> = ColumnDef<TData, any> & {
  sortKey?: string
  meta?: {
    align?: 'left' | 'center' | 'right'
    hidden?: boolean
    width?: string
  }
}
