import * as React from 'react'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full' | '2xl'

interface EnhancedModalProps {
  title?: string
  description?: string
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  size?: ModalSize
  className?: string
  isDraggable?: boolean
}

const sizeClasses: Record<ModalSize, string> = {
  sm: 'sm:max-w-[500px]',
  md: 'sm:max-w-[600px]',
  lg: 'sm:max-w-[800px]',
  xl: 'sm:max-w-[1140px]',
  '2xl': 'sm:max-w-[1400px]',
  full: 'sm:max-w-[calc(100vw-40px)] sm:max-h-[calc(100vh-40px)]',
}

const heightClasses: Record<ModalSize, string> = {
  sm: 'max-h-[500px]',
  md: 'max-h-[600px]',
  lg: 'max-h-[700px]',
  xl: 'max-h-[800px]',
  '2xl': 'max-h-[900px]',
  full: 'max-h-[calc(100vh-40px)]',
}

export function EnhancedModal({
  title,
  description,
  isOpen,
  onClose,
  children,
  size = 'md',
  className,
  isDraggable = true,
}: EnhancedModalProps) {
  const [position, setPosition] = React.useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = React.useState(false)
  const dragStartRef = React.useRef({ x: 0, y: 0, offsetX: 0, offsetY: 0 })
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  React.useEffect(() => {
    if (!isOpen) {
      setPosition({ x: 0, y: 0 })
    }
  }, [isOpen])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isDraggable) return
    e.preventDefault()

    setIsDragging(true)
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      offsetX: position.x,
      offsetY: position.y,
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return

    const dx = e.clientX - dragStartRef.current.x
    const dy = e.clientY - dragStartRef.current.y

    setPosition({
      x: dragStartRef.current.offsetX + dx,
      y: dragStartRef.current.offsetY + dy,
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging])

  const content = (
    <DialogContent
      className={cn(
        'max-h-[calc(100vh-40px)] overflow-hidden',
        !isMobile && 'fixed left-[50%] top-[50%]',
        sizeClasses[size],
        heightClasses[size],
        !isMobile && isDraggable && !isDragging && 'cursor-move',
        !isMobile && isDragging && 'cursor-grabbing',
        'flex flex-col',
        className
      )}
      style={{
        transform: !isMobile
          ? `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`
          : undefined,
        transition: 'none',
        height: isMobile ? '100%' : undefined,
      }}
    >
      <DialogHeader
        className={cn(
          'px-6 pt-6 flex-shrink-0',
          !isMobile && isDraggable && 'cursor-move'
        )}
        onMouseDown={handleMouseDown}
      >
        {title && <DialogTitle>{title}</DialogTitle>}
        {description && <DialogDescription>{description}</DialogDescription>}
      </DialogHeader>
      <div className='flex-1 overflow-hidden'>
        <div className='h-full overflow-y-auto px-6 py-4'>{children}</div>
      </div>
    </DialogContent>
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {content}
    </Dialog>
  )
}
