export default defineNuxtConfig({
  ssr: true,
  modules: ['@pinia/nuxt', '../src/module'],

  imports: {
    autoImport: false,
  },

  pluginOrder: {
    order: [
      { pathMatch: 'provideApi.ts' },
      { pathMatch: '@pinia/nuxt/dist/runtime/plugin.vue3.mjs' },
      { pathMatch: 'initStore.ts' },
      { pathMatch: 'loadGlobalData.ts' },
    ],
  },
})
