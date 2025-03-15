// src/stores/auth.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type AuthRole = 'PATIENT' | 'DOCTOR' | 'ADMIN' | null;

interface AuthState {
  token: string | null;
  role: AuthRole;
  userId: string | null;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  setAuth: (token: string, role: AuthRole, userId: string) => void;
  clearAuth: () => void;
  initializeAuth: () => Promise<void>;
  checkAuth: () => boolean;
}

export const useAuthStore = create<AuthState & AuthActions>(

  persist(
    (set, get) => ({
      token: null,
      role: null,
      userId: null,
      isLoading: false,
      error: null,

      checkAuth: () => !!get().token,

      setAuth: (token, role, userId) =>
        set({
          token,
          role,
          userId,
          isLoading: false,
          error: null,
        }),

      clearAuth: () =>
        set({
          token: null,
          role: null,
          userId: null,
          isLoading: false,
          error: null,
        }),

      initializeAuth: async () => {
        if (get().token) {
          try {
            // Add token verification logic if needed (e.g., API call to validate)
          } catch (error) {
            get().clearAuth();
          }
        }
      },
    }),
    {
      name: 'doctolib-auth',
      storage: createJSONStorage(() => localStorage), // Explicitly use localStorage
      partialize: (state) => ({
        token: state.token,
        role: state.role,
        userId: state.userId,
      }),
    }
  )
);