import { extractTenantFromHost as extractTenantWithConfig, getTenantConfig } from './tenantConfig'

export function extractTenantFromHost(host: string): string | null {
  const config = getTenantConfig()
  const result = extractTenantWithConfig(host, config)
  // console.log('[extractTenantFromHost] Tenant extracted:', { host, result });
  return result
}