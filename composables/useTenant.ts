import { ref, computed } from 'vue'
import { extractTenantFromHost } from '../utils/extractTenantFromHost'
import { useRequestEvent } from 'nuxt/app'

// Centralized tenant store
const tenant = ref<string | null>(null)
const isInitialized = ref(false)

export function useTenant() {
  // Initialize tenant data
  const initializeTenant = () => {
    if (isInitialized.value) return
    
    if (typeof window !== 'undefined') {
      // Client side
      const host = window?.location?.hostname
      tenant.value = extractTenantFromHost(host)
    } else {
      // Server side
      try {
        const event = useRequestEvent()
        tenant.value = event?.context?.tenant || null
      } catch {
        tenant.value = null
      }
    }
    
    isInitialized.value = true
    console.log('[useTenant] Tenant initialized:', tenant.value)
  }

  // Computed property for reactive tenant access
  const currentTenant = computed(() => {
    if (!isInitialized.value) {
      initializeTenant()
    }
    return tenant.value
  })

  // Check if tenant is active
  const hasTenant = computed(() => !!currentTenant.value)

  // Get tenant ID (alias for currentTenant)
  const tenantId = computed(() => currentTenant.value)

  // Utility to refresh tenant (useful if hostname changes)
  const refreshTenant = () => {
    if (typeof window !== 'undefined') {
      // Client side
      const host = window?.location?.hostname
      tenant.value = extractTenantFromHost(host)
    } else {
      // Server side
      try {
        const event = useRequestEvent()
        tenant.value = event?.context?.tenant || null
      } catch {
        tenant.value = null
      }
    }
    isInitialized.value = true
    console.log('[useTenant] Tenant refreshed:', tenant.value)
  }

  return {
    tenant: currentTenant,
    tenantId,
    hasTenant,
    initializeTenant,
    refreshTenant
  }
}