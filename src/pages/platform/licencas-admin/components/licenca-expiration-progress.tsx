import { differenceInDays } from 'date-fns'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetLicenca } from '../queries/licencas-admin-queries'

interface LicencaExpirationProgressProps {
  licencaId: string
}

export function LicencaExpirationProgress({
  licencaId,
}: LicencaExpirationProgressProps) {
  const { data: licencaResponse, isLoading } = useGetLicenca(licencaId)
  console.log('LicencaExpirationProgress - licencaId:', licencaId)
  console.log('LicencaExpirationProgress - isLoading:', isLoading)
  console.log('LicencaExpirationProgress - response:', licencaResponse)
  console.log('LicencaExpirationProgress - data:', licencaResponse?.info?.data)

  const licenca = licencaResponse?.info?.data

  if (isLoading) {
    return (
      <Card>
        <div className='p-4 space-y-4'>
          <Skeleton className='h-6 w-[200px]' />
          <Skeleton className='h-4 w-[300px]' />
          <Skeleton className='h-2 w-full' />
          <div className='flex justify-between'>
            <Skeleton className='h-4 w-[100px]' />
            <Skeleton className='h-4 w-[100px]' />
          </div>
        </div>
      </Card>
    )
  }

  if (!licenca?.dataInicio || !licenca?.dataFim) {
    return null
  }

  const startDate = new Date(licenca.dataInicio)
  const endDate = new Date(licenca.dataFim)
  const today = new Date()

  const totalDays = differenceInDays(endDate, startDate)
  const daysUsed = differenceInDays(today, startDate)
  const percentage = Math.round((daysUsed / totalDays) * 100)

  return (
    <Card>
      <div className='p-4'>
        <h3 className='text-lg font-medium'>Progresso da Licença</h3>
        <p className='text-sm text-muted-foreground'>
          Percentual de tempo utilizado da licença
        </p>
        <div className='mt-4 space-y-2'>
          <Progress value={percentage} className='h-2' />
          <div className='flex justify-between text-sm text-muted-foreground'>
            <span>{percentage}% utilizado</span>
            <span>{100 - percentage}% restante</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
