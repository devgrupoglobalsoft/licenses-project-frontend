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
  const { token, isAuthenticated, isLoaded, clearAuth } = useAuthStore()

  useEffect(() => {
    if (!isLoaded) return

    const validateAuth = async () => {
      const storedAuth = secureStorage.get('auth-storage')
      if (!storedAuth || !isAuthenticated || !token) {
        console.log('Auth validation failed:', {
          storedAuth,
          isAuthenticated,
          hasToken: !!token,
        })
        clearAuth()
        navigate('/login')
        return
      }

      const isTokenValid = secureStorage.verify(token)
      console.log('Protected Route - Token validation:', isTokenValid)

      if (!isTokenValid) {
        clearAuth()
        navigate('/login')
      }
    }

    validateAuth()
  }, [token, isAuthenticated, isLoaded, clearAuth, navigate])

  if (!isLoaded) {
    return null // or a loading spinner
  }

  return isAuthenticated ? children : null
}
