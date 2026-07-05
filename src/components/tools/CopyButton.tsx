import * as React from 'react'
import { cn } from '@/lib/utils'

/** Copy `text` to the clipboard. Falls back to a hidden textarea for non-secure contexts. */
async function copyText(text: string): Promise<void> {
  if (navigator?.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text)
      return
    } catch {
      /* fall through */
    }
  }
  const ta = document.createElement('textarea')
  ta.value = text
  ta.style.position = 'fixed'
  ta.style.opacity = '0'
  ta.style.pointerEvents = 'none'
  document.body.appendChild(ta)
  ta.select()
  try {
    document.execCommand('copy')
  } finally {
    document.body.removeChild(ta)
  }
}

interface CopyButtonProps extends React.ComponentProps<'button'> {
  value: string
  label: string
  copiedLabel: string
  showIconOnly?: boolean
}

/** Self-contained copy button that briefly shows a "Copied!" confirmation. */
export const CopyButton = React.forwardRef<HTMLButtonElement, CopyButtonProps>(
  function CopyButton({ value, label, copiedLabel, showIconOnly = false, className, ...props }, ref) {
    const [copied, setCopied] = React.useState(false)
    const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

    React.useEffect(() => () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }, [])

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          `
            inline-flex items-center justify-center text-xs
            transition-colors
            hover:bg-muted focus-visible:ring-1 focus-visible:ring-ring/50
            focus-visible:outline-1
          `,
          className,
        )}
        onClick={async (e) => {
          e.preventDefault()
          if (!value) return
          try {
            await copyText(value)
            setCopied(true)
            if (timerRef.current) clearTimeout(timerRef.current)
            timerRef.current = setTimeout(() => setCopied(false), 1200)
          } catch {
            /* ignore */
          }
        }}
        {...props}
      >
        {showIconOnly ? (
          copied ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-green-600 dark:text-green-400"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
            </svg>
          )
        ) : (
          copied ? copiedLabel : label
        )}
      </button>
    )
  },
)