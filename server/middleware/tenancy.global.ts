import { extractTenantFromHost } from "~~/utils/extractTenantFromHost";

export default defineEventHandler(async event => {
  try {
    const { hostname, pathname } = getRequestURL(event);

    let tenantData = extractTenantFromHost(hostname);

    event.context.tenant = tenantData;
    
  } catch (error) {
    console.error("Error in tenancy plugin:", error);

    // Re-throw if it's already a createError (like our 404)
    if (error && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
  }
});