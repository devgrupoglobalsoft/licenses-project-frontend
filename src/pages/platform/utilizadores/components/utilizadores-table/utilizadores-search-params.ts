import { z } from 'zod'

const searchParamsSchema = z
  .object({
    email: z.string().nullable().optional(),
    roleId: z.string().nullable().optional(),
    clienteId: z.string().nullable().optional(),
    isActive: z.boolean().optional(),
  })
  .partial()

export const searchParamsCache = {
  parse: (searchParams: { [key: string]: string | string[] | undefined }) => {
    return searchParamsSchema.parse(
      Object.fromEntries(
        Object.entries(searchParams).map(([key, value]) => [
          key,
          Array.isArray(value) ? value[0] : value,
        ])
      )
    )
  },
}
