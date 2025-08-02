## How to test
$ npm install
$ npx nuxt cleanup; npm run dev
The server should be running on http://tenant.localhost:3080

## Intresting files
Nuxt Router: \node_modules\nuxt\dist\pages\runtime\plugins\router.js


# Tenant Usage Examples
This document shows how to use the new centralized tenant system across your application.

## 1. In Components

```vue
<script setup>
// Basic tenant access
const { tenant, hasTenant } = useTenant()

// Display tenant info
if (hasTenant.value) {
  console.log('Current tenant:', tenant.value)
}
</script>

<template>
  <div>
    <h1>Welcome{{ tenant ? ` to ${tenant}` : '' }}!</h1>
    <p v-if="hasTenant">You are on a tenant-specific site</p>
    <p v-else>You are on the main site</p>
  </div>
</template>
```

## 2. In Composables

```typescript
// composables/useApi.ts
import { useTenant } from '~/composables/useTenant'

export function useApi() {
  const { tenant } = useTenant()
  
  const getApiUrl = () => {
    if (tenant.value) {
      return `https://${tenant.value}.api.example.com`
    }
    return 'https://api.example.com'
  }
  
  return {
    getApiUrl,
    tenant
  }
}
```

## 3. In API Routes

```typescript
// server/api/users.get.ts
export default defineEventHandler(async (event) => {
  const { tenant } = useTenant()
  
  if (tenant.value) {
    // Tenant-specific logic
    return await getUsersForTenant(tenant.value)
  }
  
  // Main site logic
  return await getAllUsers()
})
```

## 4. In Middleware

```typescript
// server/middleware/auth.ts
export default defineEventHandler(async (event) => {
  const { tenant, hasTenant } = useTenant()
  
  if (hasTenant.value) {
    // Apply tenant-specific auth
    event.context.tenantId = tenant.value
  }
})
```

## 5. In Plugins

```typescript
// plugins/tenant-analytics.ts
export default defineNuxtPlugin((nuxtApp) => {
  const { tenant } = useTenant()
  
  if (tenant.value) {
    // Initialize tenant-specific analytics
    initAnalytics({
      tenant: tenant.value
    })
  }
})
```

## 6. In Layouts

```vue
<!-- layouts/default.vue -->
<script setup>
const { tenant } = useTenant()
</script>

<template>
  <div :class="{ 'tenant-site': tenant }">
    <Header />
    <NuxtPage />
    <Footer />
  </div>
</template>
```

## 7. In Store/Pinia

```typescript
// stores/tenant.ts
export const useTenantStore = defineStore('tenant', () => {
  const { tenant, hasTenant } = useTenant()
  
  return {
    tenant,
    hasTenant,
    isTenant: computed(() => hasTenant.value)
  }
})
```

## 8. In Utils

```typescript
// utils/tenantHelpers.ts
import { useTenant } from '~/composables/useTenant'

export function getTenantSpecificPath(path: string) {
  const { tenant } = useTenant()
  
  if (tenant.value) {
    return `/${tenant.value}${path}`
  }
  
  return path
}
```

## 9. In Server Utils

```typescript
// server/utils/tenantDatabase.ts
import { useTenant } from '#imports'

export function getTenantDatabase() {
  const { tenant } = useTenant()
  
  if (tenant.value) {
    return `tenant_${tenant.value}_db`
  }
  
  return 'main_db'
}
```

## 10. Dynamic Configuration

You can easily modify tenant detection by updating `utils/tenantConfig.ts`:

```typescript
// utils/tenantConfig.ts
export const defaultTenantConfig: TenantConfig = {
  excludedSubdomains: ['dev', 'www', 'localhost', '127.0.0.1'],
  tenantDomains: ['localhost', 'example.com'], // Add your production domains
  includePorts: false,
  customExtractor: (hostname) => {
    // Custom logic for complex tenant detection
    if (hostname.startsWith('client.')) return 'client'
    if (hostname.startsWith('partner.')) return 'partner'
    return null
  }
}
```

## Benefits of This System

1. **Centralized Logic**: Single source of truth for tenant detection
2. **Consistent Access**: Same API across components, composables, and server-side code
3. **Easy Configuration**: Modify tenant detection in one place
4. **Type Safety**: Full TypeScript support
5. **Reactive**: Automatically updates when tenant changes
6. **Flexible**: Supports custom extraction logic
7. **Debuggable**: Built-in logging for troubleshooting