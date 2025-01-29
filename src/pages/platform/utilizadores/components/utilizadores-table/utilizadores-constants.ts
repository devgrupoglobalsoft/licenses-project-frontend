import { UserDTO } from '@/types/dtos'
import { DataTableFilterField } from '@/components/shared/data-table-types'

export const filterFields: DataTableFilterField<UserDTO>[] = [
  {
    label: 'Nome',
    value: 'nome',
    order: 1,
  },
  {
    label: 'Email',
    value: 'email',
    order: 2,
  },
  {
    label: 'Role',
    value: 'roleId',
    order: 3,
  },
  {
    label: 'Cliente',
    value: 'cliente.nome',
    order: 4,
  },
  {
    label: 'Estado',
    value: 'ativo',
    order: 5,
  },
]
