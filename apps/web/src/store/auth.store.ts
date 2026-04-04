import { create } from 'zustand'

type User = {
  id: string
  name: string
  email: string
}

type AuthStoreType = {
  accessToken: string | null
  user: User | null
  setAuth: (token: string, user: User) => void
  setAccessToken: (token: string) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthStoreType>((set) => ({
  accessToken: null,
  user: null,
  setAuth: (token: string, user: User) => set({ accessToken: token, user }),
  setAccessToken: (token: string) => set({ accessToken: token }),
  clearAuth: () => set({ accessToken: null, user: null }),
}))
