import { extractTenantFromHost } from "~~/utils/extractTenantFromHost";

export default defineNuxtPlugin((nuxtApp) => {
  console.log('[tenant.client.ts] Nuxt tenant plugin loaded');

  if (import.meta.server) {
    const event = useRequestEvent();
    if (!event) return;

    // Persist tenant data to the Nuxt payload for client-side access
    nuxtApp.payload.tenant = event.context.tenant;
  }

  const host = window?.location?.hostname;
  const tenant = extractTenantFromHost(host);
  if (tenant) nuxtApp.payload.tenant = tenant;
  
});
