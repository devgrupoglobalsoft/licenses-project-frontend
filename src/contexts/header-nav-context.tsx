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
      const matchingItem = menuItems.find(
        (item) => pathname === item.href || pathname.startsWith(item.href + '/')
      )
      return matchingItem?.title || 'dashboard'
    }

    const findActiveMenuItem = (pathname: string) => {
      // Only search for active menu item if we have header menu items
      if (!Array.isArray(headerMenuItems) || !headerMenuItems.length)
        return null

      for (const item of headerMenuItems) {
        if (item.items) {
          const matchingSubItem = item.items.find(
            (subItem) =>
              pathname === subItem.href ||
              pathname.startsWith(subItem.href + '/')
          )

          if (matchingSubItem?.secondaryMenu) {
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

    // Batch our state updates
    const newMenu = determineCurrentMenu(location.pathname)
    const newActiveMenuItem = findActiveMenuItem(location.pathname)

    setCurrentMenu(newMenu.toLowerCase())
    setActiveMenuItem(newActiveMenuItem)
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
