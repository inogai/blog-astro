import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import i18next from 'i18next'
import yaml from 'js-yaml'

// Load translations from YAML files
const localesPath = path.join(process.cwd(), 'src/i18n/locales')
const enTranslations = yaml.load(
  fs.readFileSync(path.join(localesPath, 'en.yml'), 'utf8'),
) as any
const zhTranslations = yaml.load(
  fs.readFileSync(path.join(localesPath, 'zh.yml'), 'utf8'),
) as any

i18next.init({
  lng: 'en',
  fallbackLng: 'en',
  resources: {
    en: {
      translation: enTranslations,
    },
    zh: {
      translation: zhTranslations,
    },
  },
})

export const t = i18next.t
export { Trans } from 'react-i18next'
