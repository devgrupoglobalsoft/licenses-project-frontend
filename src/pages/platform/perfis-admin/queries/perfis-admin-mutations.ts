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
      PerfisService('perfis-admin').Admin.deletePerfil(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['perfis-admin-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['perfis-admin'] })
      queryClient.invalidateQueries({ queryKey: ['perfis-admin-count'] })
      queryClient.invalidateQueries({ queryKey: ['perfis-admin-select'] })
      queryClient.invalidateQueries({ queryKey: ['perfis-admin-utilizadores'] })
    },
  })
}

export const useCreatePerfil = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreatePerfilDTO) =>
      PerfisService('perfis-admin').Admin.createPerfil(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['perfis-admin-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['perfis-admin'] })
      queryClient.invalidateQueries({ queryKey: ['perfis-admin-count'] })
      queryClient.invalidateQueries({ queryKey: ['perfis-admin-select'] })
      queryClient.invalidateQueries({ queryKey: ['perfis-admin-utilizadores'] })
    },
  })
}

export const useUpdatePerfil = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePerfilDTO }) =>
      PerfisService('perfis-admin').Admin.updatePerfil(id, { ...data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['perfis-admin-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['perfis-admin'] })
      queryClient.invalidateQueries({ queryKey: ['perfis-admin-count'] })
      queryClient.invalidateQueries({ queryKey: ['perfis-admin-select'] })
      queryClient.invalidateQueries({ queryKey: ['perfis-admin-utilizadores'] })
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
      PerfisService('perfis-admin').Admin.updatePerfilFuncionalidades(
        perfilId,
        data
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['perfis-admin-modulos-funcionalidades'],
      })
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
      PerfisService('perfis-admin').Admin.addUtilizadorPerfil(
        perfilId,
        utilizadorId
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['perfis-admin'] })
      queryClient.invalidateQueries({ queryKey: ['utilizadores'] })
      queryClient.invalidateQueries({ queryKey: ['perfis-admin-utilizadores'] })
    },
  })
}

export const useDeleteMultiplePerfis = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ids: string[]) =>
      PerfisService('perfis-admin').Admin.deleteMultiplePerfis(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['perfis-admin-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['perfis-admin'] })
      queryClient.invalidateQueries({ queryKey: ['perfis-admin-count'] })
      queryClient.invalidateQueries({ queryKey: ['perfis-admin-select'] })
      queryClient.invalidateQueries({ queryKey: ['perfis-admin-utilizadores'] })
    },
  })
}
