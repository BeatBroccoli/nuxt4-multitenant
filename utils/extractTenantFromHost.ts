export function extractTenantFromHost(host: string): string | null {
  const notTenant = ["dev", "www", "localhost"];
  const parts = host?.split(':')[0]?.split('.') ?? [];
  return parts.find(p => !notTenant.includes(p.toLowerCase())) || null
}