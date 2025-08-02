import { extractTenantFromHost } from "~~/utils/extractTenantFromHost";

export default defineEventHandler(async event => {
  try {
    const { hostname, pathname } = getRequestURL(event);

    console.log('[tenancy.middleware] Processing request:', {
      hostname,
      pathname,
      fullHost: getRequestURL(event).href
    });

    let tenantData = extractTenantFromHost(hostname);
    
    console.log('[tenancy.middleware] Tenant detection result:', {
      hostname,
      tenantData,
      extractedParts: hostname?.split(':')[0]?.split('.')
    });

    event.context.tenant = tenantData;
    
  } catch (error) {
    console.error("Error in tenancy plugin:", error);

    // Re-throw if it's already a createError (like our 404)
    if (error && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
  }
});