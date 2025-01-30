import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useUpdateArea } from '@/pages/application/areas/queries/areas-mutations'
import { AreaDTO } from '@/types/dtos'
import { PREDEFINED_COLORS } from '@/lib/constants/area-colors'
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

const formSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  color: z.string().min(1, 'Cor é obrigatória'),
})

type AreaUpdateFormProps = {
  modalClose: () => void
  areaId: string
  initialData: AreaDTO
}

export default function AreaUpdateForm({
  modalClose,
  areaId,
  initialData,
}: AreaUpdateFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: initialData.nome,
      color: initialData.color,
    },
  })

  const updateAreaMutation = useUpdateArea()

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await updateAreaMutation.mutateAsync({
        id: areaId,
        data: values,
      })
      modalClose()
    } catch (error) {
      toast.error(handleApiError(error, 'Erro ao atualizar área'))
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
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
          name='color'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cor</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue>
                      <div className='flex items-center gap-2'>
                        <div
                          className='h-4 w-4 rounded-full'
                          style={{ backgroundColor: field.value }}
                        />
                        <span>
                          {PREDEFINED_COLORS.find(
                            (c) => c.value === field.value
                          )?.label || field.value}
                        </span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {PREDEFINED_COLORS.map((color) => (
                      <SelectItem key={color.value} value={color.value}>
                        <div className='flex items-center gap-2'>
                          <div
                            className='h-4 w-4 rounded-full'
                            style={{ backgroundColor: color.value }}
                          />
                          <span>{color.label}</span>
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

        <Button
          type='submit'
          className='w-full'
          disabled={updateAreaMutation.isPending}
        >
          {updateAreaMutation.isPending ? 'Atualizando...' : 'Atualizar'}
        </Button>
      </form>
    </Form>
  )
}
