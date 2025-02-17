import { useAuthStore } from '@/stores/auth-store'
import { Card } from '@/components/ui/card'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import PageHead from '@/components/shared/page-head'
import { LicencaExpirationProgress } from './components/licenca-expiration-progress'
import { LicencaUtilizadoresList } from './components/licenca-utilizadores-list'

export default function LicencasAdminPage() {
  const { licencaId } = useAuthStore()

  console.log('LicencasAdminPage - licencaId:', licencaId)

  return (
    <div className='px-4 pb-4 md:px-8 md:pb-8'>
      <PageHead title='Licenças Admin' />
      <Breadcrumbs
        items={[
          { title: 'Administração', link: '/administracao' },
          { title: 'Licenças', link: '/administracao/licencas/admin' },
        ]}
      />
      <div className='mt-10 grid grid-cols-1 md:grid-cols-12 gap-6'>
        <div className='col-span-1 md:col-span-6'>
          <Card>
            <div className='p-4 border-b'>
              <h3 className='text-lg font-medium'>Utilizadores da Licença</h3>
              <p className='text-sm text-muted-foreground'>
                Lista de utilizadores que podem ser ativados nesta licença
              </p>
            </div>
            {licencaId && <LicencaUtilizadoresList licencaId={licencaId} />}
          </Card>
        </div>
        <div className='col-span-1 md:col-span-6'>
          {licencaId && <LicencaExpirationProgress licencaId={licencaId} />}
        </div>
      </div>
    </div>
  )
}
