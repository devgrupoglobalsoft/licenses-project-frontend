import { GSResponseToken } from '@/types/api/responses'
import { jwtDecode } from 'jwt-decode'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { secureStorage } from '@/utils/secure-storage'

interface AuthState {
  token: string
  refreshToken: string
  refreshTokenExpiryTime: string
  email: string
  name: string
  userId: string
  roleId: string
  clienteId: string
  licencaId: string
  permissions: Record<string, number>
  isLoaded: boolean
  isAuthenticated: boolean
}

interface AuthActions {
  setToken: (token: string) => void
  setRefreshToken: (token: string) => void
  setRefreshTokenExpiryTime: (time: string) => void
  setUser: (email: string) => void
  decodeToken: () => void
  clearAuth: () => void
}

const initialState: AuthState = {
  token: '',
  refreshToken: '',
  refreshTokenExpiryTime: '',
  email: '',
  name: '',
  userId: '',
  roleId: '',
  clienteId: '',
  licencaId: '',
  permissions: {},
  isLoaded: false,
  isAuthenticated: false,
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      setToken: (token: string) => {
        // During initial login, we trust the token from the server
        set({ token, isAuthenticated: !!token, isLoaded: true })
        get().decodeToken()
      },

      setRefreshToken: (refreshToken: string) => {
        set({ refreshToken })
      },

      setRefreshTokenExpiryTime: (refreshTokenExpiryTime: string) => {
        set({ refreshTokenExpiryTime })
      },

      setUser: (email: string) => {
        set({ email })
      },

      decodeToken: () => {
        const { token } = get()
        if (!token) {
          console.warn('No token available to decode')
          return
        }

        try {
          const decoded: GSResponseToken = jwtDecode(token)
          if (!secureStorage.verify(token)) {
            get().clearAuth()
            return
          }
          set({
            name: decoded.name,
            userId: decoded.uid,
            roleId: decoded.roles.toLowerCase(),
            isLoaded: true,
          })
        } catch (err) {
          console.error('Failed to decode JWT:', err)
          get().clearAuth()
        }
      },

      clearAuth: () => {
        set({ ...initialState, isLoaded: true })
      },
    }),
    {
      name: 'auth-storage',
      storage: {
        getItem: (name) => secureStorage.get(name),
        setItem: (name, value) => {
          console.log('Auth Store before encryption:', value)
          return secureStorage.set(name, value)
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
)
