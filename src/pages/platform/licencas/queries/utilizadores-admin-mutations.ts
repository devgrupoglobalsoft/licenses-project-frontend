import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CreateUtilizadorDTO, UpdateUtilizadorDTO } from '@/types/dtos'
import LicencasService from '@/lib/services/platform/licencas-service'

export const useCreateUserAdmin = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateUtilizadorDTO) =>
      LicencasService('licencas').LicencasUtilizadores.Admin.createUserAdmin(
        data
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['utilizadores-admin'] })
      queryClient.invalidateQueries({
        queryKey: ['utilizadores-admin-paginated'],
      })
    },
  })
}

export const useUpdateUserAdmin = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUtilizadorDTO }) =>
      LicencasService('licencas').LicencasUtilizadores.Admin.updateUserAdmin(
        id,
        data
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['utilizadores-admin'] })
      queryClient.invalidateQueries({
        queryKey: ['utilizadores-admin-paginated'],
      })
      queryClient.invalidateQueries({ queryKey: ['utilizador-admin-basic'] })
    },
  })
}

export const useDeleteUserAdmin = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) =>
      LicencasService('licencas').LicencasUtilizadores.Admin.deleteUserAdmin(
        id
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['utilizadores-admin'] })
      queryClient.invalidateQueries({
        queryKey: ['utilizadores-admin-paginated'],
      })
    },
  })
}
