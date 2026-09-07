import { useAuth } from "~/composables/useAuth"

export default defineNuxtPlugin(async () => {
  const { user, fetchUser } = useAuth()
  const token = useCookie('auth_token')

  if (token.value && !user.value) {
    await fetchUser()
  }
})