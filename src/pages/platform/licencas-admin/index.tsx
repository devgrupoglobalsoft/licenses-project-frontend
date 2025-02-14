import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import PageHead from '@/components/shared/page-head'

export default function LicencasAdminPage() {
  return (
    <div className='px-4 pb-4 md:px-8 md:pb-8'>
      <PageHead title='Licenças Admin' />
      <Breadcrumbs
        items={[
          { title: 'Administração', link: '/administracao' },
          { title: 'Licenças', link: '/administracao/licencas/admin' },
        ]}
      />
      <div className='mt-10'>
        <div>Licencas Admin</div>
      </div>
    </div>
  )
}
