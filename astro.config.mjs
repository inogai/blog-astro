// @ts-check

import react from '@astrojs/react'
import remarkCallout from '@r4ai/remark-callout'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import remarkGfm from 'remark-gfm'
import remarkWikiLink from 'remark-wiki-link'
import remarkCjkWrap from './src/lib/remarkCjkWrap'

// https://astro.build/config
export default defineConfig({
  site: 'https://www.inogai.com/',
  base: '/',

  vite: {
    plugins: [tailwindcss()],
  },

  markdown: {
    remarkPlugins: [
      remarkGfm,
      remarkCjkWrap,
      remarkCallout,
      [remarkWikiLink, {
        aliasDivider: '|',
        /** @type { (permalink: string) => string } */
        hrefTemplate: permalink => `./${permalink.slice(7)}`,
      }],
    ],
  },

  integrations: [react()],
})
