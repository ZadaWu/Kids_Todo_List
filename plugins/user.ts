import { useUserStore } from '~/state/userStore'

export default defineNuxtPlugin((nuxtApp) => {
  const userStore = useUserStore()

  return {
    provide: {
      user: computed(() => userStore.getUser),
      token: computed(() => userStore.getToken)
    }
  }
}) 