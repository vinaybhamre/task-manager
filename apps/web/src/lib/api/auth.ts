import { api } from './client'

type AuthResponse = {
  data: {
    user: {
      id: string
      name: string
      email: string
    }
    accessToken: string
  }
}

export const register = async (body: { name: string; email: string; password: string }) => {
  const response = await api.post<AuthResponse>('/auth/register', body)
  return response.data
}

export const login = async (body: { email: string; password: string }) => {
  const response = await api.post<AuthResponse>('/auth/login', body)
  return response.data
}

export const logout = async () => {
  await api.post('/auth/logout', null)
}
