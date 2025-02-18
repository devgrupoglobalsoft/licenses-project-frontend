import React from 'react'
import { MenuItem } from '@/types/navigation/menu.types'
import { ChevronDown } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Icons } from '@/components/ui/icons'

interface SecondaryNavProps {
  items: MenuItem[]
  className?: string
}

export function SecondaryNav({ items, className }: SecondaryNavProps) {
  const location = useLocation()

  if (!items?.length) return null

  const isItemActive = (href: string) => {
    return (
      location.pathname === href || location.pathname.startsWith(href + '/')
    )
  }

  return (
    <div
      className={cn(
        'border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        className
      )}
    >
      <div className='flex h-10 items-center px-4'>
        <nav className='flex space-x-6'>
          {items.map((item, index) => {
            const Icon = item.icon && Icons[item.icon as keyof typeof Icons]

            if (item.dropdown) {
              return (
                <DropdownMenu key={index}>
                  <DropdownMenuTrigger
                    className={cn(
                      'flex items-center space-x-2 text-xs font-medium transition-colors hover:text-primary',
                      isItemActive(item.href)
                        ? 'text-primary font-semibold'
                        : 'text-muted-foreground'
                    )}
                  >
                    {Icon && <Icon className='h-3.5 w-3.5' />}
                    <span>{item.label}</span>
                    <ChevronDown className='h-3.5 w-3.5 opacity-50' />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='start' className='w-52'>
                    {item.dropdown.map((dropdownItem, dropdownIndex) => {
                      const DropdownIcon = dropdownItem.icon
                        ? Icons[dropdownItem.icon as keyof typeof Icons]
                        : null
                      return (
                        <DropdownMenuItem
                          key={dropdownIndex}
                          asChild
                          className={cn(
                            'py-1.5',
                            isItemActive(dropdownItem.href) && 'bg-muted'
                          )}
                        >
                          <Link
                            to={dropdownItem.href}
                            className='flex items-center space-x-2 text-xs'
                          >
                            {DropdownIcon && (
                              <DropdownIcon className='h-3.5 w-3.5 text-muted-foreground' />
                            )}
                            <span>{dropdownItem.label}</span>
                          </Link>
                        </DropdownMenuItem>
                      )
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              )
            }

            return (
              <Link
                key={index}
                to={item.href}
                className={cn(
                  'flex items-center space-x-2 text-xs font-medium transition-colors hover:text-primary',
                  isItemActive(item.href)
                    ? 'text-primary font-semibold'
                    : 'text-muted-foreground'
                )}
              >
                {Icon && <Icon className='h-3.5 w-3.5' />}
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
