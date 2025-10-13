import antfu from '@antfu/eslint-config'
import betterTailwindcss from 'eslint-plugin-better-tailwindcss'

export default antfu(
  {
    formatter: true,
    astro: true,
    react: true,
  },
  {
    rules: { 'style/quotes': ['error', 'single', { avoidEscape: true }] },
  },
  { // allow trailing spaces rule in markdown files
    // otherwise eslint may break markdown formatting
    rules: { 'style/no-trailing-spaces': ['error'] },
    ignores: ['*.md', '*.mdx'],
  },
  {
    plugins: {
      'better-tailwindcss': betterTailwindcss,
    },
    rules: {
      ...betterTailwindcss.configs.recommended.rules,
      'better-tailwindcss/no-unregistered-classes': [
        'error',
        { detectComponentClasses: true },
      ],
    },
    settings: {
      'better-tailwindcss': {
        entryPoint: 'src/styles/global.css',
      },
    },
  },
)
