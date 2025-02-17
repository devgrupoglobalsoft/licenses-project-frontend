import { useQuery } from '@tanstack/react-query'
import LicencasService from '@/lib/services/platform/licencas-service'

export const useGetLicencaUtilizadores = (licencaId: string) => {
  return useQuery({
    queryKey: ['licenca-utilizadores', licencaId],
    queryFn: () =>
      LicencasService(
        'licencas'
      ).LicencasUtilizadores.Admin.getUtilizadoresLicenca(licencaId),
    enabled: !!licencaId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  })
}

export const useGetLicenca = (licencaId: string) => {
  return useQuery({
    queryKey: ['licenca', licencaId],
    queryFn: () => LicencasService('licencas').getLicencaByApiKey(),
    enabled: !!licencaId,
  })
}
