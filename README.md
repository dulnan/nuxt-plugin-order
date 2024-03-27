# nuxt-plugin-order

A module for Nuxt 3 to enforce a specific order of plugins at runtime.

## The problem

```typescript
const user = useUserStore()

// "getActivePinia()" was called but there was no active Pinia.
```

Because you tried to use Pinia while it was not yet injected.

```typescript
const { $api } = useNuxtApp()
await $api.loadSiteData()

// Cannot read properties of undefined (reading 'loadSiteData')
```

Because you tried to use something provided by an installed dependency or one of
your own plugins.

A typical example might be something like this:

- a module that provdes a plugin that injects a global $api object
- a local plugin that adds a
  `$api.beforeRequest((request) => { request.headers.token = getUserToken() })`
  callback
- a local plugin that calls `$api.loadData()`

In this case, if the second plugin is initialized _after_ the third, then the
request made by the third plugin is missing the `beforeRequest` callback and its
request will not contain the authentication token header.

Currently it's not possible to always enforce a specifc order of plugins. While
it's possible to define dependencies and a specific numeric order for custom
plugins (using the `dependsOn`, `order` or `enforce` properties in
`defineNuxtPlugin`), this may not always work when using plugins provided from
third party modules.

In addition, a small change in a dependency could have a breaking impact on how
your app works: If such a module provided plugin changes its order after
updating dependencies, it could result in unexpected runtime behaviour.

This module is a small helper to enforce an explicit order of plugins at build
time, that is deterministic.

## Setup

### Install module

```
npm install --save nuxt-plugin-order
```

### Configuration

```typescript
export default defineNuxtConfig({
  modules: ['nuxt-plugin-order'],

  pluginOrder: {
    order: [
      // Match a plugin by its name.
      { name: 'api-provider' },

      // For plugins that don't define a name you can instead match the path of the plugin file.
      // Note that only a single plugin may match.
      { pathMatch: 'pinia.mjs' },
    ],
    logSortedPlugins: true,
  },
})
```

The module requires that all plugins in your app have exactly **one** entry in
the `order` configuration, **except for**:

- plugins that contain "node_modules/nuxt" in their path
- plugins that contain "node_modules/@nuxt" in their path
- the plugin that contains "components.plugin.mjs" in its path

You can still add an `order` entry for any of these, but in general the order of
plugins that are provided by Nuxt itself is correct and very likely not the
cause of your problems.

If the module finds a plugin for which it can't determine an exact weight, it
will throw an error.

The final weight is determined as such:

- The initial weight is calculated based on the initial order as determined by
  Nuxt itself
- For plugins that are defined in `order`, their weight is calculated as
  `1000 + index_inside_order`
- The final weights are then sorted from _lowest to highest_.

By default, the module will then log the final order of all plugins to the
console. This can be disabled by setting `logSortedPlugins: false`.

## Should I use this?

Short answer: Probably not.

Long answer: It depends. If you have complex dependencies of several plugins
coming from different packages, layers, etc., then enforcing a strict order at
this level might be very helpful and prevent potential bugs.

If you only have local plugins, then you can already enforce a specific order by
giving all your plugins a name and then use `dependsOn` to let Nuxt determine
the correct order.
