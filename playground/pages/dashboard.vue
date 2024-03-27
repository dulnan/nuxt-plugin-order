<template>
  <div>
    <h1>User dashboard</h1>
  </div>
</template>

<script setup lang="ts">
import { definePageMeta } from '#imports'

definePageMeta({
  middleware: ['logged-in-only'],
})
</script>
