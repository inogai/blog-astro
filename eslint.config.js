import antfu from '@antfu/eslint-config'
import betterTailwindcss from 'eslint-plugin-better-tailwindcss'

export default antfu(
  {
    formatter: true,
    astro: true,
    react: true,
  },
  {
    rules: {
      'style/quotes': ['error', 'single', { avoidEscape: true }],
    },
  },
  {
    plugins: {
      'better-tailwindcss': betterTailwindcss,
    },
    rules: {
      ...betterTailwindcss.configs.recommended.rules,
    },
    settings: {
      'better-tailwindcss': {
        entryPoint: 'src/styles/global.css',
      },
    },
  },
)
