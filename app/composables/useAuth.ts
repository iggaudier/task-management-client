import { useApi } from "./useApi"

interface User {
  id: number
  name: string
  email: string
  role: 'user' | 'admin'
}

export function useAuth() {
  const user = useState<User | null>('auth-user', () => null)
  const token = useCookie('auth_token', {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    sameSite: 'strict',
  })
  const api = useApi()

  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  async function login(email: string, password: string) {
    const res = await api<{ user: User; token: string }>('/login', {
      method: 'POST',
      body: { email, password },
    })
    token.value = res.token
    user.value = res.user
  }

  async function register(name: string, email: string, password: string, password_confirmation: string) {
    const res = await api<{ user: User; token: string }>('/register', {
      method: 'POST',
      body: { name, email, password, password_confirmation },
    })
    token.value = res.token
    user.value = res.user
  }

  async function logout() {
    try {
      await api('/logout', { method: 'POST' })
    } finally {
      token.value = null
      user.value = null
      navigateTo('/login')
    }
  }

  async function fetchUser() {
    if (!token.value) return
    try {
      user.value = await api<User>('/user')
    } catch {
      token.value = null
      user.value = null
    }
  }

  return { user, isAuthenticated, isAdmin, login, register, logout, fetchUser }
}