import { useState, useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useGetPerfis } from '@/pages/platform/perfis-admin/queries/perfis-admin-queries'
import { useUpdateUser } from '@/pages/platform/utilizadores-admin/queries/utilizadores-admin-mutations'
import { useAuthStore } from '@/stores/auth-store'
import { getErrorMessage, handleApiError } from '@/utils/error-handlers'
import { toast } from '@/utils/toast-utils'
import { roleColors, roleLabelMapAdmin } from '@/constants/roles'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'

const utilizadorAdminFormSchema = z
  .object({
    firstName: z
      .string()
      .min(1, { message: 'O Nome deve ter pelo menos 1 caráter' }),

    lastName: z
      .string()
      .min(1, { message: 'O Apelido deve ter pelo menos 1 caráter' }),
    email: z.string().email({ message: 'Email inválido' }),
    roleId: z.string().min(1, { message: 'Role é obrigatória' }),
    isActive: z.boolean().default(true),
    perfilId: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.roleId.toLowerCase() === 'client' && !data.perfilId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Perfil é obrigatório para utilizadores com role Client',
        path: ['perfilId'],
      })
    }
  })

type UtilizadorAdminFormSchemaType = z.infer<typeof utilizadorAdminFormSchema>

interface UtilizadorAdminUpdateFormProps {
  modalClose: () => void
  utilizadorId: string
  initialData: {
    firstName: string
    lastName: string
    email: string
    roleId: string
    isActive: boolean
    perfilId?: string
  }
}

export function UtilizadorAdminUpdateForm({
  modalClose,
  utilizadorId,
  initialData,
}: UtilizadorAdminUpdateFormProps) {
  const { clientId } = useAuthStore()
  const { data: perfisData } = useGetPerfis()
  const updateUtilizador = useUpdateUser()
  const [showPerfilField, setShowPerfilField] = useState(
    initialData.roleId.toLowerCase() === 'client'
  )

  const form = useForm<UtilizadorAdminFormSchemaType>({
    resolver: zodResolver(utilizadorAdminFormSchema),
    defaultValues: {
      firstName: initialData.firstName,
      lastName: initialData.lastName,
      email: initialData.email,
      roleId: initialData.roleId,
      isActive: initialData.isActive,
      perfilId: initialData.perfilId || '',
    },
  })

  // Watch for role changes to show/hide perfil field
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'roleId') {
        setShowPerfilField((value.roleId?.toLowerCase() ?? '') === 'client')

        // Clear perfil when switching to admin role
        if ((value.roleId?.toLowerCase() ?? '') !== 'client') {
          form.setValue('perfilId', '')
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [form])

  const onSubmit = async (data: UtilizadorAdminFormSchemaType) => {
    try {
      const submitData = {
        ...data,
        clienteId: clientId,
        // Only include perfilId if role is client
        ...(data.roleId.toLowerCase() === 'client'
          ? { perfilId: data.perfilId }
          : {}),
      }

      const response = await updateUtilizador.mutateAsync({
        id: utilizadorId,
        data: submitData,
      })

      if (response.info.succeeded) {
        toast.success('Utilizador atualizado com sucesso!')
        modalClose()
      } else {
        toast.error(getErrorMessage(response, 'Erro ao atualizar utilizador'))
      }
    } catch (error) {
      toast.error(handleApiError(error, 'Erro ao atualizar utilizador'))
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-4 w-full'
        autoComplete='off'
      >
        <div className='grid grid-cols-1 gap-4 md:gap-8'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8'>
            <FormField
              control={form.control}
              name='firstName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Introduza o nome'
                      {...field}
                      className='px-4 py-6 shadow-inner drop-shadow-xl'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='lastName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Apelido</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Introduza o apelido'
                      {...field}
                      className='px-4 py-6 shadow-inner drop-shadow-xl'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className='grid grid-cols-12 gap-4 md:gap-8'>
            <div className='col-span-8'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type='email'
                        placeholder='Introduza o email'
                        {...field}
                        className='px-4 py-6 shadow-inner drop-shadow-xl'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='col-span-4'>
              <FormField
                control={form.control}
                name='isActive'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <FormControl>
                      <div className='flex items-center justify-between rounded-lg border px-4 py-[0.85rem] shadow-inner drop-shadow-xl'>
                        <FormLabel className='text-base'>Ativo</FormLabel>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8'>
            <FormField
              control={form.control}
              name='roleId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className='px-4 py-6 shadow-inner drop-shadow-xl'>
                        <SelectValue placeholder='Selecione uma role' />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(roleLabelMapAdmin).map(
                          ([role, label]) => (
                            <SelectItem key={role} value={role}>
                              <div className='flex items-center gap-2'>
                                <div
                                  className={`h-4 w-4 rounded-full ${
                                    roleColors[role as keyof typeof roleColors]
                                      .indicator
                                  }`}
                                />
                                <span>{label}</span>
                              </div>
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {showPerfilField && (
              <FormField
                control={form.control}
                name='perfilId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Perfil</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className='px-4 py-6 shadow-inner drop-shadow-xl'>
                          <SelectValue placeholder='Selecione um perfil' />
                        </SelectTrigger>
                        <SelectContent>
                          {perfisData?.map((perfil) => (
                            <SelectItem key={perfil.id} value={perfil.id || ''}>
                              <div className='flex items-center gap-2 max-w-[200px] md:max-w-full'>
                                <span className='truncate'>{perfil.nome}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        </div>

        <div className='flex flex-col-reverse md:flex-row justify-end gap-4 md:gap-8 pt-4'>
          <Button
            type='button'
            variant='outline'
            onClick={modalClose}
            className='w-full md:w-24'
          >
            Cancelar
          </Button>
          <Button
            type='submit'
            className='w-full md:w-24'
            disabled={updateUtilizador.isPending}
          >
            {updateUtilizador.isPending ? 'A atualizar...' : 'Atualizar'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
