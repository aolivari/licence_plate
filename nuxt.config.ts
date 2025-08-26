// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // Explicitly enable pages
  pages: true,

  // GitHub Pages configuration
  nitro: {
    prerender: {
      routes: ['/'],
    },
  },

  app: {
    baseURL: process.env.NODE_ENV === 'production' ? '/licence_plate/' : '/',
  },

  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/test-utils',
    '@nuxt/scripts',
    '@nuxt/content',
  ],
});
