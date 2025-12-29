// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxt/eslint", "@nuxt/ui"],
  app: {
    head: {
      script: [
        {
          src: "/js/socket.io.min.js",
          defer: true,
        },
      ],
    },
  },
  imports: {
    dirs: [
      // Scan top-level composables
      "~/composables",
    ],
  },

  devtools: {
    enabled: true,
  },

  css: ["~/assets/css/main.css"],

  routeRules: {
    "/": { prerender: true },
  },

  compatibilityDate: "2025-01-15",

  eslint: {
    config: {
      stylistic: {
        commaDangle: "never",
        braceStyle: "1tbs",
      },
    },
  },
  devServer: {
    port: 3001,
    host: "0.0.0.0",
  },
  runtimeConfig: {
    beHost: process.env.BE_HOST,
  },
  vite: {
    server: {
      allowedHosts: true,
    },
  },
});
