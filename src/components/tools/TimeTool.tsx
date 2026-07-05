import * as React from 'react'
import { cn } from '@/lib/utils'
import { CopyButton } from './CopyButton'

interface TimeFormatDef {
  /** i18n key under tools.time.formats */
  key: string
  /** Compute the display string from a Date. */
  format: (d: Date) => string
  /** The literal template string a user can paste into their editor. */
  template: (d: Date) => string
}

/** Pads to 2 digits with a leading zero. */
const pad = (n: number) => String(n).padStart(2, '0')

/** Local components for building custom format strings. */
function localParts(d: Date) {
  return {
    Y: d.getFullYear(),
    M: pad(d.getMonth() + 1),
    D: pad(d.getDate()),
    H: pad(d.getHours()),
    m: pad(d.getMinutes()),
    s: pad(d.getSeconds()),
    ms: String(d.getMilliseconds()).padStart(3, '0'),
    tz: (() => {
      const off = -d.getTimezoneOffset()
      const sign = off >= 0 ? '+' : '-'
      const abs = Math.abs(off)
      return `UTC${sign}${pad(Math.floor(abs / 60))}:${pad(abs % 60)}`
    })(),
  }
}

/**
 * The first format MUST be a digits-only, no-space, underscore-joined string
 * suitable for use directly as a filename (e.g. 20260705_183245).
 */
const formats: TimeFormatDef[] = [
  {
    key: 'filename',
    format: (d) => {
      const p = localParts(d)
      return `${p.Y}${p.M}${p.D}_${p.H}${p.m}${p.s}`
    },
    template: (d) => {
      const p = localParts(d)
      // literal-ish template: show the pattern with the live value alongside.
      return `YYYYMMDD_HHmmss  ->  ${p.Y}${p.M}${p.D}_${p.H}${p.m}${p.s}`
    },
  },
  {
    key: 'iso',
    format: (d) => d.toISOString(),
    template: (d) => `toISOString()  ->  ${d.toISOString()}`,
  },
  {
    key: 'isoLocal',
    format: (d) => {
      const p = localParts(d)
      return `${p.Y}-${p.M}-${p.D}T${p.H}:${p.m}:${p.s}`
    },
    template: (d) => {
      const p = localParts(d)
      return `YYYY-MM-DDTHH:mm:ss  ->  ${p.Y}-${p.M}-${p.D}T${p.H}:${p.m}:${p.s}`
    },
  },
  {
    key: 'rfc3339',
    format: (d) => {
      // RFC 3339 is effectively ISO 8601 with timezone; reuse local ISO form.
      const p = localParts(d)
      return `${p.Y}-${p.M}-${p.D}T${p.H}:${p.m}:${p.s}${p.tz.replace('UTC', '')}`
    },
    template: (d) => {
      const p = localParts(d)
      return `YYYY-MM-DDTHH:mm:ssZ  ->  ${p.Y}-${p.M}-${p.D}T${p.H}:${p.m}:${p.s}${p.tz.replace('UTC', '')}`
    },
  },
  {
    key: 'rfc2822',
    format: (d) => {
      // toUTCString produces e.g. "Sat, 05 Jul 2025 18:32:45 GMT"
      return d.toUTCString()
    },
    template: (d) => `toUTCString()  ->  ${d.toUTCString()}`,
  },
  {
    key: 'unix',
    format: (d) => String(Math.floor(d.getTime() / 1000)),
    template: (d) => `Math.floor(Date.now()/1000)  ->  ${String(Math.floor(d.getTime() / 1000))}`,
  },
  {
    key: 'unixMs',
    format: (d) => String(d.getTime()),
    template: (d) => `Date.now()  ->  ${String(d.getTime())}`,
  },
  {
    key: 'date',
    format: (d) => {
      const p = localParts(d)
      return `${p.Y}-${p.M}-${p.D}`
    },
    template: (d) => {
      const p = localParts(d)
      return `YYYY-MM-DD  ->  ${p.Y}-${p.M}-${p.D}`
    },
  },
  {
    key: 'time',
    format: (d) => {
      const p = localParts(d)
      return `${p.H}:${p.m}:${p.s}`
    },
    template: (d) => {
      const p = localParts(d)
      return `HH:mm:ss  ->  ${p.H}:${p.m}:${p.s}`
    },
  },
  {
    key: 'datetime',
    format: (d) => {
      const p = localParts(d)
      return `${p.Y}-${p.M}-${p.D} ${p.H}:${p.m}:${p.s}`
    },
    template: (d) => {
      const p = localParts(d)
      return `YYYY-MM-DD HH:mm:ss  ->  ${p.Y}-${p.M}-${p.D} ${p.H}:${p.m}:${p.s}`
    },
  },
  {
    key: 'locale',
    format: (d) => d.toLocaleString(),
    template: (d) => `toLocaleString()  ->  ${d.toLocaleString()}`,
  },
]

interface TimeToolProps {
  labels: {
    now: string
    format: string
    refresh: string
    pause: string
    resume: string
    copy: string
    copied: string
    copyTemplate: string
    timezone: string
    autoRefresh: string
    templateHint: string
    formats: Record<string, string>
  }
}

export default function TimeTool({ labels }: TimeToolProps) {
  const [now, setNow] = React.useState<Date>(() => new Date())
  const [paused, setPaused] = React.useState(false)

  React.useEffect(() => {
    if (paused) return
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [paused])

  const tzName = (() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || '—'
    } catch {
      return '—'
    }
  })()

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="font-mono text-2xl tabular-nums flex items-center gap-3">
          <CopyButton
            value={now.toISOString()}
            label={labels.copy}
            copiedLabel={labels.copied}
            showIconOnly={true}
            title={labels.copy}
            className="shrink-0 bg-muted/65 hover:bg-muted ring-1 ring-foreground/15 rounded-sm p-1.5 h-7 w-7 transition-all"
          />
          <span>{now.toISOString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setNow(new Date())}
            className="rounded-none px-2 py-1 text-xs ring-1 ring-foreground/15 hover:bg-muted"
          >
            {labels.refresh}
          </button>
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            className="rounded-none px-2 py-1 text-xs ring-1 ring-foreground/15 hover:bg-muted"
          >
            {paused ? labels.resume : labels.pause}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
        <span>{labels.timezone}: <span className="font-mono text-foreground">{tzName}</span></span>
        <span>{labels.autoRefresh}</span>
      </div>

      <div className="overflow-hidden rounded-none ring-1 ring-foreground/15">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left">
            <tr>
              <th className="px-3 py-2 font-medium">{labels.format}</th>
              <th className="px-3 py-2 font-medium">{labels.now}</th>
            </tr>
          </thead>
          <tbody>
            {formats.map((f, i) => {
              const value = f.format(now)
              const template = f.template(now)
              const label = labels.formats[f.key] ?? f.key
              return (
                <tr
                  key={f.key}
                  className={cn('align-top border-t border-foreground/5', i % 2 === 1 && 'bg-muted/20')}
                >
                  <td className="px-3 py-2 font-medium whitespace-nowrap">{label}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-start gap-3">
                      <CopyButton
                        value={value}
                        label={labels.copy}
                        copiedLabel={labels.copied}
                        showIconOnly={true}
                        title={labels.copy}
                        className="mt-0.5 shrink-0 bg-muted/65 hover:bg-muted ring-1 ring-foreground/15 rounded-sm p-1.5 h-7 w-7 transition-all"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="font-mono break-all">{value}</div>
                        <div className="mt-1 font-mono text-xs text-muted-foreground break-all">
                          {template}
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted-foreground">{labels.templateHint}</p>
    </div>
  )
}