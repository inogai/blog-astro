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
  note: 'dinkie-icons--pencil',
  default: 'dinkie-icons--pencil',
  info: 'dinkie-icons--informationsource-filled',
  todo: 'dinkie-icons--ballot-box-with-check-filled',
  abstract: 'dinkie-icons--clipboard-filled',
  summary: 'dinkie-icons--clipboard-filled',
  'tl;dr': 'dinkie-icons--clipboard-filled',
  tip: 'dinkie-icons--fire',
  hint: 'dinkie-icons--fire',
  important: 'dinkie-icons--glowing-star',
  success: 'dinkie-icons--checkmark-circled-filled',
  check: 'dinkie-icons--checkmark-circled-filled',
  done: 'dinkie-icons--checkmark-circled-filled',
  question: 'dinkie-icons--question-face',
  help: 'dinkie-icons--question-face',
  faq: 'dinkie-icons--question-face',
  warning: 'dinkie-icons--alarm-clock-filled',
  caution: 'dinkie-icons--high-voltage-sign',
  attention: 'dinkie-icons--high-voltage-sign',
  failure: 'dinkie-icons--black-cross-square-filled',
  fail: 'dinkie-icons--black-cross-square-filled',
  missing: 'dinkie-icons--black-cross-square-filled',
  danger: 'dinkie-icons--bomb-filled',
  error: 'dinkie-icons--bomb-filled',
  bug: 'dinkie-icons--bug',
  example: 'dinkie-icons--view-list',
  quote: 'dinkie-icons--speech-balloon-small-filled',
  cite: 'dinkie-icons--speech-balloon-small-filled',
}

/**
 * @param {string} type
 * @returns {string}
 */
function getIconName(type) {
  type = type.toLowerCase()

  if (!(type in iconMap)) {
    console.warn(
      `No icon mapped for callout type: "${type}", using default icon.`,
    )
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
              className: ['callout-icon', 'iconify', getIconName(callout.type)],
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
                    className: [
                      'callout-fold-icon',
                      'iconify',
                      callout.isOpen
                        ? 'dinkie-icons--downward-black-triangle'
                        : 'dinkie-icons--right-black-triangle',
                    ],
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
