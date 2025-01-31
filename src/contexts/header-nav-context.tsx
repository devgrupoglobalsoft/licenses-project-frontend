import React, { createContext, useContext, useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useMenuItems } from '@/hooks/use-menu-items'

type HeaderNavContextType = {
  currentMenu: string
  setCurrentMenu: (menu: string) => void
}

const HeaderNavContext = createContext<HeaderNavContextType>({
  currentMenu: 'dashboard',
  setCurrentMenu: () => {},
})

export const useHeaderNav = () => useContext(HeaderNavContext)

export const HeaderNavProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentMenu, setCurrentMenu] = useState('dashboard')
  const location = useLocation()
  const menuItems = useMenuItems()

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

    const newMenu = determineCurrentMenu(location.pathname)
    setCurrentMenu(newMenu)
  }, [location.pathname, menuItems])

  return (
    <HeaderNavContext.Provider value={{ currentMenu, setCurrentMenu }}>
      {children}
    </HeaderNavContext.Provider>
  )
}
