import { defineNuxtPlugin } from '#imports'
import { useUserStore } from '~/stores/user'

export default defineNuxtPlugin({
  name: 'init-store',
  async setup() {
    const user = useUserStore()

    await user.load()
  },
})
