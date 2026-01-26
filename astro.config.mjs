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

// Run with `pnpm dev --force` to ignore cache after modifying this file.
/** @type {{ [key: string]: string }} */
const iconMap = {
  'note': 'pencil',
  'default': 'pencil',
  'info': 'informationsource-filled',
  'todo': 'ballot-box-with-check-filled',
  'abstract': 'clipboard-filled',
  'summary': 'clipboard-filled',
  'tl;dr': 'clipboard-filled',
  'tip': 'fire',
  'hint': 'fire',
  'important': 'glowing-star',
  'success': 'checkmark-circled-filled',
  'check': 'checkmark-circled-filled',
  'done': 'checkmark-circled-filled',
  'question': 'question-face',
  'help': 'question-face',
  'faq': 'question-face',
  'warning': 'alarm-clock-filled',
  'caution': 'high-voltage-sign',
  'attention': 'high-voltage-sign',
  'failure': 'black-cross-square-filled',
  'fail': 'black-cross-square-filled',
  'missing': 'black-cross-square-filled',
  'danger': 'bomb-filled',
  'error': 'bomb-filled',
  'bug': 'bug',
  'example': 'view-list',
  'quote': 'speech-balloon-small-filled',
  'cite': 'speech-balloon-small-filled',
}

/**
 * @param {string} type
 * @returns {string}
 */
function getIconName(type) {
  type = type.toLowerCase()

  if (!(type in iconMap)) {
    console.warn(`No icon mapped for callout type: "${type}", using default icon.`)
  }

  return iconMap[type] || iconMap.default
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
          icon: callout => ({
            tagName: 'span',
            properties: {
              'className': 'callout-icon',
              'data-icon': getIconName(callout.type),
              'data-callout-type': callout.type,
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
                    'className': 'callout-fold-icon',
                    'data-icon': callout.isOpen
                      ? 'downward-black-triangle'
                      : 'right-black-triangle',
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
          /** @type { (permalink: string) => string } */
          hrefTemplate: permalink => `./${permalink.slice(7)}`,
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
