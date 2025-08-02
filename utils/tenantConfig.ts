// Centralized tenant configuration
// You can easily modify these settings to change tenant detection behavior

export interface TenantConfig {
  // List of subdomains that should NOT be considered as tenants
  excludedSubdomains: string[]
  
  // List of domains that should be considered as tenant domains
  tenantDomains: string[]
  
  // Whether to include port numbers in hostname processing
  includePorts: boolean
  
  // Custom tenant extraction function (if you need complex logic)
  customExtractor?: (hostname: string) => string | null
}

// Default configuration
export const defaultTenantConfig: TenantConfig = {
  excludedSubdomains: ['dev', 'www', 'localhost', '127.0.0.1'],
  tenantDomains: ['localhost'], // Add your production domains here
  includePorts: false,
  // Example of custom extractor:
  // customExtractor: (hostname) => {
  //   if (hostname.startsWith('tenant.')) return 'tenant'
  //   return null
  // }
}

// Extract tenant from hostname using configuration
export function extractTenantFromHost(hostname: string, config: TenantConfig = defaultTenantConfig): string | null {
  if (!hostname) return null
  
  // Remove port if configured
  const cleanHostname = config.includePorts ? hostname : hostname.split(':')[0]
  
  if (!cleanHostname) return null
  
  // If custom extractor is provided, use it
  if (config.customExtractor) {
    return config.customExtractor(cleanHostname)
  }
  
  // Default logic: find first part that's not in excluded list
  // and is part of a known tenant domain
  const tenantDomain = config.tenantDomains.find(domain =>
    cleanHostname.endsWith(domain)
  )
  
  if (!tenantDomain) {
    return null
  }
  
  // Split into parts only if we have a tenant domain
  const parts = cleanHostname.split('.')
  
  // Find tenant part (should be the part before the tenant domain)
  const tenantIndex = parts.findIndex(part =>
    part !== tenantDomain && !config.excludedSubdomains.includes(part.toLowerCase())
  )
  
  return tenantIndex >= 0 ? parts[tenantIndex] ?? null : null
}

// Helper to get current tenant configuration
export function getTenantConfig(): TenantConfig {
  // You can extend this to load config from nuxt.config.ts, environment variables, etc.
  return defaultTenantConfig
}

// Helper to reload tenant configuration (useful for dynamic config changes)
export function reloadTenantConfig(): void {
  // This could be extended to reload config from external sources
  console.log('[tenantConfig] Configuration reloaded')
}