import { defineNuxtPlugin } from '#imports'
import { useUserStore } from '~/stores/user'

export default defineNuxtPlugin(async () => {
  const user = useUserStore()

  await user.load()
})
