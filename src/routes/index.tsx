import { Suspense, lazy } from 'react'
import { HeaderNavProvider } from '@/contexts/header-nav-context'
import AdminDashboard from '@/pages/administracao/admin'
import AdministracaoRouter from '@/pages/administracao/administracao-router'
import AdministratorDashboard from '@/pages/administracao/administrator'
import AplicacoesPage from '@/pages/application/aplicacoes'
import AreasPage from '@/pages/application/areas'
import FuncionalidadesPage from '@/pages/application/funcionalidades'
import ModulosPage from '@/pages/application/modulos'
import NotFound from '@/pages/not-found'
import ClientesPage from '@/pages/platform/clientes'
import LicencasPage from '@/pages/platform/licencas'
import PerfisAdminPage from '@/pages/platform/perfis-admin'
import UtilizadoresPage from '@/pages/platform/utilizadores'
import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import ProtectedRoute from '@/components/auth/protected-route'
import RoleProtectedRoute from '@/components/auth/role-protected-route'
import RoleRouter from '@/components/auth/role-router'

const DashboardLayout = lazy(
  () => import('@/components/layout/dashboard-layout')
)
const SignInPage = lazy(() => import('@/pages/auth/signin'))
const ResetPasswordPage = lazy(() => import('@/pages/auth/reset-password'))
const DashboardPage = lazy(() => import('@/pages/dashboard'))

// ----------------------------------------------------------------------

export default function AppRouter() {
  const dashboardRoutes = [
    {
      path: '/',
      element: (
        <ProtectedRoute>
          <HeaderNavProvider>
            <DashboardLayout>
              <Suspense>
                <Outlet />
              </Suspense>
            </DashboardLayout>
          </HeaderNavProvider>
        </ProtectedRoute>
      ),
      children: [
        {
          index: true,
          element: (
            <RoleRouter
              routes={{
                administrator: <DashboardPage />,
                admin: <Navigate to='/administracao' replace />,
              }}
            />
          ),
        },
        {
          path: 'dashboard',
          element: <DashboardPage />,
        },
        {
          path: 'administracao',
          element: (
            <RoleProtectedRoute allowedRoles={['administrator', 'admin']}>
              <AdministracaoRouter />
            </RoleProtectedRoute>
          ),
        },
        {
          path: 'administracao/areas',
          element: (
            <RoleProtectedRoute allowedRoles={['administrator']}>
              <AreasPage />
            </RoleProtectedRoute>
          ),
        },
        {
          path: 'administracao/aplicacoes',
          element: (
            <RoleProtectedRoute allowedRoles={['administrator']}>
              <AplicacoesPage />
            </RoleProtectedRoute>
          ),
        },
        {
          path: 'administracao/modulos',
          element: (
            <RoleProtectedRoute allowedRoles={['administrator']}>
              <ModulosPage />
            </RoleProtectedRoute>
          ),
        },
        {
          path: 'administracao/funcionalidades',
          element: (
            <RoleProtectedRoute allowedRoles={['administrator']}>
              <FuncionalidadesPage />
            </RoleProtectedRoute>
          ),
        },
        {
          path: 'administracao/clientes',
          element: (
            <RoleProtectedRoute allowedRoles={['administrator']}>
              <ClientesPage />
            </RoleProtectedRoute>
          ),
        },
        {
          path: 'administracao/licencas',
          element: (
            <RoleProtectedRoute allowedRoles={['administrator']}>
              <LicencasPage />
            </RoleProtectedRoute>
          ),
        },
        {
          path: 'administracao/utilizadores',
          element: (
            <RoleProtectedRoute allowedRoles={['administrator']}>
              <UtilizadoresPage />
            </RoleProtectedRoute>
          ),
        },
        {
          path: 'administracao/administrator',
          element: <AdministratorDashboard />,
        },
        {
          path: 'administracao/admin',
          element: <AdminDashboard />,
        },
        {
          path: 'administracao/licencas/admin',
          element: (
            <RoleProtectedRoute allowedRoles={['admin']}>
              <div>Licenças Admin</div>
            </RoleProtectedRoute>
          ),
        },
        {
          path: 'administracao/perfis/admin',
          element: (
            <RoleProtectedRoute allowedRoles={['admin']}>
              <PerfisAdminPage />
            </RoleProtectedRoute>
          ),
        },
      ],
    },
  ]

  const publicRoutes = [
    {
      path: '/login',
      element: <SignInPage />,
      index: true,
    },
    {
      path: '/resetpassword',
      element: <ResetPasswordPage />,
    },
    {
      path: '/404',
      element: <NotFound />,
    },
    {
      path: '*',
      element: <Navigate to='/404' replace />,
    },
  ]

  const routes = useRoutes([...dashboardRoutes, ...publicRoutes])

  return routes
}
