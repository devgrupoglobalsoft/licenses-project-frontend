import { Icons } from '@/components/ui/icons'

export const roleMenuItems = {
  administrator: [
    {
      title: 'dashboard',
      href: '/',
      icon: 'dashboard' as keyof typeof Icons,
      label: 'Dashboard',
    },
    {
      title: 'administracao',
      href: '/administracao',
      icon: 'user' as keyof typeof Icons,
      label: 'Administração',
    },
  ],
  admin: [
    {
      title: 'administracao',
      href: '/administracao',
      icon: 'user' as keyof typeof Icons,
      label: 'Administração',
    },
  ],
  guest: [],
}

export const roleHeaderMenus = {
  administrator: {
    administracao: [
      {
        label: 'Plataforma',
        href: '#',
        items: [
          {
            label: 'Áreas',
            href: '/administracao/areas',
            description: 'Faca a gestão das áreas da sua empresa',
          },
          {
            label: 'Aplicações',
            href: '/administracao/aplicacoes',
            description: 'Faça a gestão das aplicações da sua empresa',
            icon: 'application' as keyof typeof Icons,
          },
          {
            label: 'Modulos',
            href: '/administracao/modulos',
            description: 'Faça a gestão dos modulos da sua empresa',
            icon: 'application' as keyof typeof Icons,
          },
          {
            label: 'Funcionalidades',
            href: '/administracao/funcionalidades',
            description: 'Faça a gestão das funcionalidades da sua empresa',
            icon: 'application' as keyof typeof Icons,
          },
        ],
      },
      {
        label: 'Clientes',
        href: '#',
        items: [
          {
            label: 'Clientes',
            href: '/administracao/clientes',
            description: 'Faca a gestão dos clientes da sua empresa',
          },
          {
            label: 'Licenças',
            href: '/administracao/licencas',
            description: 'Faça a gestão das licenças da sua empresa',
            icon: 'application' as keyof typeof Icons,
          },
        ],
      },
      {
        label: 'Utilizadores',
        href: '/administracao/utilizadores',
        description: 'Faça a gestão dos utilizadores da sua empresa',
      },
    ],
  },
  admin: {
    administracao: [
      {
        label: 'Licença',
        href: '#',
        items: [
          {
            label: 'Licenças',
            href: '/administracao/licencas/admin',
            description: 'Faca a gestão da sua licença',
          },
        ],
      },
    ],
  },
  user: {},
  guest: {},
}
