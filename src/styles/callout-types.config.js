import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const calloutTypes = [
  {
    types: ['info', 'todo'],
    color: 'blue',
    icon: 'dinkie-icons--informationsource-filled',
  },
  {
    types: ['abstract', 'summary', 'tldr'],
    color: 'cyan',
    icon: 'dinkie-icons--clipboard-filled',
  },
  {
    types: ['tip', 'hint', 'important'],
    color: 'cyan',
    icon: 'dinkie-icons--fire',
  },
  {
    types: ['success', 'check', 'done'],
    color: 'green',
    icon: 'dinkie-icons--checkmark-circled-filled',
  },
  {
    types: ['question', 'help', 'faq'],
    color: 'purple',
    icon: 'dinkie-icons--speech-balloon-question',
  },
  {
    types: ['warning', 'caution', 'attention'],
    color: 'orange',
    icon: 'dinkie-icons--public-address-loudspeaker',
  },
  {
    types: ['failure', 'fail', 'missing', 'danger', 'error'],
    color: 'red',
    icon: 'dinkie-icons--black-cross-square-filled',
  },
  {
    types: ['bug'],
    color: 'red',
    icon: 'dinkie-icons--bug',
  },
  {
    types: ['example'],
    color: 'purple',
    icon: 'dinkie-icons--view-list',
  },
  {
    types: ['quote', 'cite'],
    color: 'gray',
    icon: 'dinkie-icons--speech-balloon',
  },
]

function generateCalloutCSS() {
  const rules = calloutTypes
    .flatMap(({ types, color, icon }) => {
      const selectors = types
        .map(type => `.callout-${type}`)
        .join(',\n  ')

      const iconSelector = types.map(type => `.callout-icon-${type}`).join(',\n  ')

      return `  ${selectors} {
    & {
      border-color: var(--callout-${color}-border);
      background-color: var(--callout-${color}-bg);
    }

    [data-callout-title] {
      color: var(--callout-${color});
    }
  }

  ${iconSelector} {
    @apply ${icon};
  }`
    })
    .join('\n')

  return `@layer utilities {
${rules}
}`
}

function writeCalloutCSS() {
  const css = generateCalloutCSS()
  const outputPath = join(__dirname, 'callout-types.css')
  writeFileSync(outputPath, css)
  console.log(`Generated callout CSS at ${outputPath}`)
}

if (process.argv[1] === __filename) {
  writeCalloutCSS()
}
