import React, { createContext, useContext, useState, useEffect } from 'react'
import { MenuItem } from '@/types/navigation/menu.types'
import { useLocation } from 'react-router-dom'
import { useHeaderMenu } from '@/hooks/use-header-menu'
import { useMenuItems } from '@/hooks/use-menu-items'

interface HeaderNavContextType {
  currentMenu: string
  setCurrentMenu: (menu: string) => void
  activeMenuItem: MenuItem | null
  setActiveMenuItem: (item: MenuItem | null) => void
}

export const HeaderNavContext = createContext<HeaderNavContextType | undefined>(
  undefined
)

export function useHeaderNav() {
  const context = useContext(HeaderNavContext)
  if (!context) {
    throw new Error('useHeaderNav must be used within a HeaderNavProvider')
  }
  return context
}

export const HeaderNavProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentMenu, setCurrentMenu] = useState('dashboard')
  const [activeMenuItem, setActiveMenuItem] = useState<MenuItem | null>(null)
  const location = useLocation()
  const menuItems = useMenuItems()
  const headerMenuItems = useHeaderMenu(currentMenu)

  useEffect(() => {
    const determineCurrentMenu = (pathname: string) => {
      // Find matching menu item from sidebar items
      const matchingItem = menuItems.find((item) => {
        if (pathname === item.href) return true
        if (pathname.startsWith(item.href + '/')) return true
        return false
      })

      return matchingItem?.title || 'dashboard'
    }

    const findActiveMenuItem = (pathname: string) => {
      for (const item of headerMenuItems) {
        // Check if the item has subitems and matches the current path
        if (item.items) {
          const matchingSubItem = item.items.find((subItem) => {
            return (
              pathname === subItem.href ||
              pathname.startsWith(subItem.href + '/')
            )
          })

          if (matchingSubItem && matchingSubItem.secondaryMenu) {
            return {
              label: matchingSubItem.label,
              href: matchingSubItem.href,
              items: matchingSubItem.secondaryMenu,
            }
          }
        }
      }
      return null
    }

    const newMenu = determineCurrentMenu(location.pathname)
    setCurrentMenu(newMenu.toLowerCase())

    // Find and set the active menu item
    const newActiveMenuItem = findActiveMenuItem(location.pathname)
    if (newActiveMenuItem) {
      setActiveMenuItem(newActiveMenuItem)
    }
  }, [location.pathname, menuItems, headerMenuItems])

  return (
    <HeaderNavContext.Provider
      value={{
        currentMenu,
        setCurrentMenu,
        activeMenuItem,
        setActiveMenuItem,
      }}
    >
      {children}
    </HeaderNavContext.Provider>
  )
}
