// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  imports: {
    dirs: [
      './composables/**/*.{ts,js}',
      './utils/**/*.{ts,js}'
    ]
  },
  vite: {
    server: {
      allowedHosts: true
    }
  }
})
