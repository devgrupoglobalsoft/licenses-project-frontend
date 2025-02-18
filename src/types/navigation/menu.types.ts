import { Icons } from '@/components/ui/icons'

export interface MenuItem {
  label: string
  href: string
  items?: MenuItem[]
  description?: string
  icon?: keyof typeof Icons
  dropdown?: MenuItem[]
  secondaryMenu?: MenuItem[]
}

export interface HeaderMenu {
  [key: string]: MenuItem[]
}

export interface RoleHeaderMenus {
  [role: string]: {
    [menu: string]: MenuItem[]
  }
}
