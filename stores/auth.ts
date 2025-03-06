import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type AuthRole = 'PATIENT' | 'DOCTOR' | 'ADMIN' | null


interface AuthState {
  token: string | null
  role: AuthRole
  userId: string | null
  isLoading: boolean
  error: string | null
}

interface AuthActions {
  setAuth: (token: string, role: AuthRole, userId: string) => void
  clearAuth: () => void
  initializeAuth: () => Promise<void>
  checkAuth: () => boolean // Add this line
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      token: null,
      role: null,
      userId: null,
      isLoading: false,
      error: null,

      // Add checkAuth implementation
      checkAuth: () => {
        const { token } = get()
        return !!token
      },

      setAuth: (token, role, userId) => set({
        token,
        role,
        userId,
        isLoading: false,
        error: null
      }),

      clearAuth: () => set({
        token: null,
        role: null,
        userId: null,
        isLoading: false,
        error: null
      }),

      initializeAuth: async () => {
        if (get().token) {
          try {
            // Add token verification logic if needed
          } catch (error) {
            get().clearAuth()
          }
        }
      }
    }),
    {
      name: 'doctolib-auth',
      partialize: (state) => ({
        token: state.token,
        role: state.role,
        userId: state.userId
      })
    }
  )
)