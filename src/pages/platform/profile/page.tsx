import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LatLngExpression } from 'leaflet'
import L from 'leaflet'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, useMapEvents, Marker } from 'react-leaflet'
import { useAuthStore } from '@/stores/auth-store'
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

const profileFormSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: 'O Nome deve ter pelo menos 1 caráter' }),
  lastName: z
    .string()
    .min(1, { message: 'O Apelido deve ter pelo menos 1 caráter' }),
  email: z.string().email({ message: 'Email inválido' }),
  phoneNumber: z.string().optional(),
  jobTitle: z.string().optional(),
  department: z.string().optional(),
  location: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

const passwordFormSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, { message: 'Password atual é obrigatória' }),
    newPassword: z
      .string()
      .min(8, { message: 'A nova password deve ter pelo menos 8 caracteres' }),
    confirmPassword: z
      .string()
      .min(1, { message: 'Confirmação de password é obrigatória' }),
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
  const { name, email } = useAuthStore()

  const initialData = {
    firstName: name?.split(' ')[0] || '',
    lastName: name?.split(' ')[1] || '',
    email: email || '',
    phoneNumber: '+351 912 345 678',
    jobTitle: 'Software Engineer',
    department: 'Engineering',
    location: 'Lisboa, Portugal',
  }

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: initialData,
  })

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data: ProfileFormValues) => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success('Perfil atualizado com sucesso!')
    } catch (error) {
      toast.error('Erro ao atualizar perfil')
    } finally {
      setIsLoading(false)
    }
  }

  const onPasswordSubmit = async (data: PasswordFormValues) => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success('Password atualizada com sucesso!')
      passwordForm.reset()
    } catch (error) {
      toast.error('Erro ao atualizar password')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLocationSelect = (location: string) => {
    form.setValue('location', location)
    toast.success('Localização atualizada')
  }

  return (
    <div className='container max-w-4xl py-10'>
      <div className='mb-8 flex items-center gap-8'>
        <Avatar className='h-24 w-24'>
          <AvatarImage
            src='https://png.pngtree.com/png-clipart/20230927/original/pngtree-man-avatar-image-for-profile-png-image_13001882.png'
            alt={name || ''}
          />
          <AvatarFallback>{name?.charAt(0) || 'U'}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className='text-2xl font-bold'>{name}</h1>
          <p className='text-muted-foreground'>{initialData.jobTitle}</p>
          <p className='text-sm text-muted-foreground'>
            {initialData.department} • {initialData.location}
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
                            <Input {...field} />
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
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone</FormLabel>
                          <FormControl>
                            <Input type='tel' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <FormField
                      control={form.control}
                      name='jobTitle'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cargo</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='department'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Departamento</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name='location'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Localização</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className='flex justify-end'>
                    <Button type='submit' disabled={isLoading}>
                      {isLoading ? 'A guardar...' : 'Guardar alterações'}
                    </Button>
                  </div>
                </form>
              </Form>
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
