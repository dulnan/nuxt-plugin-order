import { useNuxtApp } from '#app'
import type { Api } from '~/plugins/provideApi'

export default function (): Api {
  const app = useNuxtApp()
  return app.$api
}
