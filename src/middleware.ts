import { defineMiddleware } from 'astro:middleware'

// Detect user's preferred language and redirect accordingly
export const onRequest = defineMiddleware((context: any, next: any) => {
  const { pathname } = context.url

  const supportedLocales = ['en', 'zh']
  const localeMatch = pathname.match(/^\/([^/]+)/)

  if (localeMatch && supportedLocales.includes(localeMatch[1])) {
    return next()
  }

  // If no locale, detect preferred language and redirect
  const acceptLanguage = context.request.headers.get('accept-language') || 'en'
  const preferredLocale
    = supportedLocales.find(locale => acceptLanguage.includes(locale)) || 'en'

  const newPath = `/${preferredLocale}${pathname}`
  return context.redirect(newPath)
})
