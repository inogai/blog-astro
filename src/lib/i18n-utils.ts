export const locales = ['en', 'zh'] as const

export type Locale = (typeof locales)[number]

interface LocalePaths { params: { locale: Locale } }

export function getI18nStaticPaths(): LocalePaths[]
export function getI18nStaticPaths<T extends Record<string, any>>(
  paths: T[],
): (T & LocalePaths)[]

export function getI18nStaticPaths(
  paths: Record<string, any>[] = [],
): ({
  params: {
    locale: Locale
  }
})[] {
  return locales.flatMap(locale =>
    paths.length > 0
      ? paths.map(({ props, ...params }) => ({
          params: { locale, ...params },
          props,
        }))
      : [{ params: { locale } }],
  )
}
