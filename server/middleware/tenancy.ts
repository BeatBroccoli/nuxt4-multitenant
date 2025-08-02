import { extractTenantFromHost } from '~~/utils/extractTenantFromHost'

export default defineEventHandler(async (event) => {
  const hostname = getHeader(event, 'host') || ''
  const tenant = extractTenantFromHost(hostname)
  
  // Store tenant in event context
  event.context.tenant = tenant
})