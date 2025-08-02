<template>
  <div class="buttons">
    <a href="http://localhost:3080">Main home</a>
    <a href="http://localhost:3080/test">Main test</a>
    <a href="http://tenant.localhost:3080/">Tenant home</a>
    <a href="http://tenant.localhost:3080/test">Tenant test</a>
  </div>
  <div v-if="tenant">
    Tenant should be detected as <b>{{ tenant }}</b>
  </div>
</template>

<script setup>
import { useTenant } from '~~/utils/tenant'

const { tenant } = useTenant()
</script>

<style scoped>
  .buttons {display: flex; gap: 10px; margin: 10px 0 100px 0}
</style>