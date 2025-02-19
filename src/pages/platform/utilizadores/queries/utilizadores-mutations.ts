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
      queryClient.invalidateQueries({ queryKey: ['licenca-utilizadores'] })
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
      queryClient.invalidateQueries({ queryKey: ['licenca-utilizadores'] })
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
      queryClient.invalidateQueries({ queryKey: ['licenca-utilizadores'] })
    },
  })
}

export const useDeleteMultipleUtilizadores = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ids: string[]) =>
      UtilizadoresService('utilizadores').deleteMultipleUtilizadores(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['utilizadores-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['utilizadores'] })
      queryClient.invalidateQueries({ queryKey: ['utilizadores-count'] })
      queryClient.invalidateQueries({ queryKey: ['licenca-utilizadores'] })
    },
  })
}

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: {
      password: string
      newPassword: string
      confirmNewPassword: string
    }) => UtilizadoresService('change-password').changePassword(data),
  })
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: {
      firstName: string
      lastName: string
      phoneNumber?: string
      email: string
    }) => UtilizadoresService('profile').updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}
