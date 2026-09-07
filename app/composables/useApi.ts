export function useApi() {
  const config = useRuntimeConfig()
  const token = useCookie('auth_token')

  const api = $fetch.create({
    baseURL: `${config.public.apiBase}/api`,
    onRequest({ options }) {
      if (token.value) {
        options.headers.set('Authorization', `Bearer ${token.value}`)
      }
      options.headers.set('Accept', 'application/json')
    },
    onResponseError({ response }) {
      if (response.status === 401) {
        token.value = null
        navigateTo('/login')
      }
    },
  })

  return api
}