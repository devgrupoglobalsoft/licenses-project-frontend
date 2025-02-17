import { cn } from '@/lib/utils'
import { roleVariants, roleLabelMap } from '@/constants/roles'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { useUpdateLicencaUtilizadores } from '../queries/licencas-admin-mutations'
import { useGetLicencaUtilizadores } from '../queries/licencas-admin-queries'

interface LicencaUtilizadoresListProps {
  licencaId: string
}

export function LicencaUtilizadoresList({
  licencaId,
}: LicencaUtilizadoresListProps) {
  console.log('LicencaUtilizadoresList - licencaId:', licencaId)

  const {
    data: utilizadoresResponse,
    isLoading,
    error,
  } = useGetLicencaUtilizadores(licencaId)

  const updateLicencaMutation = useUpdateLicencaUtilizadores()

  console.log('LicencaUtilizadoresList - response:', utilizadoresResponse)
  console.log('LicencaUtilizadoresList - error:', error)

  const utilizadores = utilizadoresResponse?.info?.data || []
  console.log('LicencaUtilizadoresList - utilizadores:', utilizadores)

  const handleToggleUser = (userId: string, currentActive: boolean) => {
    if (!licencaId) return

    const updatedUsers = utilizadores
      .filter((u) => u.utilizador.id)
      .map((u) => ({
        utilizadorId: u.utilizador.id!,
        ativo: u.utilizador.id === userId ? !currentActive : u.ativo,
      }))

    updateLicencaMutation.mutate({
      licencaId,
      data: updatedUsers,
    })
  }

  if (isLoading) {
    return (
      <div className='space-y-4 p-6'>
        {[...Array(5)].map((_, i) => (
          <div key={i} className='flex items-center justify-between'>
            <div className='space-y-2'>
              <Skeleton className='h-4 w-[200px]' />
              <Skeleton className='h-3 w-[150px]' />
            </div>
            <Skeleton className='h-6 w-10' />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    console.error('LicencaUtilizadoresList - Error:', error)
    return <div className='p-6 text-destructive'>Error loading users</div>
  }

  if (!utilizadores.length) {
    return <div className='p-6 text-muted-foreground'>No users found</div>
  }

  return (
    <ScrollArea className='h-[600px]'>
      <div className='space-y-4 p-6'>
        {utilizadores.map((utilizador) => {
          const role = (utilizador.utilizador.roleId?.toLowerCase() ||
            'client') as keyof typeof roleLabelMap
          const fullName = [
            utilizador.utilizador.firstName,
            utilizador.utilizador.lastName,
          ]
            .filter(Boolean)
            .join(' ')
          const initials = fullName
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()

          return (
            <div
              key={utilizador.utilizador.id}
              className='flex items-center justify-between rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-md cursor-pointer'
              onClick={() =>
                utilizador.utilizador.id &&
                handleToggleUser(utilizador.utilizador.id, utilizador.ativo)
              }
            >
              <div className='flex items-center space-x-4'>
                <Avatar className='h-12 w-12 ring-2 ring-primary/20 ring-offset-2 ring-offset-background'>
                  <AvatarImage
                    src=''
                    alt={fullName}
                    className='aspect-square h-full w-full object-cover'
                  />
                  <AvatarFallback>
                    <div className='flex h-full w-full items-center justify-center rounded-full bg-primary/80 text-white text-xs font-medium'>
                      {initials}
                    </div>
                  </AvatarFallback>
                </Avatar>
                <div className='space-y-1'>
                  <Label className='text-base font-medium'>{fullName}</Label>
                  <p className='text-sm text-muted-foreground'>
                    <span className={cn(roleVariants({ role }), 'mr-2')}>
                      {roleLabelMap[role]}
                    </span>
                    {utilizador.utilizador.email}
                  </p>
                </div>
              </div>
              <Switch
                checked={utilizador.ativo}
                onCheckedChange={() =>
                  handleToggleUser(utilizador.utilizador.id, utilizador.ativo)
                }
                className='data-[state=checked]:bg-primary'
                aria-label='Toggle user activation'
              />
            </div>
          )
        })}
      </div>
    </ScrollArea>
  )
}
