import { navigateTo, defineNuxtRouteMiddleware } from '#imports'
import { useUserStore } from '~/stores/user'

/**
 * Redirects to the login page if the user is not logged in.
 */
export default defineNuxtRouteMiddleware(() => {
  const user = useUserStore()

  if (!user.isLoggedIn) {
    return navigateTo({
      name: 'login',
    })
  }
})
