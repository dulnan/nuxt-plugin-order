import { defineNuxtPlugin, useApi, useGlobalData } from '#imports'

export default defineNuxtPlugin(async () => {
  const globalData = useGlobalData()
  const api = useApi()
  const data = await api.loadSiteData()
  globalData.value.fetched = true
  globalData.value.site.siteName = data.siteName
})
