import { cva } from 'class-variance-authority'

export const roleColors = {
  administrator: {
    indicator: 'bg-purple-500',
    badge:
      'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  },
  admin: {
    indicator: 'bg-blue-500',
    badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  },
  client: {
    indicator: 'bg-green-500',
    badge: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  },
} as const

export const roleLabelMap = {
  administrator: 'Administrador',
  admin: 'Admin',
  client: 'Cliente',
} as const

export const roleVariants = cva(
  'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset',
  {
    variants: {
      role: {
        administrator: roleColors.administrator.badge,
        admin: roleColors.admin.badge,
        client: roleColors.client.badge,
      },
    },
    defaultVariants: {
      role: 'client',
    },
  }
)
