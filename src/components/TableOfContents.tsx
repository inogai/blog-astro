import type { MarkdownHeading } from 'astro'
import { cva } from 'class-variance-authority'

interface Props {
  headings: MarkdownHeading[]
}

const headingClass = cva('', {
  variants: {
    depth: {
      2: 'ml-0 font-medium',
      3: 'ml-4 text-xs',
      4: 'ml-8 text-xs text-foreground/70',
    },
  },
})

export function TableOfContents({ headings }: Props) {
  if (headings.length === 0) {
    return null
  }

  const minDepth = Math.min(...headings.map(h => h.depth))

  const filteredHeadings = headings.filter(
    h => h.depth >= minDepth && h.depth <= minDepth + 2,
  )

  return (
    <nav className="sticky top-20 max-h-[calc(100vh-5rem)] overflow-y-auto">
      <ul className="space-y-1">
        {filteredHeadings.map(heading => (
          <li
            key={heading.slug}
            // @ts-expect-error: depth should be 2 | 3 | 4
            className={headingClass({ depth: heading.depth })}
          >
            <a
              href={`#${heading.slug}`}
              className={`
                block py-1 text-sm text-muted-foreground transition-colors
                hover:text-foreground
              `}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
