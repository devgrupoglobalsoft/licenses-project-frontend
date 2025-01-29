import {
  GSGenericResponse,
  GSResponse,
  PaginatedRequest,
  PaginatedResponse,
} from '@/types/api/responses'
import {
  CreateUtilizadorDTO,
  UpdateUtilizadorDTO,
  UtilizadorDTO,
} from '@/types/dtos'
import { ResponseApi } from '@/types/responses'
import { BaseApiClient, BaseApiError } from '@/lib/base-client'

export class UtilizadorError extends BaseApiError {
  name: string = 'UtilizadorError'
}

class UtilizadoresClient extends BaseApiClient {
  public async getUtilizadoresPaginated(
    params: PaginatedRequest
  ): Promise<ResponseApi<PaginatedResponse<UtilizadorDTO>>> {
    const cacheKey = this.getCacheKey(
      'POST',
      '/api/identity/users/users-paginated',
      params
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.postRequest<
            PaginatedRequest,
            PaginatedResponse<UtilizadorDTO>
          >('/api/identity/users/users-paginated', params)

          if (!response.info || !response.info.data) {
            console.error('Formato de resposta inválido:', response)
            throw new UtilizadorError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new UtilizadorError(
            'Falha ao obter utilizadores paginados',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getUtilizadores(): Promise<
    ResponseApi<GSResponse<UtilizadorDTO[]>>
  > {
    const cacheKey = this.getCacheKey('GET', '/api/identity/users')
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<UtilizadorDTO[]>
          >('/api/identity/users')

          if (!response.info || !response.info.data) {
            console.error('Formato de resposta inválido:', response)
            throw new UtilizadorError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new UtilizadorError(
            'Falha ao obter utilizadores',
            undefined,
            error
          )
        }
      })
    )
  }

  public async createUtilizador(
    data: CreateUtilizadorDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.postRequest<
          CreateUtilizadorDTO,
          GSResponse<string>
        >('/api/identity/users', data)

        if (!response.info || !response.info.data) {
          console.error('Formato de resposta inválido:', response)
          throw new UtilizadorError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        if (error instanceof BaseApiError && error.data) {
          return {
            info: error.data as GSResponse<string>,
            status: error.statusCode || 400,
            statusText: error.message,
          }
        }
        throw error
      }
    })
  }

  public async updateUtilizador(
    id: string,
    data: UpdateUtilizadorDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.putRequest<
          UpdateUtilizadorDTO,
          GSResponse<string>
        >(`/api/identity/users/${id}`, data)

        if (!response.info || !response.info.data) {
          console.error('Formato de resposta inválido:', response)
          throw new UtilizadorError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new UtilizadorError(
          'Falha ao atualizar utilizador',
          undefined,
          error
        )
      }
    })
  }

  public async deleteUtilizador(
    id: string
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequest<GSGenericResponse>(
          `/api/identity/users/${id}`
        )

        if (!response.info || !response.info.data) {
          console.error('Formato de resposta inválido:', response)
          throw new UtilizadorError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new UtilizadorError(
          'Falha ao apagar utilizador',
          undefined,
          error
        )
      }
    })
  }

  public async getUtilizadorById(
    id: string
  ): Promise<ResponseApi<GSResponse<UtilizadorDTO>>> {
    const cacheKey = this.getCacheKey('GET', `/api/identity/users/${id}`)
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<UtilizadorDTO>
          >(`/api/identity/users/${id}`)

          if (!response.info || !response.info.data) {
            console.error('Formato de resposta inválido:', response)
            throw new UtilizadorError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new UtilizadorError(
            'Falha ao obter utilizador pelo ID',
            undefined,
            error
          )
        }
      })
    )
  }
}

const UtilizadoresService = (idFuncionalidade: string) =>
  new UtilizadoresClient(idFuncionalidade)
export default UtilizadoresService
