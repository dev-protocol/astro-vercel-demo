import { config } from 'dotenv'
import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import vue from '@astrojs/vue'
import react from '@astrojs/react'
import svelte from '@astrojs/svelte'
import prefetch from '@astrojs/prefetch'

config()

// https://astro.build/config
export default defineConfig({
  site: process.env.PUBLIC_SITE_URL,
  server: {
    port: 3000,
  },
  integrations: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.includes('-'),
        },
      },
    }),
    react(),
    tailwind({
      config: {
        path: './tailwind.config.js',
      },
    }),
    svelte(),
    prefetch({
      throttle: 10,
    }),
  ],
  vite: {
    resolve: {
      conditions: [],
    },
  },
})
