import {
  GSGenericResponse,
  GSResponse,
  PaginatedRequest,
  PaginatedResponse,
} from '@/types/api/responses'
import {
  CreatePerfilDTO,
  PerfilDTO,
  PerfilFuncionalidadeDTO,
  UpdatePerfilDTO,
} from '@/types/dtos'
import {
  ResponseApi,
  ResponsePerfilModulosFuncionalidades,
} from '@/types/responses'
import { BaseApiClient, BaseApiError } from '@/lib/base-client'
import { PerfilError } from './perfil-error'

export class PerfilAdminClient extends BaseApiClient {
  constructor(idFuncionalidade: string) {
    super(idFuncionalidade)
  }

  public async getPerfisPaginated(
    params: PaginatedRequest
  ): Promise<ResponseApi<PaginatedResponse<PerfilDTO>>> {
    const cacheKey = this.getCacheKey(
      'POST',
      '/api/perfis/admin/perfis-paginated',
      params
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.postRequest<
            PaginatedRequest,
            PaginatedResponse<PerfilDTO>
          >('/api/perfis/admin/perfis-paginated', params)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new PerfilError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new PerfilError(
            'Falha ao obter perfis paginados',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getPerfis(): Promise<ResponseApi<GSResponse<PerfilDTO[]>>> {
    const cacheKey = this.getCacheKey('GET', '/api/perfis/admin')
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response =
            await this.httpClient.getRequest<GSResponse<PerfilDTO[]>>(
              '/api/perfis/admin'
            )

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new PerfilError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new PerfilError('Falha ao obter perfis', undefined, error)
        }
      })
    )
  }

  public async createPerfil(
    data: CreatePerfilDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.postRequest<
          CreatePerfilDTO,
          GSResponse<string>
        >('/api/perfis/admin/create', data)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new PerfilError('Formato de resposta inválido')
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

  public async updatePerfil(
    id: string,
    data: UpdatePerfilDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.putRequest<
          UpdatePerfilDTO,
          GSResponse<string>
        >(`/api/perfis/admin/${id}`, data)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new PerfilError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new PerfilError('Falha ao atualizar perfil', undefined, error)
      }
    })
  }

  public async deletePerfil(
    id: string
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequest<GSGenericResponse>(
          `/api/perfis/admin/${id}`
        )

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new PerfilError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new PerfilError('Falha ao deletar perfil', undefined, error)
      }
    })
  }

  public async getPerfilById(
    id: string
  ): Promise<ResponseApi<GSResponse<PerfilDTO>>> {
    const cacheKey = this.getCacheKey('GET', `/api/perfis/admin/${id}`)
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<PerfilDTO>
          >(`/api/perfis/admin/${id}`)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new PerfilError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new PerfilError(
            'Falha ao obter perfil por ID',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getPerfisModulosFuncionalidades(
    id: string
  ): Promise<ResponseApi<GSResponse<ResponsePerfilModulosFuncionalidades>>> {
    const cacheKey = this.getCacheKey(
      'GET',
      `/api/perfis/${id}/funcionalidades/tree`
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<ResponsePerfilModulosFuncionalidades>
          >(`/api/perfis/${id}/funcionalidades/tree`)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new PerfilError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new PerfilError('Falha ao obter perfis', undefined, error)
        }
      })
    )
  }

  public async updatePerfilFuncionalidades(
    perfilId: string,
    data: PerfilFuncionalidadeDTO[]
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.putRequest<
          PerfilFuncionalidadeDTO[],
          GSResponse<string>
        >(`/api/perfis/${perfilId}/funcionalidades`, data)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new PerfilError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new PerfilError(
          'Falha ao atualizar funcionalidades do perfil',
          undefined,
          error
        )
      }
    })
  }

  public async addUtilizadorPerfil(
    perfilId: string,
    utilizadorId: string
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.postWithoutDataRequest<
          GSResponse<string>
        >(`/api/perfis/${perfilId}/utilizadores/${utilizadorId}`)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new PerfilError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new PerfilError(
          'Falha ao adicionar utilizador ao perfil',
          undefined,
          error
        )
      }
    })
  }
}
