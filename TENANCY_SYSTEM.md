# Nuxt Subdomain Tenancy Routing System

## Overview
This system provides multi-tenant functionality by extracting tenant information from subdomains and making it available throughout the application in different rendering modes.

## Architecture Flow

### 1. Server-Side Rendering (SSR) Mode
```
Request: https://acme.example.com/dashboard
    ↓
1. Server middleware (tenancy.ts) intercepts request
    ↓
2. Extract hostname from 'host' header → "acme.example.com"
    ↓
3. extractTenantFromHost() parses subdomain → "acme"
    ↓
4. Store tenant in event.context.tenant
    ↓
5. Server renders page with tenant context
    ↓
6. HTML sent to client with tenant data embedded
```

**Key Benefits in SSR:**
- ✅ Tenant resolved on server before any rendering
- ✅ SEO-friendly with proper meta tags per tenant
- ✅ Fast initial page load with tenant-specific content
- ✅ Server-side API calls can use tenant context

### 2. Hydration Mode
```
SSR HTML loads → Client takes over → Hydration process
    ↓
1. Server has already resolved tenant during SSR
    ↓
2. Tenant data is serialized into the page state
    ↓
3. Client-side code hydrates with existing tenant context
    ↓
4. No additional tenant resolution needed
    ↓
5. Client continues with tenant-aware routing
```

**Key Benefits in Hydration:**
- ✅ Seamless transition from server to client
- ✅ No flash of unstyled content (FOUC)
- ✅ Tenant context preserved across SSR → client transition
- ✅ Optimal performance with no re-computation

### 3. Client-Side Only (SPA) Mode
```
Request: https://acme.example.com/dashboard
    ↓
1. Initial HTML shell loads (no server middleware)
    ↓
2. Client-side JavaScript executes
    ↓
3. Extract tenant from window.location.hostname
    ↓
4. Client-side tenant resolution and routing
    ↓
5. Dynamic content loading based on tenant
```

**Considerations for SPA Mode:**
- ⚠️ Tenant resolution happens after initial load
- ⚠️ Potential for loading states during tenant resolution
- ⚠️ SEO limitations for tenant-specific content
- ✅ Fast subsequent navigation within tenant

## Implementation Details

### Server Middleware (`tenancy.ts`)
- **Runs on every server request**
- **Extracts tenant from host header**
- **Enriches event context for downstream processing**
- **Provides development logging for debugging**

### Tenant Resolution Logic
```typescript
// Example extractTenantFromHost implementation
function extractTenantFromHost(hostname: string): string | null {
  const parts = hostname.split('.')
  
  // Skip localhost and IP addresses
  if (hostname.includes('localhost') || /^\d+\.\d+\.\d+\.\d+/.test(hostname)) {
    return null
  }
  
  // Extract first subdomain as tenant
  return parts.length > 2 ? parts[0] : null
}
```

### Usage Throughout Application
```typescript
// In server API routes
export default defineEventHandler(async (event) => {
  const tenant = event.context.tenant
  // Use tenant for database queries, configuration, etc.
})

// In pages/components (universal)
const { $tenant } = useNuxtApp()
// or
const tenant = useTenant() // if you create a composable
```

## Best Practices

### 1. Error Handling
- Handle missing or invalid tenants gracefully
- Provide fallback behavior for development
- Log tenant resolution for debugging

### 2. Performance Optimization
- Cache tenant configurations
- Use tenant context for API request optimization
- Consider tenant-specific bundling for large applications

### 3. Security Considerations
- Validate tenant permissions on server-side
- Sanitize tenant input to prevent injection
- Implement proper tenant isolation

### 4. Development Workflow
- Use tenant-aware development environment
- Mock different tenants for testing
- Implement tenant switching for admin users

## Common Patterns

### Tenant-Aware API Calls
```typescript
// Auto-inject tenant into API requests
async function apiCall(endpoint: string, options = {}) {
  const tenant = await $fetch('/api/tenant/current')
  return $fetch(endpoint, {
    ...options,
    headers: {
      'X-Tenant': tenant,
      ...options.headers
    }
  })
}
```

### Tenant-Specific Layouts
```vue
<template>
  <component :is="tenantLayout">
    <slot />
  </component>
</template>

<script setup>
const tenant = useTenant()
const tenantLayout = computed(() => `${tenant}Layout` || 'DefaultLayout')
</script>
```

### Database Tenant Isolation
```typescript
// In server API
export default defineEventHandler(async (event) => {
  const tenant = event.context.tenant
  
  // Scope database queries to tenant
  const data = await prisma.user.findMany({
    where: { tenantId: tenant }
  })
})
```

## Troubleshooting

### Common Issues
1. **Tenant not resolved in development**: Check localhost handling
2. **Hydration mismatches**: Ensure server and client resolve tenant consistently
3. **Performance issues**: Implement tenant caching strategies
4. **SEO problems in SPA**: Consider SSG for public tenant pages

### Debug Commands
```bash
# Check tenant resolution
curl -H "Host: acme.localhost:3000" http://localhost:3000/api/debug/tenant

# Monitor tenant middleware
NODE_ENV=development npm run dev
```