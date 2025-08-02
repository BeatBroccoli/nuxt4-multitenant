export default defineNuxtPlugin((nuxtApp) => {
  // On server, get tenant from event context and add to payload
  if (process.server) {
    const event = nuxtApp.ssrContext?.event
    const tenant = event?.context?.tenant || null
    nuxtApp.payload.tenant = tenant
  }
})