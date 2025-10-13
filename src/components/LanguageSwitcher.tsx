import { LanguagesIcon } from 'lucide-react'
import React, { useRef } from 'react'
import { t } from '@/i18n/ui'

interface LanguageSwitcherProps {
  locale: string
}

export default function LanguageSwitcher({ locale }: LanguageSwitcherProps) {
  const selectRef = useRef<HTMLSelectElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value
    const currentPath = window.location.pathname
    const newPath = currentPath.replace(/^\/[^/]+/, `/${newLocale}`)
    window.location.href = newPath
  }

  return (
    <div className="relative mr-2">
      <LanguagesIcon className="inline-block h-5 w-5" aria-hidden="true" />
      <select
        ref={selectRef}
        value={locale}
        onChange={handleChange}
        aria-label={t('nav.language')}
        className={`
          absolute inset-0 cursor-pointer overflow-clip rounded border
          bg-background text-foreground opacity-0
          md:static md:ml-2 md:size-auto md:px-2 md:py-1 md:opacity-100
          md:hover:opacity-50
        `}
      >
        <option value="en">English</option>
        <option value="zh">繁體中文</option>
      </select>
    </div>
  )
}
