import { extractTenantFromHost } from "~~/utils/extractTenantFromHost";

export default defineEventHandler(async event => {
  try {
    const { hostname } = getRequestURL(event);

    // Only log in development
    if (process.dev) {
      console.log('[tenancy.middleware] Processing request:', {
        hostname,
        pathname: getRequestURL(event).pathname
      });
    }

    let tenantData = extractTenantFromHost(hostname);
    
    // Only log in development
    if (process.dev && tenantData) {
      console.log('[tenancy.middleware] Tenant detected:', {
        hostname,
        tenantData
      });
    }

    event.context.tenant = tenantData;
    event.context.hostname = hostname; // Add hostname to context for easier access
    
  } catch (error) {
    console.error("Error in tenancy plugin:", error);

    // Re-throw if it's already a createError (like our 404)
    if (error && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
  }
});