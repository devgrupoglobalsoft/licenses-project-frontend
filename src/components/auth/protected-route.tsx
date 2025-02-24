import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth-store'
import { secureStorage } from '@/utils/secure-storage'

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode
}) {
  const navigate = useNavigate()
  const { token, isAuthenticated, clearAuth } = useAuthStore()

  useEffect(() => {
    const storedAuth = secureStorage.get('auth-storage')
    if (!storedAuth || !isAuthenticated || !secureStorage.verify(token)) {
      clearAuth()
      navigate('/login')
    }
  }, [token, isAuthenticated, clearAuth, navigate])

  return isAuthenticated ? children : null
}
