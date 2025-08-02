import { getTenant } from '../../utils/tenant'
import { ref, computed, shallowRef, readonly } from 'vue'
import { useRequestEvent, useNuxtApp } from 'nuxt/app'
import { useState } from '#app'

// Cache for tenant extraction results
const tenantCache = new Map<string, string | null>()

// Centralized reactive tenant store
const tenantStore = shallowRef<{
  tenant: string | null
  isInitialized: boolean
}>({
  tenant: null,
  isInitialized: false
})

// Unified useTenant composable that works with both SSR and client-side rendering
export function useTenant() {
  // Get tenant from server context (set by server middleware)
  const nuxtApp = useNuxtApp()
  
  // On server, get from context; on client, get from window.__NUXT__ payload
  const tenant = computed(() => {
    if (process.server) {
      return nuxtApp.ssrContext?.event?.context?.tenant || null
    } else {
      // On client, the tenant should be available from the server payload
      return nuxtApp.payload?.tenant || null
    }
  })
  
  return {
    tenant: readonly(tenant),
    hasTenant: computed(() => !!tenant.value),
    isTenant: (name: string) => tenant.value === name
  }
}

// Server-side only version to avoid hydration issues
export function useTenantServer() {
  const tenant = computed(() => {
    // Only run on server side
    if (process.server) {
      try {
        const event = useRequestEvent()
        return event?.context?.tenant || null
      } catch {
        return null
      }
    }
    return null
  })
  
  return {
    tenant,
    tenantId: tenant,
    hasTenant: computed(() => !!tenant.value),
  }
}