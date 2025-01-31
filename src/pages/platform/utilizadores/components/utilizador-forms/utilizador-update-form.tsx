import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useGetClientesSelect } from '@/pages/platform/clientes/queries/clientes-queries'
import { useUpdateUtilizador } from '@/pages/platform/utilizadores/queries/utilizadores-mutations'
import { getErrorMessage, handleApiError } from '@/utils/error-handlers'
import { toast } from '@/utils/toast-utils'
import { roleColors, roleLabelMap } from '@/constants/roles'
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

const utilizadorFormSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: 'O Nome deve ter pelo menos 1 caráter' }),
  lastName: z
    .string()
    .min(1, { message: 'O Apelido deve ter pelo menos 1 caráter' }),
  email: z.string().email({ message: 'Email inválido' }),
  clienteId: z.string().min(1, { message: 'Cliente é obrigatório' }),
  roleId: z.string().min(1, { message: 'Role é obrigatória' }),
  isActive: z.boolean().default(true),
  perfilId: z.string().optional(),
})

type UtilizadorFormSchemaType = z.infer<typeof utilizadorFormSchema>

interface UtilizadorUpdateFormProps {
  modalClose: () => void
  utilizadorId: string
  initialData: {
    firstName: string
    lastName: string
    email: string
    clienteId: string
    roleId: string
    isActive: boolean
    perfilId?: string
  }
}

export function UtilizadorUpdateForm({
  modalClose,
  utilizadorId,
  initialData,
}: UtilizadorUpdateFormProps) {
  const { data: clientesData } = useGetClientesSelect()
  const updateUtilizador = useUpdateUtilizador()

  const form = useForm<UtilizadorFormSchemaType>({
    resolver: zodResolver(utilizadorFormSchema),
    defaultValues: {
      firstName: initialData.firstName,
      lastName: initialData.lastName,
      email: initialData.email,
      clienteId: initialData.clienteId,
      roleId: initialData.roleId,
      isActive: initialData.isActive,
      perfilId: initialData.perfilId || '',
    },
  })

  const onSubmit = async (data: UtilizadorFormSchemaType) => {
    try {
      const response = await updateUtilizador.mutateAsync({
        id: utilizadorId,
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          clienteId: data.clienteId,
          roleId: data.roleId,
          isActive: data.isActive,
          perfilId: data.perfilId || '',
        },
      })

      console.log(response)

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

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8'>
            <FormField
              control={form.control}
              name='clienteId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className='px-4 py-6 shadow-inner drop-shadow-xl'>
                        <SelectValue placeholder='Selecione um cliente' />
                      </SelectTrigger>
                      <SelectContent>
                        {clientesData?.map((cliente) => (
                          <SelectItem key={cliente.id} value={cliente.id}>
                            <div className='flex items-center gap-2 max-w-[200px] md:max-w-full'>
                              <span className='truncate'>{cliente.nome}</span>
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
                        {Object.entries(roleLabelMap).map(([role, label]) => (
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
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8'>
            <FormField
              control={form.control}
              name='isActive'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                  <div className='space-y-0.5'>
                    <FormLabel className='text-base'>Ativo</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
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
