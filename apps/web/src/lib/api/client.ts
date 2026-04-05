import { useAuthStore } from '@/store/auth.store'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

let refreshPromise: Promise<boolean> | null = null

async function tryRefreshToken() {
  if (refreshPromise) return refreshPromise

  refreshPromise = performRefresh().finally(() => {
    refreshPromise = null
  })

  return refreshPromise
}

async function performRefresh() {
  try {
    const response = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    })

    if (!response.ok) {
      return false
    }

    const data = await response.json()
    useAuthStore.getState().setAccessToken(data.data.accessToken)
    return true
  } catch {
    return false
  }
}

type FetchOptions = RequestInit & {
  params?: Record<string, string | number | boolean | undefined>
}

async function fetchClient<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { params, ...init } = options

  const fetchUrl = new URL(`${BASE_URL}${endpoint}`)
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) fetchUrl.searchParams.set(key, String(value))
    })
  }

  const accessToken = useAuthStore.getState().accessToken

  try {
    const response = await fetch(fetchUrl, {
      ...init,
      method: init.method,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        ...init.headers,
      },
    })

    if (response.status === 401) {
      const refreshed = await tryRefreshToken()

      if (refreshed) {
        const newToken = useAuthStore.getState().accessToken
        const retryResponse = await fetch(fetchUrl, {
          ...init,
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${newToken}`,
            ...init.headers,
          },
        })
        if (!retryResponse.ok) throw await retryResponse.json()

        return retryResponse.json()
      } else {
        useAuthStore.getState().clearAuth()
        window.location.href = '/login'
        throw new Error('Session expired')
      }
    }

    if (!response.ok) throw await response.json()
    return response.json()
  } catch (error) {
    throw error
  }
}

export const api = {
  get: <T>(endpoint: string, options?: FetchOptions) =>
    fetchClient<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, body: unknown, options?: FetchOptions) =>
    fetchClient<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),

  patch: <T>(endpoint: string, body: unknown, options?: FetchOptions) =>
    fetchClient<T>(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(body) }),

  delete: <T>(endpoint: string, options?: FetchOptions) =>
    fetchClient<T>(endpoint, { ...options, method: 'DELETE' }),
}
