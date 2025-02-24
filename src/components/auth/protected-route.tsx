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
  const { token, refreshToken, isAuthenticated, isLoaded, clearAuth } =
    useAuthStore()

  useEffect(() => {
    if (!isLoaded) return

    const validateAuth = async () => {
      const storedAuth = secureStorage.get('auth-storage')
      if (!storedAuth || (!token && !refreshToken)) {
        console.log('Auth validation failed - no stored auth or tokens')
        clearAuth()
        navigate('/login')
        return
      }

      const isTokenValid = secureStorage.verify(token)
      console.log('Protected Route - Token validation:', isTokenValid)

      if (!isTokenValid) {
        // Try to refresh token before clearing auth
        const TokensClient = (await import('@/lib/services/auth/tokens-client'))
          .default
        const success = await TokensClient.getRefresh()

        if (!success) {
          console.log('Token refresh failed in protected route')
          clearAuth()
          navigate('/login')
        }
      }
    }

    validateAuth()
  }, [token, refreshToken, isAuthenticated, isLoaded, clearAuth, navigate])

  if (!isLoaded) {
    return null
  }

  return isAuthenticated ? children : null
}
