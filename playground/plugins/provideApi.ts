import { defineNuxtPlugin } from '#imports'

export type SiteData = {
  siteName: string
}

export class Api {
  loadSiteData(): Promise<SiteData> {
    return Promise.resolve({
      siteName: 'nuxt-plugin-order Playground',
    })
  }
}

export default defineNuxtPlugin(() => {
  const api = new Api()
  return {
    provide: {
      api,
    },
  }
})
