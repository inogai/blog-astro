// @ts-check
import alpine from '@astrojs/alpinejs'
import react from '@astrojs/react'
import { pluginLineNumbers as ecPluginLineNumbers } from '@expressive-code/plugin-line-numbers'
import remarkCallout from '@r4ai/remark-callout'
import tailwindcss from '@tailwindcss/vite'
import expressiveCode from 'astro-expressive-code'
import icon from 'astro-icon'
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
      [
        remarkWikiLink,
        {
          aliasDivider: '|',
          /** @type { (permalink: string) => string } */
          hrefTemplate: permalink => `./${permalink.slice(7)}`,
        },
      ],
    ],
  },

  integrations: [
    expressiveCode({
      plugins: [
        ecPluginLineNumbers(),
      ],
      defaultProps: {
        frame: 'code',
      },
    }),
    react(),
    alpine(),
    icon(),
  ],
})
