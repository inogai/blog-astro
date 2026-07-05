import * as React from 'react'
import { cn } from '@/lib/utils'
import { CopyButton } from './CopyButton'

type Direction = 'escape' | 'unescape'

interface JsonEscapeProps {
  labels: {
    escape: string
    unescape: string
    input: string
    output: string
    inputPlaceholder: string
    escapedPlaceholder: string
    unescapedPlaceholder: string
    direction: string
    bothDirections: string
    example: string
    clear: string
    swap: string
    copy: string
    copied: string
    errorInvalidJson: string
    modeHint: string
  }
}

/**
 * Escape/unescape text for embedding inside JSON string literals.
 *
 * - escape: raw text -> JSON-safe string body (no surrounding quotes), so the
 *   result can be dropped between double quotes: `"${escaped}"`.
 * - unescape: a JSON string body (with or without surrounding quotes) -> raw text.
 *
 * We deliberately reuse the JSON machinery for correctness:
 *  - escape: JSON.stringify(s) returns the quoted string; we strip the quotes.
 *  - unescape: wrap the body in quotes (if not already quoted) and JSON.parse it.
 */
function escapeJsonBody(input: string): string {
  const quoted = JSON.stringify(input)
  // strip surrounding double quotes
  return quoted.slice(1, -1)
}

function unescapeJsonBody(input: string): { ok: true; value: string } | { ok: false; error: string } {
  const trimmed = input.trim()
  if (trimmed === '') return { ok: true, value: '' }
  const hasQuotes = trimmed.startsWith('"') && trimmed.endsWith('"')
  const toParse = hasQuotes ? trimmed : `"${trimmed}"`
  try {
    const parsed = JSON.parse(toParse)
    if (typeof parsed !== 'string') {
      return { ok: false, error: 'Parsed value is not a string.' }
    }
    return { ok: true, value: parsed }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) }
  }
}

export default function JsonEscape({ labels }: JsonEscapeProps) {
  const [direction, setDirection] = React.useState<Direction>('escape')
  const [input, setInput] = React.useState('')
  const [output, setOutput] = React.useState('')
  const [error, setError] = React.useState<string | null>(null)

  // Recompute output whenever input or direction changes.
  React.useEffect(() => {
    if (input === '') {
      setOutput('')
      setError(null)
      return
    }
    if (direction === 'escape') {
      setError(null)
      setOutput(escapeJsonBody(input))
    } else {
      const result = unescapeJsonBody(input)
      if (result.ok) {
        setError(null)
        setOutput(result.value)
      } else {
        setError(labels.errorInvalidJson + ' ' + result.error)
        setOutput('')
      }
    }
  }, [input, direction, labels.errorInvalidJson])

  const placeholder =
    direction === 'escape'
      ? labels.inputPlaceholder
      : labels.unescapedPlaceholder
  const outputPlaceholder =
    direction === 'escape'
      ? labels.escapedPlaceholder
      : labels.inputPlaceholder

  return (
    <div className="space-y-4">
      {/* Direction toggle */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">{labels.direction}</span>
        <div
          role="tablist"
          aria-label={labels.direction}
          className="inline-flex ring-1 ring-foreground/15"
        >
          {(['escape', 'unescape'] as Direction[]).map((dir) => (
            <button
              key={dir}
              role="tab"
              aria-selected={direction === dir}
              onClick={() => setDirection(dir)}
              className={cn(
                `
                  px-3 py-1 text-sm transition-colors
                  hover:bg-muted focus-visible:outline-1 focus-visible:ring-1
                  focus-visible:ring-ring/50
                `,
                direction === dir && 'bg-primary/20',
              )}
            >
              {dir === 'escape' ? labels.escape : labels.unescape}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">{labels.modeHint}</p>
      </div>

      <div
        className={`
          grid gap-4
          md:grid-cols-2
        `}
      >
        {/* Input */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">{labels.input}</label>
            <button
              type="button"
              onClick={() => {
                setInput('')
                setOutput('')
                setError(null)
              }}
              className="text-xs text-muted-foreground underline-offset-2 hover:underline"
            >
              {labels.clear}
            </button>
          </div>
          <textarea
            value={input}
            spellCheck={false}
            placeholder={placeholder}
            onChange={(e) => setInput(e.target.value)}
            className={cn(
              `
                min-h-[18rem] w-full resize-y rounded-none bg-muted/40 p-3
                font-mono text-sm leading-relaxed
                ring-1 ring-foreground/15
                focus:bg-background focus:outline-1 focus-visible:ring-1
                focus-visible:ring-ring/50
              `,
            )}
          />
        </div>

        {/* Output */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">{labels.output}</label>
            <CopyButton
              value={output}
              label={labels.copy}
              copiedLabel={labels.copied}
            />
          </div>
          <textarea
            value={output}
            readOnly
            spellCheck={false}
            placeholder={outputPlaceholder}
            className={cn(
              `
                min-h-[18rem] w-full resize-y rounded-none bg-muted/30 p-3
                font-mono text-sm leading-relaxed
                ring-1 ring-foreground/15
              `,
            )}
          />
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}

      <p className="text-xs text-muted-foreground">{labels.bothDirections}</p>
    </div>
  )
}