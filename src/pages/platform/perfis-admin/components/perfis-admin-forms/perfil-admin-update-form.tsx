import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PerfilDTO } from '@/types/dtos'
import { handleApiError } from '@/utils/error-handlers'
import { toast } from '@/utils/toast-utils'
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
import { Switch } from '@/components/ui/switch'
import { useUpdatePerfil } from '../../queries/perfis-admin-mutations'

const formSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  ativo: z.boolean(),
})

type PerfilUpdateFormProps = {
  modalClose: () => void
  perfilId: string
  initialData: PerfilDTO
}

export default function PerfilUpdateForm({
  modalClose,
  perfilId,
  initialData,
}: PerfilUpdateFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: initialData.nome,
      ativo: initialData.ativo,
    },
  })

  const updatePerfilMutation = useUpdatePerfil()

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await updatePerfilMutation.mutateAsync({
        id: perfilId,
        data: values,
      })
      modalClose()
    } catch (error) {
      toast.error(handleApiError(error, 'Erro ao atualizar perfil'))
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-4'
        autoComplete='off'
      >
        <FormField
          control={form.control}
          name='nome'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='ativo'
          render={({ field }) => (
            <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
              <div className='space-y-0.5'>
                <FormLabel>Ativo</FormLabel>
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

        <div className='flex justify-end space-x-2 pt-4'>
          <Button type='button' variant='outline' onClick={modalClose}>
            Cancelar
          </Button>
          <Button type='submit' disabled={updatePerfilMutation.isPending}>
            Atualizar
          </Button>
        </div>
      </form>
    </Form>
  )
}
