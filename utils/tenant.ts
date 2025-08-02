import { extractTenantFromHost } from './extractTenantFromHost'
import { ref, computed, shallowRef } from 'vue'
import { useRequestEvent } from 'nuxt/app'

// Simple tenant getter that works everywhere
export function getTenant(): string | null {
  const hostname = typeof window !== 'undefined'
    ? window.location.hostname
    : useRequestEvent()?.context?.hostname
  
  if (!hostname) return null
  
  let tenant: string | null = null
  
  if (typeof window !== 'undefined') {
    // Client side
    tenant = extractTenantFromHost(hostname)
  } else {
    // Server side
    try {
      const event = useRequestEvent()
      tenant = event?.context?.tenant || null
    } catch {
      tenant = null
    }
  }
  
  return tenant
}

// Centralized reactive tenant store
const tenantStore = shallowRef<{
  tenant: string | null
  isInitialized: boolean
}>({
  tenant: null,
  isInitialized: false
})

// Reactive version for components
export function useTenant() {
  const initializeTenant = () => {
    if (tenantStore.value.isInitialized) return
    
    tenantStore.value.tenant = getTenant()
    tenantStore.value.isInitialized = true
  }
  
  // Initialize on first use
  if (!tenantStore.value.isInitialized) {
    initializeTenant()
  }
  
  const currentTenant = computed(() => tenantStore.value.tenant)
  
  return {
    tenant: currentTenant,
    tenantId: currentTenant,
    hasTenant: computed(() => !!currentTenant.value),
    initializeTenant,
    refreshTenant: () => {
      tenantStore.value.tenant = getTenant()
      tenantStore.value.isInitialized = true
    }
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