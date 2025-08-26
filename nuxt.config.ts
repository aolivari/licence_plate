// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // Enable static site generation
  nitro: {
    preset: 'netlify-static',
    prerender: {
      routes: ['/']
    }
  },

  // Configuration for deployment
  app: {
    baseURL: '/'
  },

  // Only essential modules for deployment
  modules: [
    '@nuxt/eslint'
  ],

  // Ensure proper static generation
  ssr: true
});
