import { useState, useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LatLngExpression } from 'leaflet'
import L from 'leaflet'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, useMapEvents, Marker } from 'react-leaflet'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { useAuthStore } from '@/stores/auth-store'
import { cn } from '@/lib/utils'
import { getErrorMessage } from '@/utils/error-handlers'
import { handleApiError } from '@/utils/error-handlers'
import { toast } from '@/utils/toast-utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  useChangePassword,
  useUpdateProfile,
} from '../utilizadores/queries/utilizadores-mutations'
import { useGetProfile } from '../utilizadores/queries/utilizadores-queries'

const profileFormSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: 'O Nome deve ter pelo menos 1 caráter' }),
  lastName: z
    .string()
    .min(1, { message: 'O Apelido deve ter pelo menos 1 caráter' }),
  email: z.string().email({ message: 'Email inválido' }),
  phoneNumber: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

const passwordFormSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, { message: 'A password deve ter pelo menos 6 caracteres' })
      .regex(/[A-Z]/, {
        message: 'A password deve conter pelo menos uma letra maiúscula',
      })
      .regex(/[a-z]/, {
        message: 'A password deve conter pelo menos uma letra minúscula',
      })
      .regex(/[0-9]/, {
        message: 'A password deve conter pelo menos um dígito numérico',
      })
      .regex(/[\W_]/, {
        message:
          'A password deve conter pelo menos um caráter não alfanumérico',
      })
      .regex(/^[^\s]+$/, {
        message: 'A password não deve conter espaços',
      }),
    newPassword: z
      .string()
      .min(6, { message: 'A password deve ter pelo menos 6 caracteres' })
      .regex(/[A-Z]/, {
        message: 'A password deve conter pelo menos uma letra maiúscula',
      })
      .regex(/[a-z]/, {
        message: 'A password deve conter pelo menos uma letra minúscula',
      })
      .regex(/[0-9]/, {
        message: 'A password deve conter pelo menos um dígito numérico',
      })
      .regex(/[\W_]/, {
        message:
          'A password deve conter pelo menos um caráter não alfanumérico',
      })
      .regex(/^[^\s]+$/, {
        message: 'A password não deve conter espaços',
      }),
    confirmPassword: z
      .string()
      .min(6, { message: 'A password deve ter pelo menos 6 caracteres' }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'As passwords não coincidem',
    path: ['confirmPassword'],
  })

type PasswordFormValues = z.infer<typeof passwordFormSchema>

const recentActivity = [
  { action: 'Login', date: '2024-03-20 09:30', location: 'Lisboa, Portugal' },
  {
    action: 'Perfil atualizado',
    date: '2024-03-19 14:45',
    location: 'Porto, Portugal',
  },
  {
    action: 'Password alterada',
    date: '2024-03-18 11:20',
    location: 'Lisboa, Portugal',
  },
]

// Add this before the LocationPicker component
const defaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

