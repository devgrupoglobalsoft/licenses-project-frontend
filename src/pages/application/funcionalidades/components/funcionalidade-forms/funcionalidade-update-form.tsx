import { useState, useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useGetAplicacoesSelect } from '@/pages/application/aplicacoes/queries/aplicacoes-queries'
import { useUpdateFuncionalidade } from '@/pages/application/funcionalidades/queries/funcionalidades-mutations'
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
    .min(1, { message: 'O Nome deve ter pelo menos 1 caráter' }),
  descricao: z
    .string({ required_error: 'A Descrição é obrigatória' })
    .min(1, { message: 'A Descrição deve ter pelo menos 1 caráter' }),
  ativo: z.boolean(),
  moduloId: z.string({ required_error: 'O Módulo é obrigatório' }),
  aplicacaoFilter: z.string().optional(),
})

type FuncionalidadeFormSchemaType = z.infer<typeof funcionalidadeFormSchema>

interface FuncionalidadeUpdateFormProps {
  modalClose: () => void
  funcionalidadeId: string
  initialData: {
    nome: string
    descricao: string
    ativo: boolean
    moduloId: string
  }
}

const FuncionalidadeUpdateForm = ({
  modalClose,
  funcionalidadeId,
  initialData,
}: FuncionalidadeUpdateFormProps) => {
  const [selectedAplicacaoId, setSelectedAplicacaoId] = useState<string>('')
  const { data: aplicacoesData } = useGetAplicacoesSelect()
  const { data: modulosData } = useGetModulosSelect()
  const updateFuncionalidadeMutation = useUpdateFuncionalidade()

  // Filter modules based on selected application
  const filteredModulos = selectedAplicacaoId
    ? modulosData?.filter(
        (modulo) => modulo.aplicacaoId === selectedAplicacaoId
      )
    : modulosData

  // Find the initial application ID from the module
  useEffect(() => {
    if (modulosData && initialData.moduloId) {
      const currentModulo = modulosData.find(
        (modulo) => modulo.id === initialData.moduloId
      )
      if (currentModulo?.aplicacaoId) {
        setSelectedAplicacaoId(currentModulo.aplicacaoId)
      }
    }
  }, [modulosData, initialData.moduloId])

  const form = useForm<FuncionalidadeFormSchemaType>({
    resolver: zodResolver(funcionalidadeFormSchema),
    defaultValues: {
      nome: initialData.nome,
      descricao: initialData.descricao || '',
      ativo: initialData.ativo,
      moduloId: initialData.moduloId,
      aplicacaoFilter: selectedAplicacaoId,
    },
  })

  const onSubmit = async (values: FuncionalidadeFormSchemaType) => {
    try {
      const response = await updateFuncionalidadeMutation.mutateAsync({
        id: funcionalidadeId,
        data: {
          id: funcionalidadeId,
          nome: values.nome,
          descricao: values.descricao || '',
          ativo: values.ativo,
          moduloId: values.moduloId,
        },
      })

      if (response.info.succeeded) {
        toast.success('Funcionalidade atualizada com sucesso')
        modalClose()
      } else {
        toast.error(
          getErrorMessage(response, 'Erro ao atualizar funcionalidade')
        )
      }
    } catch (error) {
      toast.error(handleApiError(error, 'Erro ao atualizar funcionalidade'))
    }
  }

  return (
    <div className='space-y-4'>
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
                        value={selectedAplicacaoId}
                      >
                        <SelectTrigger className='px-4 py-6 shadow-inner drop-shadow-xl'>
                          <SelectValue placeholder='Selecione uma aplicação para filtrar' />
                        </SelectTrigger>
                        <SelectContent>
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
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
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

          <div className='flex items-center justify-end space-x-2'>
            <Button type='button' variant='outline' onClick={modalClose}>
              Cancelar
            </Button>
            <Button
              type='submit'
              disabled={updateFuncionalidadeMutation.isPending}
            >
              {updateFuncionalidadeMutation.isPending
                ? 'Atualizando...'
                : 'Atualizar'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default FuncionalidadeUpdateForm
