import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CreateUtilizadorDTO, UpdateUtilizadorDTO } from '@/types/dtos'
import UtilizadoresService from '@/lib/services/platform/utilizadores-service'

export const useDeleteUtilizador = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) =>
      UtilizadoresService('utilizadores').deleteUtilizador(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['utilizadores-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['utilizadores'] })
      queryClient.invalidateQueries({ queryKey: ['utilizadores-count'] })
    },
  })
}

export const useCreateUtilizador = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateUtilizadorDTO) =>
      UtilizadoresService('utilizadores').createUtilizador(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['utilizadores-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['utilizadores'] })
      queryClient.invalidateQueries({ queryKey: ['utilizadores-count'] })
    },
  })
}

export const useUpdateUtilizador = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUtilizadorDTO }) =>
      UtilizadoresService('utilizadores').updateUtilizador(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['utilizadores-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['utilizadores'] })
      queryClient.invalidateQueries({ queryKey: ['utilizadores-count'] })
    },
  })
}
