import { GSResponse } from '@/types/api/responses'
import { ModuloFuncionalidadeDTO } from '@/types/dtos'
import { ResponseApi } from '@/types/responses'
import { ResponseModuloFuncionalidadeLicenca } from '@/types/responses'
import { BaseApiClient, BaseApiError } from '@/lib/base-client'

export class LicencaFuncionalidadeError extends BaseApiError {
  name: string = 'LicencaFuncionalidadeError'
}

class LicencasFuncionalidadesClient extends BaseApiClient {
  public async updateLicencaModulosFuncionalidades(
    licencaId: string,
    data: ModuloFuncionalidadeDTO[]
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.putRequest<
          ModuloFuncionalidadeDTO[],
          GSResponse<string>
        >(`/api/licencas/${licencaId}/modulos/funcionalidades`, data)

        if (!response.info || !response.info.data) {
          console.error('Formato de resposta inválido:', response)
          throw new LicencaFuncionalidadeError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new LicencaFuncionalidadeError(
          'Falha ao atualizar funcionalidades da licença',
          undefined,
          error
        )
      }
    })
  }

  public async getModulosFuncionalidadesLicenca(
    licencaId: string
  ): Promise<ResponseApi<GSResponse<ResponseModuloFuncionalidadeLicenca>>> {
    const cacheKey = this.getCacheKey(
      'GET',
      `/api/licencas/${licencaId}/modulos/funcionalidades`
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<ResponseModuloFuncionalidadeLicenca>
          >(`/api/licencas/${licencaId}/modulos/funcionalidades`)

          if (!response.info || !response.info.data) {
            console.error('Formato de resposta inválido:', response)
            throw new LicencaFuncionalidadeError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new LicencaFuncionalidadeError(
            'Falha ao obter módulos e funcionalidades da licença',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getModulosFuncionalidadesLicencaByApiKey(): Promise<
    ResponseApi<GSResponse<ResponseModuloFuncionalidadeLicenca>>
  > {
    const cacheKey = this.getCacheKey(
      'GET',
      '/api/licencas/by-api-key/modulos/funcionalidades'
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<ResponseModuloFuncionalidadeLicenca>
          >('/api/licencas/by-api-key/modulos/funcionalidades')

          if (!response.info || !response.info.data) {
            console.error('Formato de resposta inválido:', response)
            throw new LicencaFuncionalidadeError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new LicencaFuncionalidadeError(
            'Falha ao obter módulos e funcionalidades da licença por API key',
            undefined,
            error
          )
        }
      })
    )
  }
}

const LicencasFuncionalidadesService = (idFuncionalidade: string) =>
  new LicencasFuncionalidadesClient(idFuncionalidade)
export default LicencasFuncionalidadesService