function LocationPicker({
  onLocationSelect,
}: {
  onLocationSelect: (location: string) => void
}) {
  const [position, setPosition] = useState<LatLngExpression>()

  const map = useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng
      setPosition([lat, lng])
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=pt`
        )
        const data = await response.json()
        const location = `${data.address.city || data.address.town || data.address.village}, ${data.address.country}`
        onLocationSelect(location)
      } catch (error) {
        toast.error('Erro ao obter localização')
      }
    },
  })
  return position ? <Marker position={position} icon={defaultIcon} /> : null
}

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false)
  const { data: profileData, isLoading: isProfileLoading } = useGetProfile()
  const changePassword = useChangePassword()
  const updateProfile = useUpdateProfile()

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
    },
  })

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  // Update form when profile data is loaded
  useEffect(() => {
    if (profileData?.info?.data) {
      const { firstName, lastName, email, phoneNumber } = profileData.info.data
      form.reset({
        firstName,
        lastName,
        email,
        phoneNumber: phoneNumber || '',
      })
    }
  }, [profileData, form])

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      setIsLoading(true)
      const response = await updateProfile.mutateAsync(data)

      if (response.info.succeeded) {
        toast.success('Perfil atualizado com sucesso!')
      } else {
        toast.error(getErrorMessage(response, 'Erro ao atualizar perfil'))
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error(handleApiError(error, 'Erro ao atualizar perfil'))
    } finally {
      setIsLoading(false)
    }
  }

  const onPasswordSubmit = async (data: z.infer<typeof passwordFormSchema>) => {
    try {
      setIsLoading(true)
      const response = await changePassword.mutateAsync({
        password: data.currentPassword,
        newPassword: data.newPassword,
        confirmNewPassword: data.confirmPassword,
      })

      if (response.info.succeeded) {
        toast.success('Password alterada com sucesso')
        passwordForm.reset()
      } else {
        toast.error(getErrorMessage(response, 'Erro ao alterar password'))
      }
    } catch (error) {
      console.error(error)
      toast.error(handleApiError(error, 'Algo correu mal'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleLocationSelect = (location: string) => {
    // form.setValue('location', location)
    toast.success('Localização atualizada')
  }

  return (
    <div className='container max-w-4xl py-10'>
      <div className='mb-8 flex items-center gap-8'>
        <Avatar className='h-24 w-24'>
          <AvatarImage src='' alt={profileData?.info?.data?.firstName || ''} />
          <AvatarFallback className='bg-primary text-primary-foreground text-3xl font-semibold'>
            {profileData?.info?.data
              ? `${profileData.info.data.firstName.charAt(0)}${profileData.info.data.lastName.charAt(0)}`
              : 'U'}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className='text-2xl font-bold'>
            {profileData?.info?.data
              ? `${profileData.info.data.firstName} ${profileData.info.data.lastName}`
              : 'Loading...'}
          </h1>
          <p className='text-muted-foreground'>
            {profileData?.info?.data?.email}
          </p>
        </div>
      </div>

      <Tabs defaultValue='general' className='space-y-4'>
        <TabsList>
          <TabsTrigger value='general'>Geral</TabsTrigger>
          <TabsTrigger value='security'>Segurança</TabsTrigger>
          <TabsTrigger value='activity'>Atividade</TabsTrigger>
          <TabsTrigger value='map'>Mapa</TabsTrigger>
        </TabsList>

        <TabsContent value='general'>
          <Card>
            <CardHeader>
              <CardTitle>Informações do Perfil</CardTitle>
            </CardHeader>
            <CardContent>
              {isProfileLoading ? (
                <div>A carregar...</div>
              ) : (
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='space-y-6'
                  >
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
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
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                      <FormField
                        control={form.control}
                        name='email'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type='email' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='phoneNumber'
                        render={({ field: { value, onChange, ...field } }) => (
                          <FormItem>
                            <FormLabel>Telefone</FormLabel>
                            <FormControl>
                              <PhoneInput
                                country={'pt'}
                                value={value}
                                onChange={(phone) => onChange(phone)}
                                inputClass={cn(
                                  'flex h-[50px] w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
                                  'px-4 shadow-inner'
                                )}
                                containerClass='w-full'
                                buttonClass={cn(
                                  'absolute top-0 bottom-0 left-0 border border-input rounded-l-md bg-transparent hover:bg-accent',
                                  'flex items-center justify-center px-3'
                                )}
                                dropdownClass='bg-background border-input text-foreground'
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className='flex justify-end'>
                      <Button type='submit' disabled={isLoading}>
                        {isLoading ? 'A guardar...' : 'Guardar alterações'}
                      </Button>
                    </div>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='security'>
          <Card>
            <CardHeader>
              <CardTitle>Segurança</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-4'>
                <h3 className='text-lg font-medium'>Alterar Password</h3>
                <Form {...passwordForm}>
                  <form
                    onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                    className='space-y-4'
                  >
                    <FormField
                      control={passwordForm.control}
                      name='currentPassword'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password Atual</FormLabel>
                          <FormControl>
                            <Input type='password' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={passwordForm.control}
                      name='newPassword'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nova Password</FormLabel>
                          <FormControl>
                            <Input type='password' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={passwordForm.control}
                      name='confirmPassword'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirmar Nova Password</FormLabel>
                          <FormControl>
                            <Input type='password' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type='submit' disabled={isLoading}>
                      {isLoading ? 'A atualizar...' : 'Atualizar Password'}
                    </Button>
                  </form>
                </Form>
              </div>

              <Separator className='my-6' />

              <div className='space-y-4'>
                <h3 className='text-lg font-medium'>
                  Autenticação de Dois Fatores
                </h3>
                <p className='text-sm text-muted-foreground'>
                  Adicione segurança adicional à sua conta ativando a
                  autenticação de dois fatores.
                </p>
                <Button variant='outline'>Configurar 2FA</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='activity'>
          <Card>
            <CardHeader>
              <CardTitle>Atividade Recente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className='flex items-center justify-between border-b pb-4 last:border-0'
                  >
                    <div>
                      <p className='font-medium'>{activity.action}</p>
                      <p className='text-sm text-muted-foreground'>
                        {activity.location}
                      </p>
                    </div>
                    <p className='text-sm text-muted-foreground'>
                      {activity.date}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='map'>
          <Card>
            <CardHeader>
              <CardTitle>Selecionar Localização</CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ height: '500px', width: '100%' }}>
                <MapContainer
                  center={[38.7223, -9.1393] as LatLngExpression}
                  zoom={13}
                  style={{ height: '100%', width: '100%' }}
                  scrollWheelZoom={false}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                  />
                  <LocationPicker onLocationSelect={handleLocationSelect} />
                </MapContainer>
              </div>
              <p className='mt-2 text-sm text-muted-foreground'>
                Clique no mapa para selecionar a sua localização
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
