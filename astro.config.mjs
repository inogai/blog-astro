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

function cleanCalloutType(type) {
  return type.toLowerCase().replace(';', '')
}

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
      [
        remarkCallout,
        {
          /**
           * @param {{ type: string; isFoldable?: boolean; isOpen?: boolean }} callout
           */
          root: callout => ({
            tagName: callout.isFoldable ? 'details' : 'div',
            properties: {
              className: ['callout', `callout-${cleanCalloutType(callout.type)}`],
            },
          }),
          /**
           * @param {{ type: string; isFoldable?: boolean; isOpen?: boolean }} callout
           */
          icon: callout => ({
            tagName: 'span',
            properties: {
              className: ['callout-icon', 'iconify', `callout-icon-${cleanCalloutType(callout.type)}`],
            },
            children: '',
          }),
          /**
           * @param {{ type: string; isFoldable?: boolean; isOpen?: boolean }} callout
           */
          foldIcon: callout =>
            callout.isFoldable
              ? {
                  tagName: 'span',
                  properties: {
                    className: ['callout-fold-icon', 'iconify'],
                  },
                  children: '',
                }
              : undefined,
        },
      ],
      [
        remarkWikiLink,
        {
          aliasDivider: '|',
          // Expects <domain>/[locale]/blog/[slug]/ instead of .../[slug]
          /** @type { (permalink: string) => string } */
          hrefTemplate: permalink => `../${permalink.slice(7)}`,
        },
      ],
    ],
  },

  integrations: [
    expressiveCode({
      plugins: [ecPluginLineNumbers()],
      defaultProps: {
        frame: 'code',
      },
    }),
    react(),
    alpine(),
    icon(),
  ],
})
