import { useQuery, useQueryClient } from '@tanstack/react-query'
import PerfisService from '@/lib/services/platform/perfis-service'

export const useGetPerfisPaginated = (
  pageNumber: number,
  pageLimit: number,
  filters: Array<{ id: string; value: string }> | null,
  sorting: string[] | null
) => {
  return useQuery({
    queryKey: [
      'perfis-admin-paginated',
      pageNumber,
      pageLimit,
      filters,
      sorting,
    ],

    queryFn: () =>
      PerfisService('perfis-admin').admin.getPerfisPaginated({
        pageNumber: pageNumber,
        pageSize: pageLimit,
        filters: (filters as unknown as Record<string, string>) ?? undefined,
        sorting: sorting ?? undefined,
      }),

    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const usePrefetchAdjacentPerfis = (
  page: number,
  pageSize: number,
  filters: Array<{ id: string; value: string }> | null
) => {
  const queryClient = useQueryClient()

  const prefetchPreviousPage = async () => {
    if (page > 1) {
      await queryClient.prefetchQuery({
        queryKey: ['perfis-admin-paginated', page - 1, pageSize, filters, null],
        queryFn: () =>
          PerfisService('perfis-admin').admin.getPerfisPaginated({
            pageNumber: page - 1,

            pageSize: pageSize,
            filters:
              (filters as unknown as Record<string, string>) ?? undefined,
            sorting: undefined,
          }),
      })
    }
  }

  const prefetchNextPage = async () => {
    await queryClient.prefetchQuery({
      queryKey: ['perfis-admin-paginated', page + 1, pageSize, filters, null],
      queryFn: () =>
        PerfisService('perfis-admin').admin.getPerfisPaginated({
          pageNumber: page + 1,
          pageSize: pageSize,
          filters: (filters as unknown as Record<string, string>) ?? undefined,
          sorting: undefined,
        }),
    })
  }

  return { prefetchPreviousPage, prefetchNextPage }
}

export const useGetPerfis = () => {
  return useQuery({
    queryKey: ['perfis-admin'],
    queryFn: () => PerfisService('perfis-admin').admin.getPerfis(),
  })
}

export const useGetPerfilById = (id: string) => {
  return useQuery({
    queryKey: ['perfil-admin', id],
    queryFn: () => PerfisService('perfis-admin').admin.getPerfilById(id),
    enabled: !!id,
  })
}
