import { useQuery, useQueryClient } from '@tanstack/react-query'
import LicencasService from '@/lib/services/platform/licencas-service'

export const useGetUtilizadoresAdmin = (clienteId: string) => {
  return useQuery({
    queryKey: ['utilizadores-admin', clienteId],
    queryFn: () =>
      LicencasService(
        'licencas'
      ).LicencasUtilizadores.Admin.getUtilizadoresAdmin(clienteId),
    enabled: !!clienteId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  })
}

export const useGetBasicUserById = (id: string) => {
  return useQuery({
    queryKey: ['utilizador-admin-basic', id],
    queryFn: () =>
      LicencasService('licencas').LicencasUtilizadores.Admin.getBasicUserById(
        id
      ),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const usePrefetchAdjacentUtilizadores = (
  currentPage: number,
  pageSize: number,
  filters: Array<{ id: string; value: string }> | null
) => {
  const queryClient = useQueryClient()

  const prefetchPage = async (page: number) => {
    await queryClient.prefetchQuery({
      queryKey: ['utilizadores-admin-paginated', page, pageSize, filters],
      queryFn: () =>
        LicencasService(
          'licencas'
        ).LicencasUtilizadores.Admin.getUtilizadoresAdmin(
          filters?.find((f) => f.id === 'clienteId')?.value || ''
        ),
    })
  }

  return {
    prefetchNextPage: () => prefetchPage(currentPage + 1),
    prefetchPreviousPage: () =>
      currentPage > 1 && prefetchPage(currentPage - 1),
  }
}
