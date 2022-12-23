import { config } from 'dotenv'
import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import vue from '@astrojs/vue'
import react from '@astrojs/react'
import svelte from '@astrojs/svelte'
import prefetch from '@astrojs/prefetch'
import vercel from '@astrojs/vercel/serverless'

config()

// https://astro.build/config
export default defineConfig({
  site: process.env.PUBLIC_SITE_URL,
  server: {
    port: 3000,
  },
  output: 'server',
  adapter: vercel(),
})
