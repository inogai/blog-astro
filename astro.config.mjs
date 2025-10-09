// @ts-check

import react from '@astrojs/react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import remarkGfm from 'remark-gfm'
import remarkCjkWrap from './src/lib/remarkCjkWrap'

// https://astro.build/config
export default defineConfig({
  site: 'https://www.inogai.com/',
  base: '/',

  vite: {
    plugins: [tailwindcss()],
  },

  markdown: {
    remarkPlugins: [remarkGfm, remarkCjkWrap],
  },

  integrations: [react()],
})
