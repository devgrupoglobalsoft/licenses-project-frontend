import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useGetAplicacoesSelect } from '@/pages/application/aplicacoes/queries/aplicacoes-queries'
import { useCreateFuncionalidade } from '@/pages/application/funcionalidades/queries/funcionalidades-mutations'
import { useGetModulosSelect } from '@/pages/application/modulos/queries/modulos-queries'
import { getErrorMessage, handleApiError } from '@/utils/error-handlers'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'

const funcionalidadeFormSchema = z.object({
  nome: z
    .string({ required_error: 'O Nome é obrigatório' })
    .min(1, { message: 'O Nome deve ter pelo menos 1 caractere' }),
  descricao: z
    .string({ required_error: 'A Descrição é obrigatória' })
    .min(1, { message: 'A Descrição deve ter pelo menos 1 caractere' }),
  ativo: z.boolean(),
  moduloId: z.string({ required_error: 'O Módulo é obrigatório' }),
  aplicacaoFilter: z.string(),
})

type FuncionalidadeFormSchemaType = z.infer<typeof funcionalidadeFormSchema>

interface FuncionalidadeCreateFormProps {
  modalClose: () => void
  preSelectedModuloId?: string
}

const FuncionalidadeCreateForm = ({
  modalClose,
  preSelectedModuloId,
}: FuncionalidadeCreateFormProps) => {
  const [selectedAplicacaoId, setSelectedAplicacaoId] = useState<string>('all')
  const { data: aplicacoesData } = useGetAplicacoesSelect()
  const { data: modulosData } = useGetModulosSelect()
  const createFuncionalidade = useCreateFuncionalidade()

  const filteredModulos =
    selectedAplicacaoId === 'all'
      ? modulosData
      : modulosData?.filter(
          (modulo) => modulo.aplicacaoId === selectedAplicacaoId
        )

  const form = useForm<FuncionalidadeFormSchemaType>({
    resolver: zodResolver(funcionalidadeFormSchema),
    defaultValues: {
      nome: '',
      descricao: '',
      ativo: true,
      moduloId: preSelectedModuloId || undefined,
      aplicacaoFilter: 'all',
    },
  })

  const onSubmit = async (data: FuncionalidadeFormSchemaType) => {
    try {
      const response = await createFuncionalidade.mutateAsync(data)
      if (response.info.succeeded) {
        toast.success('Funcionalidade criada com sucesso!')
        modalClose()
      } else {
        toast.error(getErrorMessage(response, 'Erro ao criar funcionalidade'))
      }
    } catch (error) {
      toast.error(handleApiError(error, 'Erro ao criar funcionalidade'))
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-4'
        autoComplete='off'
      >
        <div className='grid grid-cols-1 gap-x-8 gap-y-4'>
          <div className='grid grid-cols-2 gap-x-8'>
            <FormField
              control={form.control}
              name='aplicacaoFilter'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Filtrar por Aplicação</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value)
                        setSelectedAplicacaoId(value)
                      }}
                      value={field.value}
                    >
                      <SelectTrigger className='px-4 py-6 shadow-inner drop-shadow-xl'>
                        <SelectValue placeholder='Selecione uma aplicação para filtrar' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>Todas as Aplicações</SelectItem>
                        {aplicacoesData?.map((aplicacao) => (
                          <SelectItem key={aplicacao.id} value={aplicacao.id}>
                            {aplicacao.nome}
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
              name='moduloId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Módulo</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className='px-4 py-6 shadow-inner drop-shadow-xl'>
                        <SelectValue placeholder='Selecione um módulo' />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredModulos?.map((modulo) => (
                          <SelectItem key={modulo.id} value={modulo.id}>
                            {modulo.nome}
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

          <FormField
            control={form.control}
            name='nome'
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
            name='descricao'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Introduza a descrição'
                    {...field}
                    className='shadow-inner drop-shadow-xl'
                  />
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

        <div className='flex justify-end space-x-4'>
          <Button
            type='button'
            variant='outline'
            onClick={modalClose}
            className='w-24'
          >
            Cancelar
          </Button>
          <Button
            type='submit'
            variant='emerald'
            className='w-24'
            disabled={createFuncionalidade.isPending}
          >
            {createFuncionalidade.isPending ? 'A criar...' : 'Criar'}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default FuncionalidadeCreateForm
