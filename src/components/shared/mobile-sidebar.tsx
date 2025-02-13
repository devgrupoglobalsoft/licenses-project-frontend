import { Dispatch, SetStateAction, useState } from 'react'
import React from 'react'
import { MenuItem } from '@/types/navigation/menu.types'
import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useHeaderMenu } from '@/hooks/use-header-menu'
import { useMenuItems } from '@/hooks/use-menu-items'
import { Icons } from '@/components/ui/icons'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import DashboardNav from '@/components/shared/dashboard-nav'

type TMobileSidebarProps = {
  className?: string
  setSidebarOpen: Dispatch<SetStateAction<boolean>>
  sidebarOpen: boolean
}

type ExpandedMenus = {
  [key: string]: boolean
}

export default function MobileSidebar({
  setSidebarOpen,
  sidebarOpen,
}: TMobileSidebarProps) {
  const menuItems = useMenuItems()
  const administracaoMenu = useHeaderMenu('administracao') as MenuItem[]
  const [expandedMenus, setExpandedMenus] = useState<ExpandedMenus>({})

  const toggleMenu = (menuId: string) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }))
  }

  return (
    <>
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side='left' className='bg-background !px-0'>
          <SheetTitle className='sr-only'>Navigation Menu</SheetTitle>
          <SheetDescription className='sr-only'>
            Application navigation menu for mobile devices
          </SheetDescription>
          <div className='space-y-4 py-4'>
            <div className='space-y-4 px-3 py-2'>
              <Link to='/' className='px-2 py-2 text-2xl font-bold text-white'>
                Logo
              </Link>
              <div className='space-y-1'>
                <DashboardNav
                  items={menuItems}
                  setOpen={setSidebarOpen}
                  isMobileNav
                />

                {/* Render administration submenu items */}
                {menuItems.map(
                  (item) =>
                    item.title === 'administracao' &&
                    administracaoMenu && (
                      <div key={item.title} className='pl-4 pt-2'>
                        {administracaoMenu.map((submenu, index) => (
                          <div key={index} className='space-y-2'>
                            {submenu.items ? (
                              <>
                                <button
                                  onClick={() =>
                                    toggleMenu(`${submenu.label}-${index}`)
                                  }
                                  className='flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent'
                                >
                                  {submenu.label}
                                  <ChevronRight
                                    className={cn(
                                      'h-4 w-4 transition-transform',
                                      expandedMenus[
                                        `${submenu.label}-${index}`
                                      ] && 'rotate-90'
                                    )}
                                  />
                                </button>
                                {expandedMenus[`${submenu.label}-${index}`] &&
                                  submenu.items?.map((subItem, subIndex) => (
                                    <Link
                                      key={subIndex}
                                      to={subItem.href}
                                      onClick={() => setSidebarOpen(false)}
                                      className='flex items-center gap-2 rounded-md px-6 py-2 text-sm hover:bg-accent'
                                    >
                                      {subItem.icon && (
                                        <div className='h-4 w-4'>
                                          {React.createElement(
                                            Icons[
                                              subItem.icon as keyof typeof Icons
                                            ]
                                          )}
                                        </div>
                                      )}
                                      {subItem.label}
                                    </Link>
                                  ))}
                              </>
                            ) : (
                              <Link
                                to={submenu.href}
                                onClick={() => setSidebarOpen(false)}
                                className='flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent'
                              >
                                {submenu.label}
                              </Link>
                            )}
                          </div>
                        ))}
                      </div>
                    )
                )}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
