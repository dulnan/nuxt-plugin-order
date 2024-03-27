# nuxt-plugin-order

A small build module for Nuxt 3 to enforce a specific order of plugins at buld
time.

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
      // Match plugins by their file path.
      // Note that only a single plugin may match.
      // The match is performed as "plugin.src.includes(v.pathMatch)".
      { pathMatch: 'pinia.mjs' },

      // Local plugin provided by your app.
      { pathMatch: 'initData.ts' },
    ],
    logSortedPlugins: true,
  },
})
```

## The problem

```typescript
export default defineNuxtPlugin(() => {
  const user = useUserStore()
  // "getActivePinia()" was called but there was no active Pinia.
})
```

Because you tried to use Pinia while it was not yet injected.

```typescript
export default defineNuxtPlugin(() => {
  const { $api } = useNuxtApp()
  await $api.loadSiteData()
  // Cannot read properties of undefined (reading 'loadSiteData')
})
```

Because you tried to use something provided by a plugin from an installed
dependency or one of your own plugins.

A classic example is something like this:

- Plugin A: Coming from a module that injects a global $api object
- Plugin B: A local plugin that adds a
  `$api.beforeRequest((request) => { request.headers.token = getUserToken() })`
  callback
- Plugin C: A local plugin that calls `$api.loadData()`

In this case, if plugin C is initialized _after_ plugin B, then the request made
by plugin C is missing the `beforeRequest` callback and its request will not
contain the authentication token header. We need an explicit order here.

Currently it's not possible to always enforce a specifc order of plugins. While
it's possible to define dependencies and a specific numeric order for custom
plugins (using the `dependsOn`, `order` or `enforce` properties in
`defineNuxtPlugin`), this may not always work when using plugins provided from
third party modules or layers.

In addition, a small change in a dependency could have a breaking impact on how
your app works: If such a module provided plugin changes its order after
updating dependencies, it could result in unexpected runtime behaviour.

This module is a small helper to enforce an explicit order of plugins at build
time, that is deterministic.

## How it works

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
this level might be very helpful and prevent potential bugs. But if you only
have local plugins, then you can already enforce a specific order by giving all
your plugins a name and then use `dependsOn` to let Nuxt determine the correct
order.
