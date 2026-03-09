import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

export type SiteLocale = {
  label: string
  lang: string
  sidebarMenuLabel?: string
  darkModeSwitchLabel?: string
  outlineTitle?: string
  returnToTopLabel?: string
  translateMenuLabel?: string
  docFooter?: {
    prev?: string
    next?: string
  }
  nav: Array<{ text: string; link: string }>
  sidebar: Array<{
    text: string
    items: Array<{ text: string; link: string }>
  }>
}

const vitepressRoot = dirname(fileURLToPath(import.meta.url))
const docsRoot = dirname(vitepressRoot)

function readLocaleFile(localePath: string): SiteLocale {
  return JSON.parse(readFileSync(localePath, 'utf8')) as SiteLocale
}

function loadSiteLocales(): Record<string, SiteLocale> {
  const localeEntries = readdirSync(docsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith('.'))
    .sort((left, right) => left.name.localeCompare(right.name))
    .map((entry) => {
      const localeFile = join(docsRoot, entry.name, 'locale.json')
      return existsSync(localeFile)
        ? [entry.name, readLocaleFile(localeFile)] as const
        : null
    })
    .filter((entry): entry is readonly [string, SiteLocale] => entry !== null)

  return Object.fromEntries(localeEntries)
}

export const siteLocales = loadSiteLocales()
