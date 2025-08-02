import { extractTenantFromHost } from './extractTenantFromHost'
import { ref, computed } from 'vue'
import { useRequestEvent } from 'nuxt/app'

// Simple tenant getter that works everywhere
export function getTenant(): string | null {
  if (typeof window !== 'undefined') {
    // Client side
    return extractTenantFromHost(window.location.hostname)
  } else {
    // Server side
    try {
      const event = useRequestEvent()
      return event?.context?.tenant || null
    } catch {
      return null
    }
  }
}

// Reactive version for components
export function useTenant() {
  const tenant = ref<string | null>(null)
  const isInitialized = ref(false)
  
  const initializeTenant = () => {
    if (isInitialized.value) return
    
    tenant.value = getTenant()
    isInitialized.value = true
    console.log('[useTenant] Tenant initialized:', tenant.value)
  }
  
  // Initialize on first use
  if (!isInitialized.value) {
    initializeTenant()
  }
  
  return {
    tenant: computed(() => tenant.value),
    tenantId: computed(() => tenant.value),
    hasTenant: computed(() => !!tenant.value),
    initializeTenant,
    refreshTenant: () => {
      tenant.value = getTenant()
      isInitialized.value = true
    }
  }
}