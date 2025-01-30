import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ModuloFuncionalidadeDTO } from '@/types/dtos'
import LicencasFuncionalidadesService from '@/lib/services/platform/licencas-funcionalidades-service'

export const useUpdateLicencaModulosFuncionalidades = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      licencaId,
      data,
    }: {
      licencaId: string
      data: ModuloFuncionalidadeDTO[]
    }) =>
      LicencasFuncionalidadesService(
        'licencas'
      ).updateLicencaModulosFuncionalidades(licencaId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['licenca-funcionalidades'] })
      queryClient.invalidateQueries({
        queryKey: ['modulos-funcionalidades-licenca'],
      })
    },
  })
}
