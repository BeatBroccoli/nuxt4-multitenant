import { extractTenantFromHost as extractTenantWithConfig, getTenantConfig } from './tenantConfig'

export function extractTenantFromHost(host: string): string | null {
  const config = getTenantConfig()
  const result = extractTenantWithConfig(host, config)
  
  console.log('[extractTenantFromHost] Input:', {
    host,
    config: {
      excludedSubdomains: config.excludedSubdomains,
      tenantDomains: config.tenantDomains
    },
    result
  });
  
  return result
}