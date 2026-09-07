// app/middleware/admin.ts
export default defineNuxtRouteMiddleware(() => {
  const { isAuthenticated, isAdmin } = useAuth()
  const token = useCookie('auth_token')

  if (!isAuthenticated.value && !token.value) {
    return navigateTo('/login')
  }

  if (isAuthenticated.value && !isAdmin.value) {
    return navigateTo('/dashboard')
  }
})