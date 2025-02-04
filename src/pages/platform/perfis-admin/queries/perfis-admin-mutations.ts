import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  CreatePerfilDTO,
  UpdatePerfilDTO,
  PerfilFuncionalidadeDTO,
} from '@/types/dtos'
import PerfisService from '@/lib/services/platform/perfis-service'

export const useDeletePerfil = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) =>
      PerfisService('perfis-admin').admin.deletePerfil(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['perfis-admin-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['perfis-admin'] })
      queryClient.invalidateQueries({ queryKey: ['perfis-admin-count'] })
      queryClient.invalidateQueries({ queryKey: ['perfis-admin-select'] })
    },
  })
}

export const useCreatePerfil = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreatePerfilDTO) =>
      PerfisService('perfis-admin').admin.createPerfil(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['perfis-admin-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['perfis-admin'] })
      queryClient.invalidateQueries({ queryKey: ['perfis-admin-count'] })
      queryClient.invalidateQueries({ queryKey: ['perfis-admin-select'] })
    },
  })
}

export const useUpdatePerfil = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreatePerfilDTO }) =>
      PerfisService('perfis-admin').admin.updatePerfil(id, { ...data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['perfis-admin-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['perfis-admin'] })
      queryClient.invalidateQueries({ queryKey: ['perfis-admin-count'] })
      queryClient.invalidateQueries({ queryKey: ['perfis-admin-select'] })
    },
  })
}

export const useUpdatePerfilFuncionalidades = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      perfilId,
      data,
    }: {
      perfilId: string
      data: PerfilFuncionalidadeDTO[]
    }) =>
      PerfisService('perfis-admin').admin.updatePerfilFuncionalidades(
        perfilId,
        data
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['perfil-funcionalidades'] })
    },
  })
}

export const useAddUtilizadorPerfil = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      perfilId,
      utilizadorId,
    }: {
      perfilId: string
      utilizadorId: string
    }) =>
      PerfisService('perfis-admin').admin.addUtilizadorPerfil(
        perfilId,
        utilizadorId
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['perfis-admin'] })
      queryClient.invalidateQueries({ queryKey: ['utilizadores'] })
    },
  })
}
