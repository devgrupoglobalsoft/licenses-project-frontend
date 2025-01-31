import { useState } from 'react'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { useToast } from '@/components/ui/use-toast'

const formSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address' }),
})

type ForgotPasswordFormProps = {
  onBack: () => void
}

export default function ForgotPasswordForm({
  onBack,
}: ForgotPasswordFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setLoading(true)
      // TODO: Implement your password reset logic here
      // await PasswordService.resetPassword(data.email);

      toast({
        title: 'Success',
        description:
          'Se o email existir, você receberá as instruções de recuperação',
        variant: 'default',
      })

      onBack()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Algo correu mal',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='w-full space-y-4'
        >
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type='email'
                    placeholder='Introduza o seu email...'
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='flex flex-col space-y-2'>
            <Button disabled={loading} className='w-full' type='submit'>
              {loading ? 'Enviando...' : 'Enviar email de recuperação'}
            </Button>
            <Button
              type='button'
              variant='ghost'
              onClick={onBack}
              disabled={loading}
              className='w-full'
            >
              Voltar ao login
            </Button>
          </div>
        </form>
      </Form>
    </>
  )
}
